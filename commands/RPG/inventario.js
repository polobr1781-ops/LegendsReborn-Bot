const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { getPlayerData } = require('../../utils/database.js');
const { items } = require('../../utils/items.js');

module.exports = {
    data: {
        name: 'inventário',
        aliases: ['inventario', 'inv', 'bag'],
        description: 'Mostra seu inventário de itens e moedas.'
    },
    async execute(message) {
        const userId = message.author.id;
        const player = await getPlayerData(userId);

        const itemsPerPage = 10;
        let page = 0;
        const totalPages = Math.max(1, Math.ceil(player.inventario.length / itemsPerPage));

        const generateEmbed = (currentPage) => {
            const startIndex = currentPage * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const currentItems = player.inventario.slice(startIndex, endIndex);

            const description = player.inventario.length === 0 
                ? 'Seu inventário está vazio.' 
                : currentItems.map((item, index) => {
                    const itemInfo = items[item.id];
                    const itemName = itemInfo ? itemInfo.nome : 'Item Desconhecido';
                    return `${startIndex + index + 1}. **${itemName}** (x${item.quantidade})`;
                }).join('\n');

            return new EmbedBuilder()
                .setTitle(`🎒 Inventário de ${message.author.username}`)
                .setColor(player.cor)
                .setDescription(description)
                .setFooter({ text: `Página ${currentPage + 1} de ${totalPages} | Moedas: ${player.moeda}` });
        };

        const getRow = (currentPage) => {
            const row = new ActionRowBuilder();
            row.addComponents(
                new ButtonBuilder().setCustomId('prev_page').setLabel('◀️').setStyle(ButtonStyle.Primary).setDisabled(currentPage === 0)
            );
            row.addComponents(
                new ButtonBuilder().setCustomId('next_page').setLabel('▶️').setStyle(ButtonStyle.Primary).setDisabled(currentPage + 1 >= totalPages)
            );
            return row;
        };

        const reply = await message.reply({ 
            embeds: [generateEmbed(page)], 
            components: player.inventario.length > itemsPerPage ? [getRow(page)] : [] 
        });

        if (player.inventario.length <= itemsPerPage) return;

        const filter = i => i.user.id === userId;
        const collector = reply.createMessageComponentCollector({ filter, time: 120000 });

        collector.on('collect', async i => {
            if (i.customId === 'next_page') page++;
            else if (i.customId === 'prev_page') page--;
            await i.update({ embeds: [generateEmbed(page)], components: [getRow(page)] });
        });

        collector.on('end', () => {
            const finalRow = getRow(page);
            finalRow.components.forEach(button => button.setDisabled(true));
            reply.edit({ components: [finalRow] });
        });
    }
};