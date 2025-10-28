const Keyv = require('keyv');
const KeyvFile = require('keyv-file');

// A CORREÇÃO FINAL ESTÁ AQUI: KeyvFile.default
// Estamos dizendo: "Pegue a planta que está na propriedade 'default' do manual".
const db = new Keyv({
    store: new KeyvFile.default({
        filename: 'database/main.json'
    })
});

db.on('error', err => console.error('Erro de Conexão com o Keyv:', err));

const { items } = require('./items.js');

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

module.exports = { getPlayerData, db, calcularXpParaUpar, calcularBonusEquipamentos