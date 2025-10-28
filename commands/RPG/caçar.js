const { EmbedBuilder } = require('discord.js');
const { getPlayerData, db, adicionarXp } = require('../../utils/database.js');
const { getRandomMonster } = require('../../utils/monsters.js');
const { items } = require('../../utils/items.js');

module.exports = {
    data: {
        name: 'caçar',
        aliases: ['cacar', 'hunt'],
        description: 'Caça monstros para ganhar XP e outras recompensas.'
    },
    async execute(message) {
        const userId = message.author.id;
        const player = await getPlayerData(userId);
        const cooldownTime = 3 * 60 * 1000;

        if (player.cooldowns.cacar && Date.now() < player.cooldowns.cacar) {
            const timeLeft = (player.cooldowns.cacar - Date.now()) / 1000;
            return message.reply(`Você está cansado da última caçada. Descanse por mais ${Math.floor(timeLeft / 60)}m e ${Math.floor(timeLeft % 60)}s.`);
        }

        const monstro = getRandomMonster(player.level);
        const poderJogador = (player.atributos.forca + (player.atributos.destreza / 2) + player.level) * (Math.random() * 0.5 + 0.75);
        const poderMonstro = monstro.poder * (Math.random() * 0.5 + 0.75);
        const vitoria = poderJogador > poderMonstro;

        let description = `🌲 Você adentra a floresta e encontra um **${monstro.nome}**!\n\n`;
        const embed = new EmbedBuilder();

        if (vitoria) {
            const xpGanho = monstro.recompensas.xp;
            const dinheiroGanho = monstro.recompensas.dinheiro || 0;
            
            player.moeda += dinheiroGanho;
            description += `Após uma batalha intensa, você derrota a criatura!\n\n**Recompensas:**\n✨ \`${xpGanho}\` de XP\n🪙 \`${dinheiroGanho}\` Moedas`;
            
            const levelUps = adicionarXp(player, xpGanho);
            if (levelUps > 0) {
                description += `\n\n**🌟 LEVEL UP! (x${levelUps}) 🌟**\nVocê alcançou o Nível **${player.level}**!`;
            }

            if (monstro.loot) {
                for (const drop of monstro.loot) {
                    if (Math.random() < drop.chance) {
                        const itemInfo = items[drop.itemId];
                        if (itemInfo) {
                            description += `\n📦 Você encontrou: **${itemInfo.nome}**!`;
                            const itemExistente = player.inventario.find(i => i.id === drop.itemId);
                            if (itemExistente) {
                                itemExistente.quantidade++;
                            } else {
                                player.inventario.push({ id: drop.itemId, quantidade: 1 });
                            }
                        }
                    }
                }
            }
            embed.setColor('Green').setTitle('🏆 Vitória!');

        } else {
            description += `A criatura era muito forte! Você recua para lutar outro dia.\n\nVocê não ganhou recompensas.`;
            embed.setColor('Red').setTitle('⚔️ Fuga!');
        }
        
        player.cooldowns.cacar = Date.now() + cooldownTime;
        await db.set(userId, player);
        
        embed.setDescription(description);
        await message.reply({ embeds: [embed] });
    }
};