const monsterList = [
    {
        nome: 'Goblin Fraco',
        tipo: 'comum',
        levelMin: 1, levelMax: 3, poder: 15,
        recompensas: { xp: 20, dinheiro: 10 },
        loot: [
            { itemId: 'pele-de-goblin', chance: 0.5 },
            { itemId: 'adaga-improvisada', chance: 0.05 }
        ]
    },
    {
        nome: 'Lobo Selvagem',
        tipo: 'comum',
        levelMin: 2, levelMax: 5, poder: 25,
        recompensas: { xp: 35, dinheiro: 20 },
        loot: [
            { itemId: 'presa-de-lobo', chance: 0.4 },
            { itemId: 'tunica-de-couro', chance: 0.08 }
        ]
    },
    {
        nome: 'Orc Batedor',
        tipo: 'comum',
        levelMin: 4, levelMax: 8, poder: 40,
        recompensas: { xp: 50, dinheiro: 35 },
        loot: [
            { itemId: 'fragmento-de-armadura-orc', chance: 0.4 },
            { itemId: 'espada-curta-enferrujada', chance: 0.08 }
        ]
    },
    {
        nome: 'Esqueleto Guerreiro',
        tipo: 'comum',
        levelMin: 5, levelMax: 10, poder: 55,
        recompensas: { xp: 70, dinheiro: 45 },
        loot: [
            { itemId: 'espada-de-ferro', chance: 0.12 },
            { itemId: 'elmo-de-ferro', chance: 0.10 },
            { itemId: 'essencia-sombria', chance: 0.05 }
        ]
    },
    {
        nome: 'Aranha Gigante',
        tipo: 'comum',
        levelMin: 6, levelMax: 12, poder: 65,
        recompensas: { xp: 90, dinheiro: 55 },
        loot: [
            { itemId: 'calcas-de-couro', chance: 0.15 },
            { itemId: 'pocao-de-vida-menor', chance: 0.25 }
        ]
    },
    {
        nome: 'Troll das Cavernas',
        tipo: 'elite',
        levelMin: 8, levelMax: 15, poder: 85,
        recompensas: { xp: 130, dinheiro: 80 },
        loot: [
            { itemId: 'machado-de-batalha', chance: 0.15 },
            { itemId: 'armadura-de-ferro', chance: 0.12 },
            { itemId: 'pocao-de-vida', chance: 0.20 }
        ]
    },
    {
        nome: 'Mago Sombrio',
        tipo: 'elite',
        levelMin: 10, levelMax: 18, poder: 95,
        recompensas: { xp: 160, dinheiro: 100 },
        loot: [
            { itemId: 'cajado-arcano', chance: 0.18 },
            { itemId: 'manto-arcano', chance: 0.10 },
            { itemId: 'anel-arcano', chance: 0.08 },
            { itemId: 'cristal-magico', chance: 0.30 }
        ]
    },
    {
        nome: 'Dragão Jovem',
        tipo: 'elite',
        levelMin: 15, levelMax: 25, poder: 130,
        recompensas: { xp: 250, dinheiro: 180 },
        loot: [
            { itemId: 'escama-de-dragao', chance: 0.60 },
            { itemId: 'lamina-sombria', chance: 0.12 },
            { itemId: 'anel-da-vida', chance: 0.10 },
            { itemId: 'pocao-de-vida-maior', chance: 0.30 }
        ]
    },
    {
        nome: 'Vampiro Ancião',
        tipo: 'elite',
        levelMin: 18, levelMax: 30, poder: 150,
        recompensas: { xp: 320, dinheiro: 220 },
        loot: [
            { itemId: 'lamina-sombria', chance: 0.20 },
            { itemId: 'manto-arcano', chance: 0.15 },
            { itemId: 'amuleto-do-mago', chance: 0.12 },
            { itemId: 'essencia-sombria', chance: 0.40 }
        ]
    },
    {
        nome: 'Demônio Menor',
        tipo: 'elite',
        levelMin: 20, levelMax: 35, poder: 170,
        recompensas: { xp: 400, dinheiro: 300 },
        loot: [
            { itemId: 'armadura-draconiana', chance: 0.08 },
            { itemId: 'amuleto-do-mago', chance: 0.15 },
            { itemId: 'elixir-de-forca', chance: 0.25 },
            { itemId: 'essencia-sombria', chance: 0.50 }
        ]
    }
];

const bossesTorre = {
    5: {
        nome: '⚔️ Goblin Rei',
        poder: 120,
        recompensas: { xp: 500, dinheiro: 500 },
        loot: [
            { itemId: 'espada-de-ferro', chance: 0.80 },
            { itemId: 'armadura-de-ferro', chance: 0.60 },
            { itemId: 'anel-de-forca', chance: 0.40 },
            { itemId: 'chave-da-torre', chance: 1.0 }
        ],
        descricao: 'O líder supremo dos goblins, protetor do 5º andar.'
    },
    10: {
        nome: '🐉 Hidra de Três Cabeças',
        poder: 250,
        recompensas: { xp: 1200, dinheiro: 1000 },
        loot: [
            { itemId: 'machado-de-batalha', chance: 0.90 },
            { itemId: 'peitoral-do-guardiao', chance: 0.70 },
            { itemId: 'anel-arcano', chance: 0.50 },
            { itemId: 'pocao-de-vida-maior', chance: 0.80 },
            { itemId: 'chave-da-torre', chance: 1.0 }
        ],
        descricao: 'Besta ancestral que guarda o portal do 10º andar.'
    },
    15: {
        nome: '👑 Rei Lich',
        poder: 400,
        recompensas: { xp: 2500, dinheiro: 2000 },
        loot: [
            { itemId: 'cajado-arcano', chance: 0.95 },
            { itemId: 'manto-arcano', chance: 0.80 },
            { itemId: 'coroa-do-saber', chance: 0.60 },
            { itemId: 'amuleto-do-mago', chance: 0.70 },
            { itemId: 'elixir-de-inteligencia', chance: 0.90 },
            { itemId: 'chave-da-torre', chance: 1.0 }
        ],
        descricao: 'Soberano morto-vivo que reina sobre o 15º andar.'
    },
    20: {
        nome: '🔥 Dragão Vermelho Ancião',
        poder: 600,
        recompensas: { xp: 5000, dinheiro: 4000 },
        loot: [
            { itemId: 'armadura-draconiana', chance: 0.90 },
            { itemId: 'lamina-sombria', chance: 0.85 },
            { itemId: 'anel-da-vida', chance: 0.75 },
            { itemId: 'escama-de-dragao', chance: 1.0 },
            { itemId: 'pocao-de-vida-maior', chance: 1.0 },
            { itemId: 'chave-da-torre', chance: 1.0 }
        ],
        descricao: 'Dragão lendário que protege o tesouro do 20º andar.'
    },
    25: {
        nome: '💀 Senhor das Sombras',
        poder: 850,
        recompensas: { xp: 10000, dinheiro: 8000 },
        loot: [
            { itemId: 'excalibur-sombria', chance: 0.50 },
            { itemId: 'armadura-draconiana', chance: 0.95 },
            { itemId: 'amuleto-ancestral', chance: 0.40 },
            { itemId: 'essencia-sombria', chance: 1.0 },
            { itemId: 'pocao-de-vida-maior', chance: 1.0 },
            { itemId: 'chave-da-torre', chance: 1.0 }
        ],
        descricao: 'Entidade sombria que comanda as forças das trevas no topo da torre.'
    }
};

function getRandomMonster(playerLevel) {
    const possibleMonsters = monsterList.filter(m => playerLevel >= m.levelMin && playerLevel <= m.levelMax);
    if (possibleMonsters.length === 0) {
        return monsterList[Math.min(Math.floor(playerLevel / 5), monsterList.length - 1)];
    }
    
    const eliteChance = Math.random();
    const eliteMonsters = possibleMonsters.filter(m => m.tipo === 'elite');
    const commonMonsters = possibleMonsters.filter(m => m.tipo === 'comum');
    
    if (eliteChance < 0.15 && eliteMonsters.length > 0) {
        const randomIndex = Math.floor(Math.random() * eliteMonsters.length);
        return eliteMonsters[randomIndex];
    }
    
    if (commonMonsters.length > 0) {
        const randomIndex = Math.floor(Math.random() * commonMonsters.length);
        return commonMonsters[randomIndex];
    }
    
    const randomIndex = Math.floor(Math.random() * possibleMonsters.length);
    return possibleMonsters[randomIndex];
}

function getBossTorre(andar) {
    return bossesTorre[andar];
}

function getProximoBossAndar(andarAtual) {
    const andares = Object.keys(bossesTorre).map(Number).sort((a, b) => a - b);
    return andares.find(andar => andar > andarAtual) || null;
}

module.exports = { 
    getRandomMonster, 
    getBossTorre, 
    getProximoBossAndar,
    bossesTorre,
    monsterList
};
