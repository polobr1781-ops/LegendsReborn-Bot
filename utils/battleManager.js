const { EmbedBuilder } = require('discord.js');
const { db } = require('./database.js');
const { habilidades, calcularDanoHabilidade } = require('./habilidades.js');

const batalhasAtivas = new Map();
const cooldownsHabilidades = new Map();

function calcularStats(playerData) {
    const atributos = playerData.atributos;
    const bonusEquip = { forca: 0, destreza: 0, constituicao: 0, inteligencia: 0 };
    
    const stats = {
        hpMax: 100 + (atributos.constituicao * 10) + (bonusEquip.constituicao * 10),
        mpMax: 50 + (atributos.inteligencia * 5) + (bonusEquip.inteligencia * 5),
        ataque: 10 + (atributos.forca * 2) + (bonusEquip.forca * 2),
        defesa: 5 + (atributos.constituicao * 1.5) + (bonusEquip.constituicao * 1.5),
        velocidade: atributos.destreza + bonusEquip.destreza,
        esquiva: Math.min(5 + (atributos.destreza * 0.5), 40),
        critico: Math.min(5 + (atributos.destreza * 0.3), 30)
    };

    for (const [skillId, nivel] of Object.entries(playerData.habilidades || {})) {
        const skill = habilidades[skillId];
        if (skill && skill.tipo === 'Passiva') {
            const efeitos = skill.efeitos(nivel);
            if (efeitos.bonusHP) stats.hpMax += efeitos.bonusHP;
            if (efeitos.bonusMP) stats.mpMax += efeitos.bonusMP;
            if (efeitos.bonusEsquiva) stats.esquiva += efeitos.bonusEsquiva;
            if (efeitos.chanceCritico) stats.critico += efeitos.chanceCritico;
        }
    }

    return stats;
}

function criarBatalha(canalId, jogador1, jogador2, player1Data, player2Data) {
    const stats1 = calcularStats(player1Data);
    const stats2 = calcularStats(player2Data);

    const ordem = stats1.velocidade >= stats2.velocidade ? [0, 1] : [1, 0];

    const batalha = {
        canalId,
        jogadores: [
            {
                userId: jogador1.id,
                nome: jogador1.displayName || jogador1.username,
                playerData: player1Data,
                stats: stats1,
                hp: stats1.hpMax,
                mp: stats1.mpMax,
                buffs: [],
                debuffs: [],
                escudoAtivo: 0,
                evasaoAtiva: false
            },
            {
                userId: jogador2.id,
                nome: jogador2.displayName || jogador2.username,
                playerData: player2Data,
                stats: stats2,
                hp: stats2.hpMax,
                mp: stats2.mpMax,
                buffs: [],
                debuffs: [],
                escudoAtivo: 0,
                evasaoAtiva: false
            }
        ],
        turnoAtual: 0,
        ordemTurnos: ordem,
        turno: 1,
        iniciada: Date.now(),
        tempoLimite: 60000,
        timeoutId: null,
        log: []
    };

    batalhasAtivas.set(canalId, batalha);
    return batalha;
}

function getBatalha(canalId) {
    return batalhasAtivas.get(canalId);
}

function finalizarBatalha(canalId) {
    const batalha = batalhasAtivas.get(canalId);
    if (batalha && batalha.timeoutId) {
        clearTimeout(batalha.timeoutId);
    }
    batalhasAtivas.delete(canalId);
    cooldownsHabilidades.delete(canalId);
}

function getJogadorAtual(batalha) {
    const indice = batalha.ordemTurnos[batalha.turnoAtual % 2];
    return batalha.jogadores[indice];
}

function getOponente(batalha, jogadorAtual) {
    const indiceOponente = batalha.jogadores[0].userId === jogadorAtual.userId ? 1 : 0;
    return batalha.jogadores[indiceOponente];
}

function calcularDano(atacante, defensor, danoBase, tipoAtaque = 'fisico') {
    let dano = danoBase;

    const critico = Math.random() * 100 < atacante.stats.critico;
    if (critico) {
        dano *= 1.5;
    }

    const reducao = Math.floor(defensor.stats.defesa * 0.5);
    dano = Math.max(1, dano - reducao);

    if (defensor.escudoAtivo > 0) {
        const absorvido = Math.min(dano, defensor.escudoAtivo);
        defensor.escudoAtivo -= absorvido;
        dano -= absorvido;
    }

    return { dano: Math.floor(dano), critico };
}

function aplicarDano(jogador, dano) {
    jogador.hp -= dano;
    if (jogador.hp < 0) jogador.hp = 0;
}

function aplicarCura(jogador, quantidade) {
    jogador.hp += quantidade;
    if (jogador.hp > jogador.stats.hpMax) {
        jogador.hp = jogador.stats.hpMax;
    }
}

function verificarEsquiva(defensor) {
    return Math.random() * 100 < defensor.stats.esquiva;
}

function usarHabilidade(batalha, jogador, skillId, alvo) {
    const skill = habilidades[skillId];
    if (!skill) {
        return { sucesso: false, mensagem: 'Habilidade não encontrada!' };
    }

    const nivelSkill = jogador.playerData.habilidades[skillId] || 0;
    if (nivelSkill === 0) {
        return { sucesso: false, mensagem: 'Você não aprendeu esta habilidade!' };
    }

    if (jogador.mp < skill.custoMP) {
        return { sucesso: false, mensagem: `MP insuficiente! Necessário: ${skill.custoMP}, você tem: ${jogador.mp}` };
    }

    const cooldownKey = `${batalha.canalId}-${jogador.userId}-${skillId}`;
    const cooldowns = cooldownsHabilidades.get(batalha.canalId) || {};
    
    if (cooldowns[cooldownKey] && cooldowns[cooldownKey] > batalha.turno) {
        const turnosRestantes = cooldowns[cooldownKey] - batalha.turno;
        return { sucesso: false, mensagem: `Habilidade em cooldown! ${turnosRestantes} turnos restantes.` };
    }

    jogador.mp -= skill.custoMP;

    const efeitos = skill.efeitos(nivelSkill);
    let resultado = { sucesso: true, mensagem: '', dano: 0, critico: false };

    if (skill.tipo === 'Ativa') {
        if (skill.danoBase) {
            const atributoRelevante = jogador.playerData.atributos[skill.escala] || 0;
            const danoCalculado = calcularDanoHabilidade(skill, jogador.playerData.level, atributoRelevante, nivelSkill);
            
            if (alvo.evasaoAtiva) {
                resultado.mensagem = `${alvo.nome} esquivou completamente do ataque!`;
                alvo.evasaoAtiva = false;
            } else if (verificarEsquiva(alvo)) {
                resultado.mensagem = `${alvo.nome} esquivou do ataque!`;
            } else {
                const { dano, critico } = calcularDano(jogador, alvo, danoCalculado);
                aplicarDano(alvo, dano);
                resultado.dano = dano;
                resultado.critico = critico;
                resultado.mensagem = `${jogador.nome} usou **${skill.nome}** e causou **${dano}** de dano${critico ? ' CRÍTICO!' : '!'}`;
            }
        }

        if (efeitos.reducaoDano) {
            jogador.buffs.push({ tipo: 'reducaoDano', valor: efeitos.reducaoDano, turnos: efeitos.duracao || 2 });
            resultado.mensagem += `\n🛡️ ${jogador.nome} aumentou sua defesa em ${efeitos.reducaoDano}% por ${efeitos.duracao || 2} turnos!`;
        }

        if (efeitos.absorcao) {
            jogador.escudoAtivo = efeitos.absorcao;
            resultado.mensagem += `\n🔰 ${jogador.nome} criou um escudo que absorve ${efeitos.absorcao} de dano!`;
        }

        if (efeitos.bonusDano) {
            jogador.buffs.push({ tipo: 'bonusDano', valor: efeitos.bonusDano, turnos: efeitos.duracao || 3 });
            resultado.mensagem += `\n🔥 ${jogador.nome} entrou em fúria! Dano aumentado em ${efeitos.bonusDano}% por ${efeitos.duracao || 3} turnos!`;
        }

        if (efeitos.sangramento) {
            alvo.debuffs.push({ tipo: 'sangramento', valor: efeitos.sangramento, turnos: efeitos.turnos || 3 });
            resultado.mensagem += `\n🩸 ${alvo.nome} está sangrando! ${efeitos.sangramento} de dano por ${efeitos.turnos || 3} turnos!`;
        }

        if (efeitos.veneno) {
            alvo.debuffs.push({ tipo: 'veneno', valor: efeitos.veneno, turnos: efeitos.turnos || 4 });
            resultado.mensagem += `\n☠️ ${alvo.nome} foi envenenado! ${efeitos.veneno} de dano por ${efeitos.turnos || 4} turnos!`;
        }

        if (efeitos.bonusEsquiva && efeitos.duracao) {
            jogador.buffs.push({ tipo: 'esquiva', valor: efeitos.bonusEsquiva, turnos: efeitos.duracao });
            resultado.mensagem += `\n💨 ${jogador.nome} ficou mais ágil! Esquiva +${efeitos.bonusEsquiva}% por ${efeitos.duracao} turnos!`;
        }

        if (efeitos.esquivaTotal) {
            jogador.evasaoAtiva = true;
            resultado.mensagem += `\n⚡ ${jogador.nome} está pronto para esquivar do próximo ataque!`;
        }

        if (efeitos.rouboMP) {
            alvo.mp = Math.max(0, alvo.mp - efeitos.rouboMP);
            jogador.mp = Math.min(jogador.stats.mpMax, jogador.mp + efeitos.rouboMP);
            resultado.mensagem += `\n💙 ${jogador.nome} drenou ${efeitos.rouboMP} de MP!`;
        }
    }

    if (skill.cooldown > 0) {
        cooldowns[cooldownKey] = batalha.turno + skill.cooldown;
        cooldownsHabilidades.set(batalha.canalId, cooldowns);
    }

    return resultado;
}

function ataqueBasico(batalha, atacante, defensor) {
    if (defensor.evasaoAtiva) {
        defensor.evasaoAtiva = false;
        return { 
            mensagem: `${defensor.nome} esquivou completamente do ataque básico de ${atacante.nome}!`,
            dano: 0
        };
    }

    if (verificarEsquiva(defensor)) {
        return { 
            mensagem: `${atacante.nome} atacou, mas ${defensor.nome} esquivou!`,
            dano: 0
        };
    }

    const danoBase = atacante.stats.ataque;
    const { dano, critico } = calcularDano(atacante, defensor, danoBase);
    aplicarDano(defensor, dano);

    return {
        mensagem: `${atacante.nome} atacou e causou **${dano}** de dano${critico ? ' CRÍTICO!' : '!'}`,
        dano,
        critico
    };
}

function processarEfeitosDoTurno(jogador) {
    let mensagens = [];
    let danoDot = 0;

    for (let i = jogador.debuffs.length - 1; i >= 0; i--) {
        const debuff = jogador.debuffs[i];
        
        if (debuff.tipo === 'sangramento' || debuff.tipo === 'veneno') {
            aplicarDano(jogador, debuff.valor);
            danoDot += debuff.valor;
            const icone = debuff.tipo === 'sangramento' ? '🩸' : '☠️';
            mensagens.push(`${icone} ${jogador.nome} sofreu ${debuff.valor} de dano por ${debuff.tipo}!`);
        }

        debuff.turnos--;
        if (debuff.turnos <= 0) {
            jogador.debuffs.splice(i, 1);
        }
    }

    for (let i = jogador.buffs.length - 1; i >= 0; i--) {
        const buff = jogador.buffs[i];
        buff.turnos--;
        if (buff.turnos <= 0) {
            jogador.buffs.splice(i, 1);
            mensagens.push(`✨ O efeito de ${buff.tipo} de ${jogador.nome} acabou.`);
        }
    }

    return { mensagens, danoDot };
}

function proximoTurno(batalha) {
    batalha.turnoAtual++;
    if (batalha.turnoAtual % 2 === 0) {
        batalha.turno++;
    }
}

function verificarFimBatalha(batalha) {
    const jogador1 = batalha.jogadores[0];
    const jogador2 = batalha.jogadores[1];

    if (jogador1.hp <= 0 && jogador2.hp <= 0) {
        return { fim: true, vencedor: null, empate: true };
    }
    
    if (jogador1.hp <= 0) {
        return { fim: true, vencedor: jogador2, perdedor: jogador1 };
    }
    
    if (jogador2.hp <= 0) {
        return { fim: true, vencedor: jogador1, perdedor: jogador2 };
    }

    return { fim: false };
}

async function processarFimBatalha(batalha, verificacao) {
    const { db } = require('./database.js');
    const { EmbedBuilder } = require('discord.js');

    const embed = new EmbedBuilder()
        .setColor(verificacao.empate ? '#FFFF00' : '#00FF00')
        .setTitle(verificacao.empate ? '🤝 Empate!' : '🏆 Vitória!');

    if (verificacao.empate) {
        embed.setDescription('Ambos os jogadores caíram ao mesmo tempo!\n\nNenhum rating foi alterado.');
        
        const p1Data = await db.get(batalha.jogadores[0].userId);
        const p2Data = await db.get(batalha.jogadores[1].userId);
        
        p1Data.estatisticas.pvpEmpates++;
        p1Data.estatisticas.duelosRealizados++;
        p2Data.estatisticas.pvpEmpates++;
        p2Data.estatisticas.duelosRealizados++;

        await db.set(batalha.jogadores[0].userId, p1Data);
        await db.set(batalha.jogadores[1].userId, p2Data);

    } else {
        const vencedorData = await db.get(verificacao.vencedor.userId);
        const perdedorData = await db.get(verificacao.perdedor.userId);

        vencedorData.estatisticas.pvpVitorias++;
        vencedorData.estatisticas.duelosRealizados++;
        perdedorData.estatisticas.pvpDerrotas++;
        perdedorData.estatisticas.duelosRealizados++;

        const diferencaRating = Math.abs(vencedorData.pvp.rating - perdedorData.pvp.rating);
        const kFactor = diferencaRating > 200 ? 40 : 32;
        
        const ganhoRating = Math.floor(kFactor * (1 - (vencedorData.pvp.rating / (vencedorData.pvp.rating + perdedorData.pvp.rating))));
        const perdaRating = Math.floor(kFactor * (perdedorData.pvp.rating / (vencedorData.pvp.rating + perdedorData.pvp.rating)));

        vencedorData.pvp.rating += ganhoRating;
        perdedorData.pvp.rating = Math.max(0, perdedorData.pvp.rating - perdaRating);

        if (vencedorData.pvp.rating > vencedorData.pvp.melhorRating) {
            vencedorData.pvp.melhorRating = vencedorData.pvp.rating;
        }

        vencedorData.pvp.vitoriasSeguidas++;
        if (vencedorData.pvp.vitoriasSeguidas > vencedorData.pvp.melhorSequencia) {
            vencedorData.pvp.melhorSequencia = vencedorData.pvp.vitoriasSeguidas;
        }
        perdedorData.pvp.vitoriasSeguidas = 0;

        const recompensa = Math.floor(50 + (batalha.turno * 10));
        vencedorData.moeda += recompensa;

        await db.set(verificacao.vencedor.userId, vencedorData);
        await db.set(verificacao.perdedor.userId, perdedorData);

        embed.setDescription(`**${verificacao.vencedor.nome}** venceu o duelo!`)
            .addFields(
                { 
                    name: '🏆 Vencedor', 
                    value: `${verificacao.vencedor.nome}\nHP Restante: ${verificacao.vencedor.hp}/${verificacao.vencedor.stats.hpMax}`,
                    inline: true
                },
                { 
                    name: '💀 Derrotado', 
                    value: verificacao.perdedor.nome,
                    inline: true
                },
                {
                    name: '📊 Mudanças de Rating',
                    value: `${verificacao.vencedor.nome}: **${vencedorData.pvp.rating - ganhoRating}** → **${vencedorData.pvp.rating}** (+${ganhoRating})\n${verificacao.perdedor.nome}: **${perdedorData.pvp.rating + perdaRating}** → **${perdedorData.pvp.rating}** (-${perdaRating})`,
                    inline: false
                },
                {
                    name: '💰 Recompensas',
                    value: `${verificacao.vencedor.nome} ganhou **${recompensa}** moedas!`,
                    inline: false
                }
            );
    }

    return embed;
}

function criarEmbedBatalha(batalha, mensagemAcao = '') {
    const jogadorAtual = getJogadorAtual(batalha);
    const j1 = batalha.jogadores[0];
    const j2 = batalha.jogadores[1];

    const embed = new EmbedBuilder()
        .setColor('#FF4500')
        .setTitle('⚔️ Batalha PvP - Turno ' + batalha.turno)
        .setDescription(mensagemAcao || `É o turno de **${jogadorAtual.nome}**!`);

    const barraHp1 = criarBarraVida(j1.hp, j1.stats.hpMax);
    const barraMp1 = criarBarraMana(j1.mp, j1.stats.mpMax);
    
    embed.addFields({
        name: `${j1.nome} (${j1.playerData.classe})`,
        value: `${barraHp1}\n${barraMp1}\nHP: ${j1.hp}/${j1.stats.hpMax} | MP: ${j1.mp}/${j1.stats.mpMax}`,
        inline: true
    });

    const barraHp2 = criarBarraVida(j2.hp, j2.stats.hpMax);
    const barraMp2 = criarBarraMana(j2.mp, j2.stats.mpMax);
    
    embed.addFields({
        name: `${j2.nome} (${j2.playerData.classe})`,
        value: `${barraHp2}\n${barraMp2}\nHP: ${j2.hp}/${j2.stats.hpMax} | MP: ${j2.mp}/${j2.stats.mpMax}`,
        inline: true
    });

    embed.addFields({
        name: '🎮 Ações Disponíveis',
        value: '`!atacar` - Ataque básico\n`!usar <habilidade>` - Usar habilidade\n`!item <item>` - Usar item\n`!desistir` - Desistir da batalha',
        inline: false
    });

    embed.setFooter({ text: `${jogadorAtual.nome}, você tem 60 segundos para agir!` });

    return embed;
}

function criarBarraVida(hp, hpMax) {
    const porcentagem = (hp / hpMax) * 100;
    const blocos = 10;
    const preenchidos = Math.floor((porcentagem / 100) * blocos);
    const vazios = blocos - preenchidos;
    
    let cor = '🟩';
    if (porcentagem <= 25) cor = '🟥';
    else if (porcentagem <= 50) cor = '🟨';
    
    return `❤️ ${cor.repeat(preenchidos)}${'⬜'.repeat(vazios)} ${Math.floor(porcentagem)}%`;
}

function criarBarraMana(mp, mpMax) {
    const porcentagem = (mp / mpMax) * 100;
    const blocos = 10;
    const preenchidos = Math.floor((porcentagem / 100) * blocos);
    const vazios = blocos - preenchidos;
    
    return `💙 ${'🟦'.repeat(preenchidos)}${'⬜'.repeat(vazios)} ${Math.floor(porcentagem)}%`;
}

module.exports = {
    criarBatalha,
    getBatalha,
    finalizarBatalha,
    getJogadorAtual,
    getOponente,
    usarHabilidade,
    ataqueBasico,
    processarEfeitosDoTurno,
    proximoTurno,
    verificarFimBatalha,
    processarFimBatalha,
    criarEmbedBatalha,
    calcularStats,
    aplicarCura
};
