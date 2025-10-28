const Keyv = require('keyv');
const KeyvFile = require('keyv-file');

// A sintaxe correta para o Railway
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
    level: 1, xp: 0, xpParaUpar: calcularXpParaUpar(1), moeda: 0, inventario: [],
    equipamento: { arma: null, elmo: null, peitoral: null, calcas: null, botas: null },
    pontos: { atributo: 5, habilidade: 1 },
    atributos: { forca: 5, destreza: 5, constituicao: 5, inteligencia: 5 },
    cooldowns: { treino: 0, cacar: 0, minerar: 0 },
    cor: '#3498DB',
};

async function getPlayerData(userId) {
    let playerData = await db.get(userId);
    if (!playerData) {
        playerData = defaultProfile;
        await db.set(userId, playerData);
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