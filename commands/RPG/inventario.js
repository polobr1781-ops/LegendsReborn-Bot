const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { getPlayerData } = require('../../utils/database.js');
const { items, formatarItemNome, raridadesCores } = require('../../utils/items.js');

module.exports = {
    data: {
        name: 'inventário',
        aliases: ['inventario', 'inv', 'bag', 'i'],
        description: 'Mostra seu inventário de itens e moedas com paginação.'
    },
    async execute(message) {
        const userId = message.author.id;
        const player = await getPlayerData(userId);

        if (player.inventario.length === 0) {
            const emptyEmbed = new EmbedBuilder()
                .setColor('#FFA500')
                .setTitle(`🎒 Inventário de ${message.author.username}`)
                .setDescription('Seu inventário está vazio. Vá caçar monstros ou minerar para encontrar itens!')
                .addFields({ name: '💰 Moedas', value: `\`${player.moeda}\``, inline: true })
                .setFooter({ text: `Use !caçar ou !minerar para conseguir itens`, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();
            return message.reply({ embeds: [emptyEmbed] });
        }

        const itemsPerPage = 10;
        let page = 0;
        const totalPages = Math.ceil(player.inventario.length / itemsPerPage);

        const inventarioPorRaridade = {};
        let valorTotal = 0;

        player.inventario.forEach(invItem => {
            const itemInfo = items[invItem.id];
            if (itemInfo) {
                if (!inventarioPorRaridade[itemInfo.raridade]) {
                    inventarioPorRaridade[itemInfo.raridade] = [];
                }
                inventarioPorRaridade[itemInfo.raridade].push({ ...invItem, info: itemInfo });
                valorTotal += (itemInfo.valor || 0) * invItem.quantidade;
            }
        });

        const generateEmbed = (currentPage) => {
            const startIndex = currentPage * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const currentItems = player.inventario.slice(startIndex, endIndex);

            const description = currentItems.map((item, index) => {
                const itemInfo = items[item.id];
                const itemName = itemInfo ? formatarItemNome(itemInfo) : '❓ Item Desconhecido';
                const tipoEmoji = itemInfo?.equipavel ? '⚔️' : '📦';
                const valorItem = itemInfo?.valor ? ` (${itemInfo.valor}g cada)` : '';
                return `${tipoEmoji} ${itemName} x\`${item.quantidade}\`${valorItem}`;
            }).join('\n');

            const embed = new EmbedBuilder()
                .setTitle(`🎒 Inventário de ${message.author.username}`)
                .setColor(player.cor)
                .setDescription(description || 'Sem itens nesta página')
                .addFields(
                    { name: '💰 Moedas', value: `\`${player.moeda}\``, inline: true },
                    { name: '📦 Total de Itens', value: `\`${player.inventario.length}\` tipos`, inline: true },
                    { name: '💎 Valor Estimado', value: `\`${valorTotal}\` moedas`, inline: true }
                )
                .setFooter({ text: `Página ${currentPage + 1} de ${totalPages} | Use !equipar <item> para equipar`, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();

            return embed;
        };

        const getRow = (currentPage) => {
            const row = new ActionRowBuilder();
            row.addComponents(
                new ButtonBuilder()
                    .setCustomId('prev_page')
                    .setLabel('◀️ Anterior')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(currentPage === 0)
            );
            row.addComponents(
                new ButtonBuilder()
                    .setCustomId('next_page')
                    .setLabel('Próxima ▶️')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(currentPage + 1 >= totalPages)
            );
            return row;
        };

        const components = player.inventario.length > itemsPerPage ? [getRow(page)] : [];
        const reply = await message.reply({ 
            embeds: [generateEmbed(page)], 
            components 
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
            reply.edit({ components: [finalRow] }).catch(() => {});
        });
    }
};
