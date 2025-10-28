const { EmbedBuilder } = require('discord.js');
const { getPlayerData, db } = require('../../utils/database.js');
const { items } = require('../../utils/items.js');

module.exports = {
    data: {
        name: 'equipar',
        aliases: ['equip'],
        description: 'Equipa um item do seu inventário.'
    },
    async execute(message, args) {
        const userId = message.author.id;

        if (args.length === 0) {
            return message.reply('Você precisa dizer qual item quer equipar! Ex: `!equipar Adaga Improvisada`');
        }

        const itemNameInput = args.join(' ').toLowerCase();
        const player = await getPlayerData(userId);
        
        const itemIdToEquip = Object.keys(items).find(key => items[key].nome.toLowerCase() === itemNameInput);

        if (!itemIdToEquip) {
            return message.reply('❌ Não conheço nenhum item com esse nome.');
        }

        const itemNoInventario = player.inventario.find(invItem => invItem.id === itemIdToEquip);

        if (!itemNoInventario) {
            return message.reply('❌ Você não possui este item no seu inventário.');
        }

        const itemParaEquipar = items[itemNoInventario.id];

        if (!itemParaEquipar || !itemParaEquipar.equipavel) {
            return message.reply(`❌ Você não pode equipar "${itemParaEquipar.nome}".`);
        }

        const slot = itemParaEquipar.slot;
        const itemAntigoId = player.equipamento[slot];
        if (itemAntigoId) {
            const itemExistente = player.inventario.find(i => i.id === itemAntigoId);
            if (itemExistente) {
                itemExistente.quantidade++;
            } else {
                player.inventario.push({ id: itemAntigoId, quantidade: 1 });
            }
        }

        itemNoInventario.quantidade--;
        if (itemNoInventario.quantidade <= 0) {
            player.inventario = player.inventario.filter(i => i.id !== itemNoInventario.id);
        }

        player.equipamento[slot] = itemNoInventario.id;

        await db.set(userId, player);

        const embed = new EmbedBuilder()
            .setColor('Green')
            .setTitle('✅ Item Equipado!')
            .setDescription(`Você equipou **${itemParaEquipar.nome}** no slot de ${slot}.`);
        
        if (itemAntigoId) {
            embed.setFooter({ text: `${items[itemAntigoId].nome} foi enviado de volta para o inventário.` });
        }

        await message.reply({ embeds: [embed] });
    }
};