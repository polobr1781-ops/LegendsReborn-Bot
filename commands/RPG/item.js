const { EmbedBuilder } = require('discord.js');
const { db } = require('../../utils/database.js');
const { items } = require('../../utils/items.js');
const { 
    getBatalha, 
    getJogadorAtual, 
    aplicarCura,
    processarEfeitosDoTurno,
    proximoTurno,
    verificarFimBatalha,
    processarFimBatalha,
    criarEmbedBatalha,
    finalizarBatalha,
    getOponente
} = require('../../utils/battleManager.js');

module.exports = {
    data: {
        name: 'item',
        aliases: ['usar-item', 'consumir'],
        description: 'Usa um item consumível durante a batalha'
    },
    async execute(message, args) {
        const batalha = getBatalha(message.channel.id);

        if (!batalha) {
            return message.reply('❌ Não há nenhuma batalha ativa neste canal!');
        }

        const jogadorAtual = getJogadorAtual(batalha);

        if (message.author.id !== jogadorAtual.userId) {
            return message.reply('❌ Não é o seu turno!');
        }

        if (!args.length) {
            return message.reply('❌ Use: `!item <nome-do-item>`\nExemplo: `!item poção-de-vida`');
        }

        const itemId = args.join('-').toLowerCase();
        const item = items[itemId];

        if (!item) {
            return message.reply('❌ Item não encontrado!');
        }

        if (item.tipo !== 'Consumível') {
            return message.reply('❌ Este item não pode ser usado em combate!');
        }

        const inventarioIndex = jogadorAtual.playerData.inventario.findIndex(i => i === itemId);

        if (inventarioIndex === -1) {
            return message.reply(`❌ Você não tem **${item.nome}** no inventário!`);
        }

        jogadorAtual.playerData.inventario.splice(inventarioIndex, 1);
        await db.set(jogadorAtual.userId, jogadorAtual.playerData);

        let mensagem = '';

        if (item.efeitos.cura) {
            const hpAntes = jogadorAtual.hp;
            aplicarCura(jogadorAtual, item.efeitos.cura);
            const curaReal = jogadorAtual.hp - hpAntes;
            mensagem = `${jogadorAtual.nome} usou **${item.nome}** e recuperou **${curaReal} HP**!`;
        }

        if (item.efeitos.restauraMP) {
            const mpAntes = jogadorAtual.mp;
            jogadorAtual.mp = Math.min(jogadorAtual.stats.mpMax, jogadorAtual.mp + item.efeitos.restauraMP);
            const restauracaoReal = jogadorAtual.mp - mpAntes;
            mensagem += `\n💙 ${jogadorAtual.nome} recuperou **${restauracaoReal} MP**!`;
        }

        if (item.efeitos.buff) {
            const buff = item.efeitos.buff;
            jogadorAtual.buffs.push({ 
                tipo: buff.tipo, 
                valor: buff.valor, 
                turnos: buff.duracao || 3 
            });
            mensagem += `\n✨ ${jogadorAtual.nome} ganhou **${buff.tipo}** +${buff.valor}% por ${buff.duracao || 3} turnos!`;
        }

        if (item.efeitos.curaCompleta) {
            jogadorAtual.hp = jogadorAtual.stats.hpMax;
            jogadorAtual.mp = jogadorAtual.stats.mpMax;
            mensagem = `${jogadorAtual.nome} usou **${item.nome}** e recuperou toda HP e MP!`;
        }

        let mensagemCompleta = `⚔️ **Turno ${batalha.turno}**\n\n${mensagem}`;

        const oponente = getOponente(batalha, jogadorAtual);
        const efeitosJogador = processarEfeitosDoTurno(jogadorAtual);
        const efeitosOponente = processarEfeitosDoTurno(oponente);

        if (efeitosJogador.mensagens.length > 0) {
            mensagemCompleta += '\n' + efeitosJogador.mensagens.join('\n');
        }
        if (efeitosOponente.mensagens.length > 0) {
            mensagemCompleta += '\n' + efeitosOponente.mensagens.join('\n');
        }

        proximoTurno(batalha);

        const verificacao = verificarFimBatalha(batalha);

        if (verificacao.fim) {
            finalizarBatalha(message.channel.id);
            const embedFim = await processarFimBatalha(batalha, verificacao);
            return message.channel.send({ embeds: [embedFim] });
        }

        const novoJogador = getJogadorAtual(batalha);
        const embedProximoTurno = criarEmbedBatalha(batalha, mensagemCompleta);

        message.channel.send({ 
            content: `<@${novoJogador.userId}>`, 
            embeds: [embedProximoTurno] 
        });
    }
};
