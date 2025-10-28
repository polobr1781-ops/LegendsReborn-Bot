const items = {
    'pele-de-goblin': {
        nome: 'Pele de Goblin',
        tipo: 'material',
        equipavel: false,
    },
    'presa-de-lobo': {
        nome: 'Presa de Lobo',
        tipo: 'material',
        equipavel: false,
    },
    'fragmento-de-armadura-orc': {
        nome: 'Fragmento de Armadura Orc',
        tipo: 'material',
        equipavel: false,
    },
    'adaga-improvisada': {
        nome: 'Adaga Improvisada',
        tipo: 'arma',
        slot: 'arma',
        equipavel: true,
        bonus: {
            destreza: 2,
        }
    },
    'espada-curta-enferrujada': {
        nome: 'Espada Curta Enferrujada',
        tipo: 'arma',
        slot: 'arma',
        equipavel: true,
        bonus: {
            forca: 2,
        }
    },
    'tunica-de-couro': {
        nome: 'Túnica de Couro',
        tipo: 'armadura',
        slot: 'peitoral',
        equipavel: true,
        bonus: {
            constituicao: 1,
            destreza: 1,
        }
    }
};

function getItem(itemId) {
    return items[itemId];
}

module.exports = { items, getItem };