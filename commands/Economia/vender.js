const { EmbedBuilder } = require('discord.js');
const { getPlayerData, db } = require('../../utils/database.js');
const { items, formatarItemNome } = require('../../utils/items.js');

module.exports = {
    data: {
        name: 'vender',
        aliases: ['sell', 'v'],
        description: 'Vende itens do seu inventário para a loja por moedas.'
    },
    async execute(message, args) {
        const userId = message.author.id;

        if (args.length < 2) {
            const helpEmbed = new EmbedBuilder()
                .setColor('#FFD700')
                .setTitle('💰 Como Vender Itens')
                .setDescription('Venda itens do seu inventário para ganhar moedas!')
                .addFields(
                    { name: 'Formato', value: '`!vender <quantidade|tudo> <nome do item>`' },
                    { name: 'Exemplos', value: '`!vender 5 Pele de Goblin`\n`!vender tudo Pedra`\n`!vender 1 Espada de Ferro`' },
                    { name: '💡 Dica', value: 'Itens raros valem mais moedas!' }
                )
                .setFooter({ text: 'Use !inventario para ver seus itens' });
            return message.reply({ embeds: [helpEmbed] });
        }

        const quantidadeInput = args[0].toLowerCase();
        const itemNameInput = args.slice(1).join(' ').toLowerCase();
        
        const player = await getPlayerData(userId);

        const itemIdToSell = Object.keys(items).find(key => items[key].nome.toLowerCase() === itemNameInput);
        if (!itemIdToSell) {
            return message.reply('❌ Item não encontrado. Verifique o nome e tente novamente.');
        }

        const itemNoInventario = player.inventario.find(invItem => invItem.id === itemIdToSell);

        if (!itemNoInventario) {
            return message.reply(`❌ Você não possui **${items[itemIdToSell].nome}** no seu inventário.`);
        }

        const itemInfo = items[itemNoInventario.id];
        const itemPreco = itemInfo.valor || 0;
        
        if (itemPreco === 0) {
            return message.reply('❌ Este item não pode ser vendido ou não tem valor comercial.');
        }

        let quantidadeParaVender;
        if (quantidadeInput === 'tudo' || quantidadeInput === 'all') {
            quantidadeParaVender = itemNoInventario.quantidade;
        } else {
            quantidadeParaVender = parseInt(quantidadeInput);
            if (isNaN(quantidadeParaVender) || quantidadeParaVender <= 0) {
                return message.reply('❌ Quantidade inválida! Use um número positivo ou "tudo".');
            }
            if (quantidadeParaVender > itemNoInventario.quantidade) {
                return message.reply(`❌ Você não tem tantos! Você possui apenas \`${itemNoInventario.quantidade}\` de **${itemInfo.nome}**.`);
            }
        }

        const ganhoTotal = itemPreco * quantidadeParaVender;
        const saldoAnterior = player.moeda;
        player.moeda += ganhoTotal;
        itemNoInventario.quantidade -= quantidadeParaVender;

        if (itemNoInventario.quantidade <= 0) {
            player.inventario = player.inventario.filter(i => i.id !== itemNoInventario.id);
        }

        await db.set(userId, player);

        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('💰 Venda Realizada!')
            .setDescription(`Você vendeu **${quantidadeParaVender}x** ${formatarItemNome(itemInfo)}`)
            .addFields(
                { name: '💵 Valor Unitário', value: `\`${itemPreco}\` moedas`, inline: true },
                { name: '💎 Ganho Total', value: `\`${ganhoTotal}\` moedas`, inline: true },
                { name: '💰 Saldo Anterior', value: `\`${saldoAnterior}\``, inline: true },
                { name: '✨ Novo Saldo', value: `\`${player.moeda}\``, inline: true }
            )
            .setFooter({ text: `${message.author.username} | Use !loja para comprar itens`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        await message.reply({ embeds: [embed] });
    }
};
