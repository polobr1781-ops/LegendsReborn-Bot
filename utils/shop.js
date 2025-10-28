const shopBuys = {
    'pele-de-goblin': { buyPrice: 5 },
    'presa-de-lobo': { buyPrice: 12 },
    'fragmento-de-armadura-orc': { buyPrice: 20 },
    'adaga-improvisada': { buyPrice: 15 },
    'espada-curta-enferrujada': { buyPrice: 25 },
    'tunica-de-couro': { buyPrice: 30 },
    'pedra': { buyPrice: 2 },
    'carvao': { buyPrice: 8 },
    'minerio-de-ferro': { buyPrice: 25 },
};

function getBuyPrice(itemId) {
    return shopBuys[itemId] ? shopBuys[itemId].buyPrice : null;
}

module.exports = { getBuyPrice };