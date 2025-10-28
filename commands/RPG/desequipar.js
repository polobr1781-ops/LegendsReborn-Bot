const { EmbedBuilder } = require('discord.js');
const { getPlayerData, db } = require('../../utils/database.js');
const { items } = require('../../utils/items.js');

module.exports = {
    data: {
        name: 'desequipar',
        aliases: ['unequip'],
        description: 'Desequipa um item de um slot específico.'
    },
    async execute(message, args) {
        const userId = message.author.id;

        if (args.length === 0) {
            return message.reply('Você precisa dizer qual slot quer esvaziar! Ex: `!desequipar arma`\n**Slots:** `arma`, `elmo`, `peitoral`, `calcas`, `botas`');
        }

        const slotInput = args[0].toLowerCase();
        const player = await getPlayerData(userId);

        const slotsValidos = ['arma', 'elmo', 'peitoral', 'calcas', 'botas'];
        if (!slotsValidos.includes(slotInput)) {
            return message.reply('Slot inválido! Use `arma`, `elmo`, `peitoral`, `calcas` ou `botas`.');
        }

        const itemEquipadoId = player.equipamento[slotInput];

        if (!itemEquipadoId) {
            return message.reply(`Você não tem nada equipado no slot de ${slotInput}.`);
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

        const embed = new EmbedBuilder()
            .setColor('Orange')
            .setTitle('✅ Item Desequipado!')
            .setDescription(`Você desequipou **${itemInfo.nome}** e o enviou para o inventário.`);
        
        await message.reply({ embeds: [embed] });
    }
};