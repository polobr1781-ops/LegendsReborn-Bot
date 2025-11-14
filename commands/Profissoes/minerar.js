const { EmbedBuilder } = require('discord.js');
const { getPlayerData, db } = require('../../utils/database.js');
const { items, formatarItemNome } = require('../../utils/items.js');

module.exports = {
    data: {
        name: 'minerar',
        aliases: ['mine', 'm'],
        description: 'Minera em busca de recursos valiosos.'
    },
    async execute(message) {
        const userId = message.author.id;
        const player = await getPlayerData(userId);
        
        const cooldownTime = 5 * 60 * 1000;

        if (player.cooldowns.minerar && Date.now() < player.cooldowns.minerar) {
            const timeLeft = (player.cooldowns.minerar - Date.now()) / 1000;
            return message.reply(`⏰ Você ainda está descansando da mineração. Aguarde **${Math.floor(timeLeft / 60)}m ${Math.floor(timeLeft % 60)}s**.`);
        }

        if (!player.profissoes) {
            player.profissoes = {
                mineracao: { level: 1, xp: 0 },
                ferraria: { level: 1, xp: 0 },
                alquimia: { level: 1, xp: 0 }
            };
        }

        const mineracaoLevel = player.profissoes.mineracao?.level || 1;
        let itemsEncontrados = [];
        let xpGanho = 0;

        const lootTable = [
            { levelReq: 1, itemId: 'pedra', chance: 0.9, xp: 2, quantidade: () => Math.floor(Math.random() * 3) + 1 },
            { levelReq: 1, itemId: 'carvao', chance: 0.5, xp: 5, quantidade: () => Math.floor(Math.random() * 2) + 1 },
            { levelReq: 3, itemId: 'minerio-de-ferro', chance: 0.3, xp: 15, quantidade: () => 1 },
            { levelReq: 5, itemId: 'minerio-de-ouro', chance: 0.15, xp: 35, quantidade: () => 1 },
            { levelReq: 8, itemId: 'cristal-magico', chance: 0.08, xp: 75, quantidade: () => 1 }
        ];

        for (const drop of lootTable) {
            if (mineracaoLevel >= drop.levelReq && Math.random() < drop.chance) {
                const itemInfo = items[drop.itemId];
                if (itemInfo) {
                    const quantidade = drop.quantidade();
                    itemsEncontrados.push({ nome: formatarItemNome(itemInfo), quantidade });
                    xpGanho += drop.xp * quantidade;

                    const itemExistente = player.inventario.find(i => i.id === drop.itemId);
                    if (itemExistente) {
                        itemExistente.quantidade += quantidade;
                    } else {
                        player.inventario.push({ id: drop.itemId, quantidade });
                    }
                    player.estatisticas.itensEncontrados += quantidade;
                }
            }
        }

        const embed = new EmbedBuilder();
        
        if (itemsEncontrados.length > 0) {
            player.profissoes.mineracao.xp += xpGanho;
            
            const itensTexto = itemsEncontrados.map(item => `${item.nome} x\`${item.quantidade}\``).join('\n');
            
            embed.setColor('#8B4513')
                 .setTitle('⛏️ Mineração Bem-Sucedida!')
                 .setDescription(`Você trabalha duro nas minas e encontra:\n\n${itensTexto}`)
                 .addFields(
                     { name: '✨ XP de Mineração', value: `+\`${xpGanho}\` XP`, inline: true },
                     { name: '📊 Level de Mineração', value: `\`${player.profissoes.mineracao.level}\``, inline: true }
                 );
        
            const xpParaUpar = player.profissoes.mineracao.level * 100;
            let levelUps = 0;
            
            while (player.profissoes.mineracao.xp >= xpParaUpar) {
                player.profissoes.mineracao.level++;
                player.profissoes.mineracao.xp -= xpParaUpar;
                levelUps++;
            }
            
            if (levelUps > 0) {
                embed.addFields({ 
                    name: '🎉 Profissão Aprimorada!', 
                    value: `Sua habilidade de Mineração subiu para o Nível **${player.profissoes.mineracao.level}**!\nAgora você pode encontrar recursos mais raros!` 
                });
            }

            const progressoXP = Math.floor((player.profissoes.mineracao.xp / xpParaUpar) * 100);
            embed.setFooter({ text: `Progresso para próximo nível: ${progressoXP}% (${player.profissoes.mineracao.xp}/${xpParaUpar})`, iconURL: message.author.displayAvatarURL() });

        } else {
            embed.setColor('#9E9E9E')
                 .setTitle('⛏️ Nenhum Recurso Encontrado')
                 .setDescription('Você minerou por um tempo, mas não encontrou nada de valor desta vez. A sorte pode estar melhor na próxima!')
                 .setFooter({ text: 'Tente novamente em alguns minutos!' });
        }

        player.cooldowns.minerar = Date.now() + cooldownTime;
        await db.set(userId, player);

        embed.setTimestamp();
        await message.reply({ embeds: [embed] });
    }
};
