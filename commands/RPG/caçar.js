const { EmbedBuilder } = require('discord.js');
const { getPlayerData, db, adicionarXp, calcularBonusEquipamentos } = require('../../utils/database.js');
const { getRandomMonster } = require('../../utils/monsters.js');
const { items, formatarItemNome } = require('../../utils/items.js');

module.exports = {
    data: {
        name: 'caçar',
        aliases: ['cacar', 'hunt', 'h'],
        description: 'Caça monstros para ganhar XP, moedas e itens.'
    },
    async execute(message) {
        const userId = message.author.id;
        const player = await getPlayerData(userId);
        const cooldownTime = 3 * 60 * 1000;

        if (player.cooldowns.cacar && Date.now() < player.cooldowns.cacar) {
            const timeLeft = (player.cooldowns.cacar - Date.now()) / 1000;
            return message.reply(`⏰ Você está descansando da última caçada. Aguarde mais **${Math.floor(timeLeft / 60)}m ${Math.floor(timeLeft % 60)}s**.`);
        }

        const monstro = getRandomMonster(player.level);
        const bonus = calcularBonusEquipamentos(player);
        
        const totalForca = player.atributos.forca + bonus.forca;
        const totalDestreza = player.atributos.destreza + bonus.destreza;
        const totalConstituicao = player.atributos.constituicao + bonus.constituicao;
        
        const poderJogador = (totalForca * 1.2 + totalDestreza * 0.8 + totalConstituicao * 0.5 + player.level * 2) * (Math.random() * 0.3 + 0.85);
        const poderMonstro = monstro.poder * (Math.random() * 0.3 + 0.85);
        const vitoria = poderJogador > poderMonstro;

        let description = `🌲 Você adentra as terras selvagens e encontra um **${monstro.nome}**${monstro.tipo === 'elite' ? ' ⭐' : ''}!\n\n`;
        const embed = new EmbedBuilder();

        if (vitoria) {
            const xpGanho = monstro.recompensas.xp;
            const dinheiroGanho = monstro.recompensas.dinheiro || 0;
            
            player.moeda += dinheiroGanho;
            player.estatisticas.monstrosDerrotados++;
            player.estatisticas.dinheiroGanho += dinheiroGanho;
            
            description += `⚔️ Após uma batalha épica, você emerge vitorioso!\n\n`;
            description += `**💎 Recompensas:**\n`;
            description += `✨ XP: \`+${xpGanho}\`\n`;
            description += `🪙 Moedas: \`+${dinheiroGanho}\`\n`;
            
            const levelUps = adicionarXp(player, xpGanho);
            if (levelUps > 0) {
                description += `\n🌟 **LEVEL UP! (x${levelUps})** 🌟\n`;
                description += `Você alcançou o Nível **${player.level}**!\n`;
                description += `Ganhou **${levelUps * 3}** pontos de atributo!`;
            }

            if (monstro.loot && monstro.loot.length > 0) {
                const itensEncontrados = [];
                for (const drop of monstro.loot) {
                    if (Math.random() < drop.chance) {
                        const itemInfo = items[drop.itemId];
                        if (itemInfo) {
                            itensEncontrados.push(formatarItemNome(itemInfo));
                            const itemExistente = player.inventario.find(i => i.id === drop.itemId);
                            if (itemExistente) {
                                itemExistente.quantidade++;
                            } else {
                                player.inventario.push({ id: drop.itemId, quantidade: 1 });
                            }
                            player.estatisticas.itensEncontrados++;
                        }
                    }
                }
                
                if (itensEncontrados.length > 0) {
                    description += `\n\n📦 **Itens Encontrados:**\n${itensEncontrados.join('\n')}`;
                }
            }
            
            embed.setColor('#00FF00').setTitle('🏆 Vitória!');

        } else {
            description += `💨 A criatura era muito poderosa! Você recua estrategicamente.\n\n`;
            description += `Nenhuma recompensa foi obtida, mas você ganhou experiência valiosa para a próxima batalha.`;
            player.estatisticas.mortesTotal++;
            embed.setColor('#FF4444').setTitle('⚠️ Derrota Tática');
        }
        
        player.cooldowns.cacar = Date.now() + cooldownTime;
        await db.set(userId, player);
        
        embed.setDescription(description);
        embed.setFooter({ text: `${message.author.username} | Monstros derrotados: ${player.estatisticas.monstrosDerrotados}`, iconURL: message.author.displayAvatarURL() });
        embed.setTimestamp();
        
        await message.reply({ embeds: [embed] });
    }
};
