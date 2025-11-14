const { EmbedBuilder } = require('discord.js');
const { getPlayerData, db } = require('../../utils/database.js');
const { items, formatarItemNome } = require('../../utils/items.js');

module.exports = {
    data: {
        name: 'equipar',
        aliases: ['equip', 'e'],
        description: 'Equipa um item do seu inventário.'
    },
    async execute(message, args) {
        const userId = message.author.id;

        if (args.length === 0) {
            const helpEmbed = new EmbedBuilder()
                .setColor('#FFA500')
                .setTitle('⚔️ Como Equipar Itens')
                .setDescription('Use o comando para equipar itens do seu inventário.')
                .addFields(
                    { name: 'Formato', value: '`!equipar <nome do item>`' },
                    { name: 'Exemplo', value: '`!equipar Espada de Ferro`' },
                    { name: 'Slots Disponíveis', value: 'Arma, Elmo, Peitoral, Calças, Botas, Anel, Amuleto' }
                )
                .setFooter({ text: 'Dica: Itens equipados dão bônus aos seus atributos!' });
            return message.reply({ embeds: [helpEmbed] });
        }

        const itemNameInput = args.join(' ').toLowerCase();
        const player = await getPlayerData(userId);
        
        const itemIdToEquip = Object.keys(items).find(key => items[key].nome.toLowerCase() === itemNameInput);

        if (!itemIdToEquip) {
            return message.reply('❌ Item não encontrado. Verifique o nome e tente novamente.');
        }

        const itemNoInventario = player.inventario.find(invItem => invItem.id === itemIdToEquip);

        if (!itemNoInventario) {
            return message.reply(`❌ Você não possui **${items[itemIdToEquip].nome}** no seu inventário. Use \`!inventario\` para ver seus itens.`);
        }

        const itemParaEquipar = items[itemNoInventario.id];

        if (!itemParaEquipar || !itemParaEquipar.equipavel) {
            return message.reply(`❌ **${itemParaEquipar.nome}** não pode ser equipado. Esse item é do tipo ${itemParaEquipar.tipo}.`);
        }

        if (itemParaEquipar.nivelReq && player.level < itemParaEquipar.nivelReq) {
            return message.reply(`❌ Você precisa ser nível **${itemParaEquipar.nivelReq}** para equipar **${itemParaEquipar.nome}**. (Seu nível: ${player.level})`);
        }

        const slot = itemParaEquipar.slot;
        const itemAntigoId = player.equipamento[slot];
        
        if (itemAntigoId) {
            const itemAntigo = items[itemAntigoId];
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

        const bonusText = itemParaEquipar.bonus 
            ? Object.entries(itemParaEquipar.bonus)
                .map(([attr, val]) => `+${val} ${attr.charAt(0).toUpperCase() + attr.slice(1)}`)
                .join(', ')
            : 'Nenhum';

        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('✅ Item Equipado!')
            .setDescription(`Você equipou ${formatarItemNome(itemParaEquipar)} no slot de **${slot}**.`)
            .addFields(
                { name: '📊 Bônus', value: bonusText, inline: true },
                { name: '🎯 Slot', value: slot.charAt(0).toUpperCase() + slot.slice(1), inline: true }
            )
            .setTimestamp();
        
        if (itemAntigoId) {
            embed.setFooter({ text: `${items[itemAntigoId].nome} foi enviado de volta para o inventário.` });
        }

        await message.reply({ embeds: [embed] });
    }
};
