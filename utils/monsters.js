const monsterList = [
    {
        nome: 'Goblin Fraco',
        levelMin: 1, levelMax: 3, poder: 15,
        recompensas: { xp: 20, dinheiro: 10 },
        loot: [ { itemId: 'pele-de-goblin', chance: 0.5 }, { itemId: 'adaga-improvisada', chance: 0.05 } ]
    },
    {
        nome: 'Lobo Selvagem',
        levelMin: 2, levelMax: 5, poder: 25,
        recompensas: { xp: 35, dinheiro: 20 },
        loot: [ { itemId: 'presa-de-lobo', chance: 0.3 }, { itemId: 'tunica-de-couro', chance: 0.1 } ]
    },
    {
        nome: 'Orc Batedor',
        levelMin: 4, levelMax: 8, poder: 40,
        recompensas: { xp: 50, dinheiro: 35 },
        loot: [ { itemId: 'fragmento-de-armadura-orc', chance: 0.4 }, { itemId: 'espada-curta-enferrujada', chance: 0.08 } ]
    },
];

function getRandomMonster(playerLevel) {
    const possibleMonsters = monsterList.filter(m => playerLevel >= m.levelMin && playerLevel <= m.levelMax);
    if (possibleMonsters.length === 0) {
        return monsterList[Math.floor(Math.random() * monsterList.length)];
    }
    const randomIndex = Math.floor(Math.random() * possibleMonsters.length);
    return possibleMonsters[randomIndex];
}

module.exports = { getRandomMonster };