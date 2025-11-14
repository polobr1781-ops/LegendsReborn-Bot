const { EmbedBuilder } = require('discord.js');
const { getPlayerData, db } = require('../../utils/database.js');
const { items, formatarItemNome } = require('../../utils/items.js');

module.exports = {
    data: {
        name: 'desequipar',
        aliases: ['unequip', 'de'],
        description: 'Desequipa um item de um slot específico e o envia para o inventário.'
    },
    async execute(message, args) {
        const userId = message.author.id;

        if (args.length === 0) {
            const helpEmbed = new EmbedBuilder()
                .setColor('#FFA500')
                .setTitle('🎒 Como Desequipar Itens')
                .setDescription('Use o comando para remover itens equipados.')
                .addFields(
                    { name: 'Formato', value: '`!desequipar <slot>`' },
                    { name: 'Exemplo', value: '`!desequipar arma`' },
                    { name: '📋 Slots Válidos', value: '`arma`, `elmo`, `peitoral`, `calcas`, `botas`, `anel`, `amuleto`' }
                )
                .setFooter({ text: 'O item será devolvido ao seu inventário' });
            return message.reply({ embeds: [helpEmbed] });
        }

        const slotInput = args[0].toLowerCase();
        const player = await getPlayerData(userId);

        const slotsValidos = ['arma', 'elmo', 'peitoral', 'calcas', 'botas', 'anel', 'amuleto'];
        if (!slotsValidos.includes(slotInput)) {
            return message.reply(`❌ Slot inválido! Slots disponíveis: ${slotsValidos.map(s => `\`${s}\``).join(', ')}`);
        }

        const itemEquipadoId = player.equipamento[slotInput];

        if (!itemEquipadoId) {
            return message.reply(`❌ Você não tem nada equipado no slot de **${slotInput}**. Use \`!perfil\` para ver seus equipamentos.`);
        }

        const itemInfo = items[itemEquipadoId];

        const itemExistente = player.inventario.find(i => i.id === itemEquipadoId);
        if (itemExistente) {
            itemExistente.quantidade++;
        } else {
            player.inventario.push({ id: itemEquipadoId, quantidade: 1 });
        }

        player.equipamento[slotInput] = null;
        await db.set(userId, player);

        const bonusText = itemInfo.bonus 
            ? Object.entries(itemInfo.bonus)
                .map(([attr, val]) => `-${val} ${attr.charAt(0).toUpperCase() + attr.slice(1)}`)
                .join(', ')
            : 'Nenhum';

        const embed = new EmbedBuilder()
            .setColor('#FF9800')
            .setTitle('📦 Item Desequipado!')
            .setDescription(`Você desequipou ${formatarItemNome(itemInfo)} e o enviou para o inventário.`)
            .addFields(
                { name: '📊 Bônus Removidos', value: bonusText, inline: true },
                { name: '🎯 Slot Liberado', value: slotInput.charAt(0).toUpperCase() + slotInput.slice(1), inline: true }
            )
            .setTimestamp();
        
        await message.reply({ embeds: [embed] });
    }
};
