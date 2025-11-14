const items = {
    'pele-de-goblin': { nome: 'Pele de Goblin', tipo: 'material', raridade: 'comum', equipavel: false, valor: 5 },
    'presa-de-lobo': { nome: 'Presa de Lobo', tipo: 'material', raridade: 'comum', equipavel: false, valor: 12 },
    'fragmento-de-armadura-orc': { nome: 'Fragmento de Armadura Orc', tipo: 'material', raridade: 'incomum', equipavel: false, valor: 20 },
    'escama-de-dragao': { nome: 'Escama de Dragão', tipo: 'material', raridade: 'raro', equipavel: false, valor: 150 },
    'essencia-sombria': { nome: 'Essência Sombria', tipo: 'material', raridade: 'épico', equipavel: false, valor: 300 },
    'pedra': { nome: 'Pedra', tipo: 'material', raridade: 'comum', equipavel: false, valor: 2 },
    'carvao': { nome: 'Carvão', tipo: 'material', raridade: 'comum', equipavel: false, valor: 8 },
    'minerio-de-ferro': { nome: 'Minério de Ferro', tipo: 'material', raridade: 'comum', equipavel: false, valor: 25 },
    'minerio-de-ouro': { nome: 'Minério de Ouro', tipo: 'material', raridade: 'incomum', equipavel: false, valor: 75 },
    'cristal-magico': { nome: 'Cristal Mágico', tipo: 'material', raridade: 'raro', equipavel: false, valor: 120 },

    'adaga-improvisada': { nome: 'Adaga Improvisada', tipo: 'arma', slot: 'arma', raridade: 'comum', equipavel: true, nivelReq: 1, valor: 15, bonus: { destreza: 2, forca: 1 }, descricao: 'Uma adaga tosca, mas funcional.' },
    'espada-curta-enferrujada': { nome: 'Espada Curta Enferrujada', tipo: 'arma', slot: 'arma', raridade: 'comum', equipavel: true, nivelReq: 1, valor: 25, bonus: { forca: 2, constituicao: 1 }, descricao: 'Velha espada coberta de ferrugem.' },
    'espada-de-ferro': { nome: 'Espada de Ferro', tipo: 'arma', slot: 'arma', raridade: 'comum', equipavel: true, nivelReq: 5, valor: 100, bonus: { forca: 5, constituicao: 2 }, descricao: 'Espada sólida forjada em ferro.' },
    'machado-de-batalha': { nome: 'Machado de Batalha', tipo: 'arma', slot: 'arma', raridade: 'incomum', equipavel: true, nivelReq: 8, valor: 200, bonus: { forca: 8, constituicao: 3 }, descricao: 'Machado pesado que causa grande dano.' },
    'lamina-sombria': { nome: 'Lâmina Sombria', tipo: 'arma', slot: 'arma', raridade: 'raro', equipavel: true, nivelReq: 15, valor: 500, bonus: { destreza: 10, inteligencia: 5, forca: 5 }, descricao: 'Espada envoltra em sombras misteriosas.' },
    'cajado-aprendiz': { nome: 'Cajado do Aprendiz', tipo: 'arma', slot: 'arma', raridade: 'comum', equipavel: true, nivelReq: 1, valor: 30, bonus: { inteligencia: 3, constituicao: 1 }, descricao: 'Cajado básico para iniciantes na magia.' },
    'cajado-arcano': { nome: 'Cajado Arcano', tipo: 'arma', slot: 'arma', raridade: 'incomum', equipavel: true, nivelReq: 10, valor: 250, bonus: { inteligencia: 8, destreza: 3 }, descricao: 'Cajado imbuído com poder arcano.' },
    'arco-longo': { nome: 'Arco Longo', tipo: 'arma', slot: 'arma', raridade: 'incomum', equipavel: true, nivelReq: 7, valor: 180, bonus: { destreza: 7, forca: 3 }, descricao: 'Arco de madeira nobre com grande alcance.' },
    'excalibur-sombria': { nome: 'Excalibur Sombria', tipo: 'arma', slot: 'arma', raridade: 'lendário', equipavel: true, nivelReq: 25, valor: 2000, bonus: { forca: 15, destreza: 10, constituicao: 10, inteligencia: 8 }, descricao: 'Lendária espada dos heróis antigos.' },

    'tunica-de-couro': { nome: 'Túnica de Couro', tipo: 'armadura', slot: 'peitoral', raridade: 'comum', equipavel: true, nivelReq: 1, valor: 30, bonus: { constituicao: 2, destreza: 1 }, descricao: 'Proteção básica de couro curtido.' },
    'armadura-de-ferro': { nome: 'Armadura de Ferro', tipo: 'armadura', slot: 'peitoral', raridade: 'comum', equipavel: true, nivelReq: 5, valor: 120, bonus: { constituicao: 5, forca: 2 }, descricao: 'Armadura sólida de placas de ferro.' },
    'peitoral-do-guardiao': { nome: 'Peitoral do Guardião', tipo: 'armadura', slot: 'peitoral', raridade: 'incomum', equipavel: true, nivelReq: 10, valor: 300, bonus: { constituicao: 8, forca: 4 }, descricao: 'Peitoral reforçado usado por guardiões.' },
    'manto-arcano': { nome: 'Manto Arcano', tipo: 'armadura', slot: 'peitoral', raridade: 'raro', equipavel: true, nivelReq: 12, valor: 450, bonus: { inteligencia: 10, constituicao: 5 }, descricao: 'Manto que amplifica poderes mágicos.' },
    'armadura-draconiana': { nome: 'Armadura Draconiana', tipo: 'armadura', slot: 'peitoral', raridade: 'épico', equipavel: true, nivelReq: 20, valor: 1500, bonus: { constituicao: 15, forca: 10, destreza: 5 }, descricao: 'Armadura feita com escamas de dragão.' },

    'capacete-de-couro': { nome: 'Capacete de Couro', tipo: 'armadura', slot: 'elmo', raridade: 'comum', equipavel: true, nivelReq: 1, valor: 20, bonus: { constituicao: 1 }, descricao: 'Elmo simples de couro.' },
    'elmo-de-ferro': { nome: 'Elmo de Ferro', tipo: 'armadura', slot: 'elmo', raridade: 'comum', equipavel: true, nivelReq: 5, valor: 80, bonus: { constituicao: 3, forca: 1 }, descricao: 'Elmo resistente de ferro.' },
    'coroa-do-saber': { nome: 'Coroa do Saber', tipo: 'armadura', slot: 'elmo', raridade: 'raro', equipavel: true, nivelReq: 15, valor: 600, bonus: { inteligencia: 8, constituicao: 4 }, descricao: 'Coroa que aumenta a percepção mágica.' },

    'calcas-de-couro': { nome: 'Calças de Couro', tipo: 'armadura', slot: 'calcas', raridade: 'comum', equipavel: true, nivelReq: 1, valor: 25, bonus: { constituicao: 1, destreza: 1 }, descricao: 'Calças reforçadas de couro.' },
    'grevas-de-ferro': { nome: 'Grevas de Ferro', tipo: 'armadura', slot: 'calcas', raridade: 'comum', equipavel: true, nivelReq: 5, valor: 90, bonus: { constituicao: 4, forca: 2 }, descricao: 'Proteção de pernas em ferro.' },
    'calcas-do-vento': { nome: 'Calças do Vento', tipo: 'armadura', slot: 'calcas', raridade: 'incomum', equipavel: true, nivelReq: 8, valor: 200, bonus: { destreza: 6, constituicao: 3 }, descricao: 'Calças leves que aumentam agilidade.' },

    'botas-simples': { nome: 'Botas Simples', tipo: 'armadura', slot: 'botas', raridade: 'comum', equipavel: true, nivelReq: 1, valor: 15, bonus: { destreza: 1 }, descricao: 'Botas básicas para aventureiros.' },
    'botas-de-ferro': { nome: 'Botas de Ferro', tipo: 'armadura', slot: 'botas', raridade: 'comum', equipavel: true, nivelReq: 5, valor: 70, bonus: { constituicao: 3, destreza: 1 }, descricao: 'Botas pesadas mas resistentes.' },
    'botas-do-ladrao': { nome: 'Botas do Ladrão', tipo: 'armadura', slot: 'botas', raridade: 'incomum', equipavel: true, nivelReq: 8, valor: 180, bonus: { destreza: 7, constituicao: 2 }, descricao: 'Botas silenciosas perfeitas para furtividade.' },

    'anel-de-forca': { nome: 'Anel de Força', tipo: 'acessorio', slot: 'anel', raridade: 'incomum', equipavel: true, nivelReq: 5, valor: 150, bonus: { forca: 4 }, descricao: 'Anel que aumenta a força física.' },
    'anel-arcano': { nome: 'Anel Arcano', tipo: 'acessorio', slot: 'anel', raridade: 'raro', equipavel: true, nivelReq: 10, valor: 400, bonus: { inteligencia: 6, destreza: 2 }, descricao: 'Anel encantado com magia antiga.' },
    'anel-da-vida': { nome: 'Anel da Vida', tipo: 'acessorio', slot: 'anel', raridade: 'épico', equipavel: true, nivelReq: 15, valor: 800, bonus: { constituicao: 10, forca: 3 }, descricao: 'Anel que fortalece a vitalidade.' },

    'amuleto-de-protecao': { nome: 'Amuleto de Proteção', tipo: 'acessorio', slot: 'amuleto', raridade: 'incomum', equipavel: true, nivelReq: 5, valor: 200, bonus: { constituicao: 5 }, descricao: 'Amuleto que protege contra danos.' },
    'amuleto-do-mago': { nome: 'Amuleto do Mago', tipo: 'acessorio', slot: 'amuleto', raridade: 'raro', equipavel: true, nivelReq: 12, valor: 500, bonus: { inteligencia: 8, constituicao: 3 }, descricao: 'Amuleto que amplia poderes mágicos.' },
    'amuleto-ancestral': { nome: 'Amuleto Ancestral', tipo: 'acessorio', slot: 'amuleto', raridade: 'lendário', equipavel: true, nivelReq: 20, valor: 1800, bonus: { forca: 8, destreza: 8, constituicao: 8, inteligencia: 8 }, descricao: 'Relíquia antiga de poder incomparável.' },

    'pocao-de-vida-menor': { nome: 'Poção de Vida Menor', tipo: 'consumivel', raridade: 'comum', equipavel: false, valor: 30, efeito: { tipo: 'cura', valor: 50 }, descricao: 'Restaura 50 pontos de vida.' },
    'pocao-de-vida': { nome: 'Poção de Vida', tipo: 'consumivel', raridade: 'incomum', equipavel: false, valor: 80, efeito: { tipo: 'cura', valor: 150 }, descricao: 'Restaura 150 pontos de vida.' },
    'pocao-de-vida-maior': { nome: 'Poção de Vida Maior', tipo: 'consumivel', raridade: 'raro', equipavel: false, valor: 200, efeito: { tipo: 'cura', valor: 400 }, descricao: 'Restaura 400 pontos de vida.' },
    'elixir-de-forca': { nome: 'Elixir de Força', tipo: 'consumivel', raridade: 'incomum', equipavel: false, valor: 100, efeito: { tipo: 'buff', atributo: 'forca', valor: 5, duracao: 3600 }, descricao: 'Aumenta força em 5 por 1 hora.' },
    'elixir-de-inteligencia': { nome: 'Elixir de Inteligência', tipo: 'consumivel', raridade: 'incomum', equipavel: false, valor: 100, efeito: { tipo: 'buff', atributo: 'inteligencia', valor: 5, duracao: 3600 }, descricao: 'Aumenta inteligência em 5 por 1 hora.' },
    'chave-da-torre': { nome: 'Chave da Torre', tipo: 'especial', raridade: 'raro', equipavel: false, valor: 0, descricao: 'Permite desafiar um boss da torre.' }
};

const raridadesCores = {
    'comum': '#9E9E9E',
    'incomum': '#4CAF50',
    'raro': '#2196F3',
    'épico': '#9C27B0',
    'lendário': '#FF9800'
};

const raridadesEmoji = {
    'comum': '⚪',
    'incomum': '🟢',
    'raro': '🔵',
    'épico': '🟣',
    'lendário': '🟠'
};

function getItem(itemId) {
    return items[itemId];
}

function getItemsByType(tipo) {
    return Object.entries(items)
        .filter(([id, item]) => item.tipo === tipo)
        .map(([id, item]) => ({ id, ...item }));
}

function getItemsByRaridade(raridade) {
    return Object.entries(items)
        .filter(([id, item]) => item.raridade === raridade)
        .map(([id, item]) => ({ id, ...item }));
}

function formatarItemNome(item) {
    const emoji = raridadesEmoji[item.raridade] || '⚪';
    return `${emoji} **${item.nome}**`;
}

module.exports = { 
    items, 
    getItem, 
    getItemsByType, 
    getItemsByRaridade,
    formatarItemNome,
    raridadesCores,
    raridadesEmoji
};
