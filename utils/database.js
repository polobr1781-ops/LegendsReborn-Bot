const { Keyv } = require('keyv');
const { KeyvFile } = require('keyv-file');

const db = new Keyv({
    store: new KeyvFile({
        filename: 'database/main.json'
    })
});

db.on('error', err => console.error('Erro de Conexão com o Keyv:', err));

// Verificação de segurança para o 'items.js'
let items = {};
try {
    items = require('./items.js').items;
} catch (e) {
    console.error("AVISO: O arquivo 'items.js' não foi encontrado ou está com erro. Funções de item podem falhar.");
}


function calcularXpParaUpar(level) {
    return Math.floor(Math.pow(level, 1.5) * 100);
}

const defaultProfile = {
    level: 1,
    xp: 0,
    xpParaUpar: calcularXpParaUpar(1),
    moeda: 100,
    inventario: [],
    equipamento: { arma: null, elmo: null, peitoral: null, calcas: null, botas: null, anel: null, amuleto: null },
    pontos: { atributo: 5, habilidade: 1 },
    pontosHabilidade: 0,
    atributos: { forca: 5, destreza: 5, constituicao: 5, inteligencia: 5 },
    habilidades: {},
    classe: null,
    profissoes: {
        mineracao: { level: 1, xp: 0 },
        ferraria: { level: 1, xp: 0 },
        alquimia: { level: 1, xp: 0 }
    },
    torre: {
        andar: 0,
        missoesConcluidas: []
    },
    cooldowns: { treino: 0, cacar: 0, minerar: 0, torre: 0 },
    estatisticas: {
        monstrosDerrotados: 0,
        mortesTotal: 0,
        dinheiroGanho: 0,
        itensEncontrados: 0,
        pvpVitorias: 0,
        pvpDerrotas: 0,
        pvpEmpates: 0,
        duelosRealizados: 0
    },
    pvp: {
        rating: 1000,
        melhorRating: 1000,
        vitoriasSeguidas: 0,
        melhorSequencia: 0
    },
    conquistas: [],
    cor: '#3498DB'
};

function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function migrarPlayerData(playerData) {
    const migrated = deepClone(playerData);
    const defaults = deepClone(defaultProfile);
    
    if (!migrated.equipamento) {
        migrated.equipamento = defaults.equipamento;
    } else {
        for (const slot in defaults.equipamento) {
            if (migrated.equipamento[slot] === undefined) {
                migrated.equipamento[slot] = defaults.equipamento[slot];
            }
        }
    }
    
    if (!migrated.pontos) {
        migrated.pontos = defaults.pontos;
    } else {
        if (migrated.pontos.atributo === undefined) migrated.pontos.atributo = defaults.pontos.atributo;
        if (migrated.pontos.habilidade === undefined) migrated.pontos.habilidade = defaults.pontos.habilidade;
    }
    
    if (!migrated.atributos) {
        migrated.atributos = defaults.atributos;
    } else {
        if (migrated.atributos.forca === undefined) migrated.atributos.forca = defaults.atributos.forca;
        if (migrated.atributos.destreza === undefined) migrated.atributos.destreza = defaults.atributos.destreza;
        if (migrated.atributos.constituicao === undefined) migrated.atributos.constituicao = defaults.atributos.constituicao;
        if (migrated.atributos.inteligencia === undefined) migrated.atributos.inteligencia = defaults.atributos.inteligencia;
    }
    
    if (!migrated.cooldowns) {
        migrated.cooldowns = defaults.cooldowns;
    } else {
        if (migrated.cooldowns.treino === undefined) migrated.cooldowns.treino = 0;
        if (migrated.cooldowns.cacar === undefined) migrated.cooldowns.cacar = 0;
        if (migrated.cooldowns.minerar === undefined) migrated.cooldowns.minerar = 0;
        if (migrated.cooldowns.torre === undefined) migrated.cooldowns.torre = 0;
    }
    
    if (!migrated.estatisticas) {
        migrated.estatisticas = defaults.estatisticas;
    } else {
        if (migrated.estatisticas.monstrosDerrotados === undefined) migrated.estatisticas.monstrosDerrotados = 0;
        if (migrated.estatisticas.mortesTotal === undefined) migrated.estatisticas.mortesTotal = 0;
        if (migrated.estatisticas.dinheiroGanho === undefined) migrated.estatisticas.dinheiroGanho = 0;
        if (migrated.estatisticas.itensEncontrados === undefined) migrated.estatisticas.itensEncontrados = 0;
        if (migrated.estatisticas.pvpVitorias === undefined) migrated.estatisticas.pvpVitorias = 0;
        if (migrated.estatisticas.pvpDerrotas === undefined) migrated.estatisticas.pvpDerrotas = 0;
        if (migrated.estatisticas.pvpEmpates === undefined) migrated.estatisticas.pvpEmpates = 0;
        if (migrated.estatisticas.duelosRealizados === undefined) migrated.estatisticas.duelosRealizados = 0;
    }
    
    if (!migrated.torre) {
        migrated.torre = defaults.torre;
    } else {
        if (migrated.torre.andar === undefined) migrated.torre.andar = 0;
        if (migrated.torre.missoesConcluidas === undefined) migrated.torre.missoesConcluidas = [];
    }
    
    if (!migrated.profissoes) {
        migrated.profissoes = defaults.profissoes;
    } else {
        if (!migrated.profissoes.mineracao) {
            migrated.profissoes.mineracao = { level: 1, xp: 0 };
        } else {
            if (migrated.profissoes.mineracao.level === undefined) migrated.profissoes.mineracao.level = 1;
            if (migrated.profissoes.mineracao.xp === undefined) migrated.profissoes.mineracao.xp = 0;
        }
        if (!migrated.profissoes.ferraria) {
            migrated.profissoes.ferraria = { level: 1, xp: 0 };
        } else {
            if (migrated.profissoes.ferraria.level === undefined) migrated.profissoes.ferraria.level = 1;
            if (migrated.profissoes.ferraria.xp === undefined) migrated.profissoes.ferraria.xp = 0;
        }
        if (!migrated.profissoes.alquimia) {
            migrated.profissoes.alquimia = { level: 1, xp: 0 };
        } else {
            if (migrated.profissoes.alquimia.level === undefined) migrated.profissoes.alquimia.level = 1;
            if (migrated.profissoes.alquimia.xp === undefined) migrated.profissoes.alquimia.xp = 0;
        }
    }
    
    if (migrated.conquistas === undefined) {
        migrated.conquistas = [];
    }
    
    if (migrated.classe === undefined) {
        migrated.classe = null;
    }
    
    if (!migrated.cor) {
        migrated.cor = '#3498DB';
    }
    
    if (migrated.inventario === undefined) {
        migrated.inventario = [];
    }
    
    if (migrated.moeda === undefined) {
        migrated.moeda = 0;
    }
    
    if (migrated.level === undefined) {
        migrated.level = 1;
    }
    
    if (migrated.xp === undefined) {
        migrated.xp = 0;
    }
    
    if (!migrated.xpParaUpar && migrated.level) {
        migrated.xpParaUpar = calcularXpParaUpar(migrated.level);
    }
    
    if (migrated.habilidades === undefined) {
        migrated.habilidades = {};
    }
    
    if (migrated.pontosHabilidade === undefined) {
        migrated.pontosHabilidade = 0;
    }
    
    if (!migrated.pvp) {
        migrated.pvp = defaults.pvp;
    } else {
        if (migrated.pvp.rating === undefined) migrated.pvp.rating = 1000;
        if (migrated.pvp.melhorRating === undefined) migrated.pvp.melhorRating = migrated.pvp.rating || 1000;
        if (migrated.pvp.vitoriasSeguidas === undefined) migrated.pvp.vitoriasSeguidas = 0;
        if (migrated.pvp.melhorSequencia === undefined) migrated.pvp.melhorSequencia = 0;
    }
    
    return migrated;
}

async function getPlayerData(userId) {
    let playerData = await db.get(userId);
    
    if (!playerData) {
        playerData = deepClone(defaultProfile);
        await db.set(userId, playerData);
    } else {
        const playerDataMigrado = migrarPlayerData(playerData);
        if (JSON.stringify(playerData) !== JSON.stringify(playerDataMigrado)) {
            playerData = playerDataMigrado;
            await db.set(userId, playerData);
        } else {
            playerData = playerDataMigrado;
        }
    }
    
    return playerData;
}

function adicionarXp(player, xpAmount) {
    player.xp += xpAmount;
    let levelUps = 0;
    while (player.xp >= player.xpParaUpar) {
        player.level++;
        player.xp -= player.xpParaUpar;
        player.pontos.atributo += 3;
        player.pontos.habilidade += 1;
        player.pontosHabilidade += 1;
        player.xpParaUpar = calcularXpParaUpar(player.level);
        levelUps++;
    }
    return levelUps;
}

function calcularBonusEquipamentos(playerData) {
    const bonus = { forca: 0, destreza: 0, constituicao: 0, inteligencia: 0 };
    if (!playerData || !playerData.equipamento) return bonus;

    for (const slot in playerData.equipamento) {
        const itemId = playerData.equipamento[slot];
        if (itemId) {
            const item = items[itemId];
            if (item && item.bonus) {
                for (const attr in item.bonus) {
                    if (bonus.hasOwnProperty(attr)) {
                         bonus[attr] += item.bonus[attr];
                    }
                }
            }
        }
    }
    return bonus;
}

// A LINHA CORRIGIDA E COMPLETA
module.exports = { getPlayerData, db, calcularXpParaUpar, calcularBonusEquipamentos, adicionarXp };