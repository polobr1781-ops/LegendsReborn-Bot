const { EmbedBuilder } = require('discord.js');
const { getPlayerData, db, adicionarXp } = require('../../utils/database.js');
const { items } = require('../../utils/items.js');

const adminIDs = ["1042918158752817172"];

module.exports = {
    data: {
        name: 'admin',
        aliases: ['adm'],
        description: 'Comandos administrativos para gerenciar o jogo.'
    },
    async execute(message, args) {
        if (!adminIDs.includes(message.author.id)) {
            return message.reply('❌ Você não tem permissão para usar este comando.');
        }

        const subCommand = args[0]?.toLowerCase();
        const targetUser = message.mentions.users.first();

        if (!subCommand) {
            const helpEmbed = new EmbedBuilder()
                .setTitle('⚙️ Painel de Administrador')
                .setColor('Gold')
                .setDescription(
                    '**Sub-comandos disponíveis:**\n' +
                    '`darxp <@usuario> <quantidade>`\n' +
                    '`darpontos <@usuario> <quantidade>`\n' +
                    '`darmoeda <@usuario> <quantidade>`\n' +
                    '`daritem <@usuario> <item_id> [quantidade]`'
                );
            return message.reply({ embeds: [helpEmbed] });
        }
        
        if (!targetUser) {
            return message.reply('Você precisa mencionar um usuário!');
        }

        const player = await getPlayerData(targetUser.id);
        
        switch (subCommand) {
            case 'darxp': {
                const amount = parseInt(args[2]);
                if (isNaN(amount) || amount <= 0) return message.reply('Quantidade de XP inválida.');
                
                const levelUps = adicionarXp(player, amount);
                await db.set(targetUser.id, player);

                let replyMsg = `✅ Você deu **${amount} XP** para ${targetUser.username}.`;
                if (levelUps > 0) {
                    replyMsg += ` Ele subiu **${levelUps}** nível(is) e agora está no Nível **${player.level}**!`;
                }
                return message.reply(replyMsg);
            }
            case 'darpontos': {
                const amount = parseInt(args[2]);
                if (isNaN(amount) || amount <= 0) return message.reply('Quantidade de pontos inválida.');
                player.pontos.atributo += amount;
                await db.set(targetUser.id, player);
                return message.reply(`✅ Você deu **${amount} Pontos de Atributo** para ${targetUser.username}.`);
            }
            case 'darmoeda': {
                const amount = parseInt(args[2]);
                if (isNaN(amount) || amount <= 0) return message.reply('Quantidade de moedas inválida.');
                player.moeda += amount;
                await db.set(targetUser.id, player);
                return message.reply(`✅ Você deu **${amount} Moedas** para ${targetUser.username}.`);
            }
            case 'daritem': {
                const itemId = args[2]?.toLowerCase();
                const itemAmount = parseInt(args[3]) || 1;
                
                if (!itemId || !items[itemId]) {
                    return message.reply(`Item ID inválido. Verifique o arquivo \`utils/items.js\` para a lista de IDs.`);
                }
                
                const itemExistente = player.inventario.find(i => i.id === itemId);
                if (itemExistente) {
                    itemExistente.quantidade += itemAmount;
                } else {
                    player.inventario.push({ id: itemId, quantidade: itemAmount });
                }
                
                await db.set(targetUser.id, player);
                return message.reply(`✅ Você deu **${itemAmount}x ${items[itemId].nome}** para ${targetUser.username}.`);
            }
            default:
                return message.reply('Sub-comando de admin desconhecido.');
        }
    }
};