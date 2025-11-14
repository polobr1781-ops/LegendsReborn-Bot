const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType } = require('discord.js');
const { getPlayerData, db } = require('../../utils/database.js');
const { items, getItemsByType, formatarItemNome } = require('../../utils/items.js');

const loja = {
    'pocao-de-vida-menor': { preco: 50 },
    'pocao-de-vida': { preco: 120 },
    'pocao-de-vida-maior': { preco: 300 },
    'elixir-de-forca': { preco: 150 },
    'elixir-de-inteligencia': { preco: 150 },
    'espada-de-ferro': { preco: 150 },
    'cajado-aprendiz': { preco: 50 },
    'tunica-de-couro': { preco: 50 },
    'armadura-de-ferro': { preco: 180 },
    'capacete-de-couro': { preco: 35 },
    'elmo-de-ferro': { preco: 120 },
    'calcas-de-couro': { preco: 40 },
    'grevas-de-ferro': { preco: 135 },
    'botas-simples': { preco: 25 },
    'botas-de-ferro': { preco: 105 }
};

module.exports = {
    data: {
        name: 'loja',
        aliases: ['shop', 'comprar', 'buy'],
        description: 'Compra itens na loja com suas moedas.'
    },
    async execute(message, args) {
        const userId = message.author.id;
        const player = await getPlayerData(userId);

        if (args.length === 0) {
            const categorias = {
                'consumiveis': [],
                'armas': [],
                'armaduras': []
            };

            for (const [itemId, lojaInfo] of Object.entries(loja)) {
                const itemInfo = items[itemId];
                if (!itemInfo) continue;

                const itemTexto = `${formatarItemNome(itemInfo)} - \`${lojaInfo.preco}g\``;
                
                if (itemInfo.tipo === 'consumivel') {
                    categorias.consumiveis.push(itemTexto);
                } else if (itemInfo.tipo === 'arma') {
                    categorias.armas.push(itemTexto);
                } else if (itemInfo.tipo === 'armadura') {
                    categorias.armaduras.push(itemTexto);
                }
            }

            const embed = new EmbedBuilder()
                .setColor('#FFD700')
                .setTitle('🏪 Loja do Aventureiro')
                .setDescription(`Bem-vindo à loja! Aqui você pode comprar equipamentos e consumíveis.\n\n**Seu Saldo:** \`${player.moeda}\` moedas`)
                .addFields(
                    { name: '⚔️ Armas', value: categorias.armas.join('\n') || 'Nenhuma disponível', inline: false },
                    { name: '🛡️ Armaduras', value: categorias.armaduras.join('\n') || 'Nenhuma disponível', inline: false },
                    { name: '🧪 Consumíveis', value: categorias.consumiveis.join('\n') || 'Nenhum disponível', inline: false }
                )
                .setFooter({ text: 'Use: !loja <nome do item> para comprar | Exemplo: !loja Poção de Vida' });

            return message.reply({ embeds: [embed] });
        }

        const itemNome = args.join(' ').toLowerCase();
        const itemId = Object.keys(loja).find(key => items[key]?.nome.toLowerCase() === itemNome);

        if (!itemId || !loja[itemId]) {
            return message.reply('❌ Item não encontrado na loja. Use `!loja` para ver os itens disponíveis.');
        }

        const itemInfo = items[itemId];
        const preco = loja[itemId].preco;

        if (player.moeda < preco) {
            return message.reply(`❌ Moedas insuficientes! Você tem \`${player.moeda}\`g mas precisa de \`${preco}\`g.\n\n💡 Dica: Use \`!caçar\` ou \`!vender\` para ganhar moedas!`);
        }

        if (itemInfo.nivelReq && player.level < itemInfo.nivelReq) {
            return message.reply(`❌ Você precisa ser nível **${itemInfo.nivelReq}** para comprar este item. (Seu nível: ${player.level})`);
        }

        player.moeda -= preco;
        
        const itemExistente = player.inventario.find(i => i.id === itemId);
        if (itemExistente) {
            itemExistente.quantidade++;
        } else {
            player.inventario.push({ id: itemId, quantidade: 1 });
        }

        await db.set(userId, player);

        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('✅ Compra Realizada!')
            .setDescription(`Você comprou ${formatarItemNome(itemInfo)}!`)
            .addFields(
                { name: '💰 Preço', value: `\`${preco}\` moedas`, inline: true },
                { name: '💵 Saldo Restante', value: `\`${player.moeda}\` moedas`, inline: true }
            )
            .setFooter({ text: 'Use !inventario para ver seus itens' })
            .setTimestamp();

        if (itemInfo.equipavel) {
            embed.addFields({ name: '💡 Dica', value: `Use \`!equipar ${itemInfo.nome}\` para equipar este item!` });
        }

        await message.reply({ embeds: [embed] });
    }
};
