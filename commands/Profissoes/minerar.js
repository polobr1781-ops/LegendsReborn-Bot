const { EmbedBuilder } = require('discord.js');
const { getPlayerData, db } = require('../../utils/database.js');
const { items } = require('../../utils/items.js');

module.exports = {
    data: {
        name: 'minerar',
        aliases: ['mine'],
        description: 'Minera em busca de recursos.'
    },
    async execute(message) {
        const userId = message.author.id;
        const player = await getPlayerData(userId);
        
        const cooldownTime = 5 * 60 * 1000;

        if (player.cooldowns.minerar && Date.now() < player.cooldowns.minerar) {
            const timeLeft = (player.cooldowns.minerar - Date.now()) / 1000;
            return message.reply(`Você ainda está descansando. Volte a minerar em ${Math.floor(timeLeft / 60)}m e ${Math.floor(timeLeft % 60)}s.`);
        }

        const mineracaoLevel = player.profissoes.mineracao.level;
        let itemsEncontrados = [];
        let xpGanho = 0;

        const lootTable = [
            { levelReq: 1, itemId: 'pedra', chance: 0.8, xp: 2 },
            { levelReq: 1, itemId: 'carvao', chance: 0.4, xp: 5 },
            { levelReq: 5, itemId: 'minerio-de-ferro', chance: 0.2, xp: 15 },
        ];

        for (const drop of lootTable) {
            if (mineracaoLevel >= drop.levelReq && Math.random() < drop.chance) {
                const itemInfo = items[drop.itemId];
                if (itemInfo) {
                    itemsEncontrados.push(itemInfo.nome);
                    xpGanho += drop.xp;

                    const itemExistente = player.inventario.find(i => i.id === drop.itemId);
                    if (itemExistente) {
                        itemExistente.quantidade++;
                    } else {
                        player.inventario.push({ id: drop.itemId, quantidade: 1 });
                    }
                }
            }
        }

        const embed = new EmbedBuilder();
        if (itemsEncontrados.length > 0) {
            player.profissoes.mineracao.xp += xpGanho;
            
            embed.setColor('Green')
                 .setTitle('⛏️ Mineração Bem-Sucedida!')
                 .setDescription(`Você bate sua picareta nas rochas e encontra:\n\n- ${itemsEncontrados.join('\n- ')}\n\nVocê ganhou \`${xpGanho}\` de XP de Mineração!`);
        
            const xpParaUpar = player.profissoes.mineracao.level * 75;
            if (player.profissoes.mineracao.xp >= xpParaUpar) {
                player.profissoes.mineracao.level++;
                player.profissoes.mineracao.xp -= xpParaUpar;
                embed.addFields({ name: '🎉 Nível de Profissão Aumentou!', value: `Sua habilidade de Mineração subiu para o Nível **${player.profissoes.mineracao.level}**!` });
            }

        } else {
            embed.setColor('Grey')
                 .setTitle('⛏️ Nada Encontrado')
                 .setDescription('Você minerou por um tempo, mas não encontrou nada de valor. Tente novamente mais tarde.');
        }

        player.cooldowns.minerar = Date.now() + cooldownTime;
        await db.set(userId, player);

        await message.reply({ embeds: [embed] });
    }
};