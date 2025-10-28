const { EmbedBuilder } = require('discord.js');
const { getPlayerData, db } = require('../../utils/database.js');
const { items } = require('../../utils/items.js');
const { getBuyPrice } = require('../../utils/shop.js');

module.exports = {
    data: {
        name: 'vender',
        aliases: ['sell'],
        description: 'Vende um item do seu inventário para a loja.'
    },
    async execute(message, args) {
        const userId = message.author.id;

        if (args.length < 2) {
            return message.reply('Uso incorreto! Formato: `!vender <quantidade|tudo> <nome do item>`\nExemplo: `!vender 5 Pele de Goblin`');
        }

        const quantidadeInput = args[0].toLowerCase();
        const itemNameInput = args.slice(1).join(' ').toLowerCase();
        
        const player = await getPlayerData(userId);

        const itemIdToSell = Object.keys(items).find(key => items[key].nome.toLowerCase() === itemNameInput);
        if (!itemIdToSell) {
            return message.reply('❌ Não conheço nenhum item com esse nome.');
        }

        const itemNoInventario = player.inventario.find(invItem => invItem.id === itemIdToSell);

        if (!itemNoInventario) {
            return message.reply('❌ Você não possui este item no seu inventário.');
        }

        const itemPreco = getBuyPrice(itemNoInventario.id);
        if (!itemPreco) {
            return message.reply('❌ A loja não tem interesse em comprar este tipo de item.');
        }

        let quantidadeParaVender;
        if (quantidadeInput === 'tudo' || quantidadeInput === 'all') {
            quantidadeParaVender = itemNoInventario.quantidade;
        } else {
            quantidadeParaVender = parseInt(quantidadeInput);
            if (isNaN(quantidadeParaVender) || quantidadeParaVender <= 0) {
                return message.reply('❌ A quantidade para vender deve ser um número maior que zero ou a palavra "tudo".');
            }
            if (quantidadeParaVender > itemNoInventario.quantidade) {
                return message.reply(`❌ Você não tem tantos! Você só possui \`${itemNoInventario.quantidade}\` de **${items[itemNoInventario.id].nome}**.`);
            }
        }

        const ganhoTotal = itemPreco * quantidadeParaVender;
        player.moeda += ganhoTotal;
        itemNoInventario.quantidade -= quantidadeParaVender;

        if (itemNoInventario.quantidade <= 0) {
            player.inventario = player.inventario.filter(i => i.id !== itemNoInventario.id);
        }

        await db.set(userId, player);

        const embed = new EmbedBuilder()
            .setColor('Green')
            .setTitle('💰 Venda Realizada com Sucesso!')
            .setDescription(`Você vendeu **${quantidadeParaVender}x ${items[itemNoInventario.id].nome}** por \`${ganhoTotal}\` Moedas.`)
            .setFooter({ text: `Seu novo saldo: ${player.moeda} Moedas` });

        await message.reply({ embeds: [embed] });
    }
};