const habilidades = {
    // ==================== GUERREIRO ====================
    'golpe-poderoso': {
        nome: 'Golpe Poderoso',
        classe: 'Guerreiro',
        arvore: 'Fúria',
        tipo: 'Ativa',
        custoMP: 15,
        cooldown: 0,
        danoBase: 25,
        escala: 'forca',
        multiplicador: 1.5,
        nivelMax: 5,
        custoPorNivel: [1, 1, 2, 2, 3],
        descricao: 'Um golpe devastador que causa dano massivo baseado em Força.',
        efeitos: (nivel) => ({
            dano: 25 + (nivel * 10),
            multiplicador: 1.5 + (nivel * 0.1)
        })
    },
    'furia-guerreira': {
        nome: 'Fúria Guerreira',
        classe: 'Guerreiro',
        arvore: 'Fúria',
        tipo: 'Ativa',
        custoMP: 25,
        cooldown: 3,
        duracao: 3,
        nivelMax: 5,
        custoPorNivel: [2, 2, 3, 3, 4],
        descricao: 'Entra em estado de fúria, aumentando dano físico mas reduzindo defesa.',
        efeitos: (nivel) => ({
            bonusDano: 20 + (nivel * 10),
            penalDefesa: 10 - (nivel * 1),
            duracao: 3
        })
    },
    'sangramento': {
        nome: 'Corte Sangrento',
        classe: 'Guerreiro',
        arvore: 'Fúria',
        tipo: 'Ativa',
        custoMP: 20,
        cooldown: 2,
        danoBase: 15,
        escala: 'forca',
        nivelMax: 5,
        custoPorNivel: [2, 2, 3, 3, 4],
        descricao: 'Um corte que causa sangramento, infligindo dano ao longo do tempo.',
        efeitos: (nivel) => ({
            dano: 15 + (nivel * 5),
            sangramento: 5 + (nivel * 3),
            turnos: 3
        })
    },
    'muralha-de-aco': {
        nome: 'Muralha de Aço',
        classe: 'Guerreiro',
        arvore: 'Defesa',
        tipo: 'Ativa',
        custoMP: 20,
        cooldown: 4,
        duracao: 2,
        nivelMax: 5,
        custoPorNivel: [1, 2, 2, 3, 3],
        descricao: 'Assume postura defensiva, reduzindo drasticamente o dano recebido.',
        efeitos: (nivel) => ({
            reducaoDano: 30 + (nivel * 10),
            duracao: 2 + Math.floor(nivel / 3)
        })
    },
    'contra-ataque': {
        nome: 'Contra-Ataque',
        classe: 'Guerreiro',
        arvore: 'Defesa',
        tipo: 'Passiva',
        nivelMax: 5,
        custoPorNivel: [2, 2, 3, 3, 4],
        descricao: 'Chance de revidar quando recebe dano físico.',
        efeitos: (nivel) => ({
            chance: 10 + (nivel * 5),
            danoContra: 50 + (nivel * 10)
        })
    },
    'vigor-inabalavel': {
        nome: 'Vigor Inabalável',
        classe: 'Guerreiro',
        arvore: 'Defesa',
        tipo: 'Passiva',
        nivelMax: 5,
        custoPorNivel: [1, 1, 2, 2, 3],
        descricao: 'Aumenta HP máximo permanentemente.',
        efeitos: (nivel) => ({
            bonusHP: 50 + (nivel * 25)
        })
    },

    // ==================== MAGO ====================
    'bola-de-fogo': {
        nome: 'Bola de Fogo',
        classe: 'Mago',
        arvore: 'Destruição',
        tipo: 'Ativa',
        custoMP: 20,
        cooldown: 0,
        danoBase: 30,
        escala: 'inteligencia',
        multiplicador: 1.8,
        nivelMax: 5,
        custoPorNivel: [1, 1, 2, 2, 3],
        descricao: 'Conjura uma bola de fogo explosiva baseada em Inteligência.',
        efeitos: (nivel) => ({
            dano: 30 + (nivel * 12),
            multiplicador: 1.8 + (nivel * 0.15)
        })
    },
    'tempestade-arcana': {
        nome: 'Tempestade Arcana',
        classe: 'Mago',
        arvore: 'Destruição',
        tipo: 'Ativa',
        custoMP: 40,
        cooldown: 4,
        danoBase: 20,
        escala: 'inteligencia',
        nivelMax: 5,
        custoPorNivel: [3, 3, 4, 4, 5],
        descricao: 'Invoca uma tempestade mágica que ataca múltiplas vezes.',
        efeitos: (nivel) => ({
            dano: 20 + (nivel * 8),
            ataques: 3 + Math.floor(nivel / 2),
            multiplicador: 1.2
        })
    },
    'explosao-arcana': {
        nome: 'Explosão Arcana',
        classe: 'Mago',
        arvore: 'Destruição',
        tipo: 'Ativa',
        custoMP: 50,
        cooldown: 5,
        danoBase: 80,
        escala: 'inteligencia',
        nivelMax: 5,
        custoPorNivel: [3, 4, 4, 5, 6],
        descricao: 'Libera toda energia mágica em uma explosão devastadora.',
        efeitos: (nivel) => ({
            dano: 80 + (nivel * 20),
            multiplicador: 2.0 + (nivel * 0.2),
            custoHP: 10
        })
    },
    'escudo-arcano': {
        nome: 'Escudo Arcano',
        classe: 'Mago',
        arvore: 'Proteção',
        tipo: 'Ativa',
        custoMP: 25,
        cooldown: 3,
        duracao: 2,
        nivelMax: 5,
        custoPorNivel: [2, 2, 3, 3, 4],
        descricao: 'Cria um escudo mágico que absorve dano.',
        efeitos: (nivel) => ({
            absorcao: 40 + (nivel * 20),
            duracao: 2 + Math.floor(nivel / 3)
        })
    },
    'roubo-de-mana': {
        nome: 'Roubo de Mana',
        classe: 'Mago',
        arvore: 'Proteção',
        tipo: 'Ativa',
        custoMP: 15,
        cooldown: 2,
        danoBase: 10,
        escala: 'inteligencia',
        nivelMax: 5,
        custoPorNivel: [2, 2, 3, 3, 4],
        descricao: 'Drena a mana do inimigo e restaura a sua.',
        efeitos: (nivel) => ({
            dano: 10 + (nivel * 5),
            rouboMP: 15 + (nivel * 5)
        })
    },
    'sabedoria-arcana': {
        nome: 'Sabedoria Arcana',
        classe: 'Mago',
        arvore: 'Proteção',
        tipo: 'Passiva',
        nivelMax: 5,
        custoPorNivel: [1, 1, 2, 2, 3],
        descricao: 'Aumenta MP máximo permanentemente.',
        efeitos: (nivel) => ({
            bonusMP: 30 + (nivel * 15)
        })
    },

    // ==================== ARQUEIRO ====================
    'tiro-preciso': {
        nome: 'Tiro Preciso',
        classe: 'Arqueiro',
        arvore: 'Precisão',
        tipo: 'Ativa',
        custoMP: 12,
        cooldown: 0,
        danoBase: 20,
        escala: 'destreza',
        multiplicador: 1.6,
        nivelMax: 5,
        custoPorNivel: [1, 1, 2, 2, 3],
        descricao: 'Um tiro certeiro baseado em Destreza com alta chance de crítico.',
        efeitos: (nivel) => ({
            dano: 20 + (nivel * 8),
            multiplicador: 1.6 + (nivel * 0.1),
            chanceCritico: 15 + (nivel * 5)
        })
    },
    'chuva-de-flechas': {
        nome: 'Chuva de Flechas',
        classe: 'Arqueiro',
        arvore: 'Precisão',
        tipo: 'Ativa',
        custoMP: 30,
        cooldown: 3,
        danoBase: 15,
        escala: 'destreza',
        nivelMax: 5,
        custoPorNivel: [2, 3, 3, 4, 4],
        descricao: 'Dispara múltiplas flechas que atingem em área.',
        efeitos: (nivel) => ({
            dano: 15 + (nivel * 6),
            flechas: 4 + nivel,
            multiplicador: 1.0
        })
    },
    'tiro-perfurante': {
        nome: 'Tiro Perfurante',
        classe: 'Arqueiro',
        arvore: 'Precisão',
        tipo: 'Ativa',
        custoMP: 25,
        cooldown: 2,
        danoBase: 35,
        escala: 'destreza',
        nivelMax: 5,
        custoPorNivel: [2, 2, 3, 3, 4],
        descricao: 'Flecha que ignora parte da defesa do inimigo.',
        efeitos: (nivel) => ({
            dano: 35 + (nivel * 10),
            ignoraDefesa: 20 + (nivel * 10),
            multiplicador: 1.4
        })
    },
    'esquiva-agil': {
        nome: 'Esquiva Ágil',
        classe: 'Arqueiro',
        arvore: 'Mobilidade',
        tipo: 'Ativa',
        custoMP: 20,
        cooldown: 4,
        duracao: 2,
        nivelMax: 5,
        custoPorNivel: [2, 2, 3, 3, 4],
        descricao: 'Aumenta drasticamente a chance de esquiva.',
        efeitos: (nivel) => ({
            bonusEsquiva: 30 + (nivel * 10),
            duracao: 2
        })
    },
    'reflexos-apurados': {
        nome: 'Reflexos Apurados',
        classe: 'Arqueiro',
        arvore: 'Mobilidade',
        tipo: 'Passiva',
        nivelMax: 5,
        custoPorNivel: [1, 2, 2, 3, 3],
        descricao: 'Aumenta chance de esquiva permanentemente.',
        efeitos: (nivel) => ({
            bonusEsquiva: 5 + (nivel * 3)
        })
    },
    'olho-de-aguia': {
        nome: 'Olho de Águia',
        classe: 'Arqueiro',
        arvore: 'Precisão',
        tipo: 'Passiva',
        nivelMax: 5,
        custoPorNivel: [1, 1, 2, 2, 3],
        descricao: 'Aumenta chance de acerto crítico permanentemente.',
        efeitos: (nivel) => ({
            chanceCritico: 5 + (nivel * 2),
            danoCritico: 10 + (nivel * 5)
        })
    },

    // ==================== LADINO ====================
    'golpe-nas-sombras': {
        nome: 'Golpe nas Sombras',
        classe: 'Ladino',
        arvore: 'Furtividade',
        tipo: 'Ativa',
        custoMP: 18,
        cooldown: 0,
        danoBase: 22,
        escala: 'destreza',
        multiplicador: 1.7,
        nivelMax: 5,
        custoPorNivel: [1, 1, 2, 2, 3],
        descricao: 'Ataque furtivo que causa dano extra se atacar pelas costas.',
        efeitos: (nivel) => ({
            dano: 22 + (nivel * 9),
            multiplicador: 1.7 + (nivel * 0.15),
            bonusFurtivo: 30 + (nivel * 10)
        })
    },
    'apunhalar': {
        nome: 'Apunhalar',
        classe: 'Ladino',
        arvore: 'Furtividade',
        tipo: 'Ativa',
        custoMP: 20,
        cooldown: 1,
        danoBase: 18,
        escala: 'destreza',
        nivelMax: 5,
        custoPorNivel: [2, 2, 3, 3, 4],
        descricao: 'Golpes rápidos consecutivos que causam sangramento.',
        efeitos: (nivel) => ({
            dano: 18 + (nivel * 7),
            ataques: 2 + Math.floor(nivel / 2),
            sangramento: 3 + (nivel * 2)
        })
    },
    'evasao': {
        nome: 'Evasão',
        classe: 'Ladino',
        arvore: 'Furtividade',
        tipo: 'Ativa',
        custoMP: 15,
        cooldown: 3,
        nivelMax: 5,
        custoPorNivel: [2, 2, 3, 3, 4],
        descricao: 'Esquiva o próximo ataque completamente.',
        efeitos: (nivel) => ({
            esquivaTotal: true,
            duracaoTurnos: 1,
            bonusProximoAtaque: 20 + (nivel * 10)
        })
    },
    'veneno-mortal': {
        nome: 'Veneno Mortal',
        classe: 'Ladino',
        arvore: 'Venenos',
        tipo: 'Ativa',
        custoMP: 25,
        cooldown: 3,
        danoBase: 12,
        nivelMax: 5,
        custoPorNivel: [2, 3, 3, 4, 4],
        descricao: 'Envenena a arma, causando dano contínuo poderoso.',
        efeitos: (nivel) => ({
            danoInicial: 12 + (nivel * 5),
            veneno: 8 + (nivel * 4),
            turnos: 4 + Math.floor(nivel / 2)
        })
    },
    'mestre-das-sombras': {
        nome: 'Mestre das Sombras',
        classe: 'Ladino',
        arvore: 'Furtividade',
        tipo: 'Passiva',
        nivelMax: 5,
        custoPorNivel: [2, 2, 3, 3, 4],
        descricao: 'Aumenta dano de ataques furtivos e críticos.',
        efeitos: (nivel) => ({
            bonusDanoFurtivo: 10 + (nivel * 5),
            bonusCritico: 15 + (nivel * 5)
        })
    },
    'velocidade-mortal': {
        nome: 'Velocidade Mortal',
        classe: 'Ladino',
        arvore: 'Venenos',
        tipo: 'Passiva',
        nivelMax: 5,
        custoPorNivel: [1, 1, 2, 2, 3],
        descricao: 'Aumenta velocidade de ataque permanentemente.',
        efeitos: (nivel) => ({
            bonusVelocidade: 5 + (nivel * 3),
            chanceAtaqueDuplo: 5 + (nivel * 2)
        })
    }
};

function getHabilidadesPorClasse(classe) {
    const skills = {};
    for (const [id, skill] of Object.entries(habilidades)) {
        if (skill.classe === classe) {
            skills[id] = skill;
        }
    }
    return skills;
}

function getArvoresPorClasse(classe) {
    const arvores = new Set();
    for (const skill of Object.values(habilidades)) {
        if (skill.classe === classe && skill.arvore) {
            arvores.add(skill.arvore);
        }
    }
    return Array.from(arvores);
}

function getHabilidadesPorArvore(classe, arvore) {
    const skills = {};
    for (const [id, skill] of Object.entries(habilidades)) {
        if (skill.classe === classe && skill.arvore === arvore) {
            skills[id] = skill;
        }
    }
    return skills;
}

function calcularDanoHabilidade(habilidade, nivel, atributoValor, nivelHabilidade = 1) {
    if (!habilidade.danoBase) return 0;
    
    const efeitos = habilidade.efeitos(nivelHabilidade);
    const danoBase = efeitos.dano || habilidade.danoBase;
    const multiplicador = efeitos.multiplicador || habilidade.multiplicador || 1.0;
    
    const bonusAtributo = Math.floor(atributoValor * multiplicador);
    return danoBase + bonusAtributo;
}

function verificarRequisitos(habilidade, playerData, nivelDesejado = 1) {
    if (!playerData.classe || playerData.classe !== habilidade.classe) {
        return { pode: false, motivo: `Você precisa ser da classe ${habilidade.classe}!` };
    }
    
    if (nivelDesejado > habilidade.nivelMax) {
        return { pode: false, motivo: 'Esta habilidade já está no nível máximo!' };
    }
    
    const custoNecessario = habilidade.custoPorNivel[nivelDesejado - 1];
    if (playerData.pontosHabilidade < custoNecessario) {
        return { pode: false, motivo: `Você precisa de ${custoNecessario} pontos de habilidade!` };
    }
    
    return { pode: true, custo: custoNecessario };
}

module.exports = {
    habilidades,
    getHabilidadesPorClasse,
    getArvoresPorClasse,
    getHabilidadesPorArvore,
    calcularDanoHabilidade,
    verificarRequisitos
};
