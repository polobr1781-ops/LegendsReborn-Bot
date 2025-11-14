const { EmbedBuilder } = require('discord.js');
const { getPlayerData, db, adicionarXp } = require('../../utils/database.js');
const { items } = require('../../utils/items.js');

const adminIDs = ["1042918158752817172"];

module.exports = {
    data: {
        name: 'admin',
        aliases: ['adm', 'narrador'],
        description: 'Comandos administrativos para narradores gerenciarem o jogo.'
    },
    async execute(message, args) {
        if (!adminIDs.includes(message.author.id)) {
            return message.reply('❌ Você não tem permissão para usar comandos de narrador.');
        }

        const subCommand = args[0]?.toLowerCase();
        const targetUser = message.mentions.users.first();

        if (!subCommand) {
            const helpEmbed = new EmbedBuilder()
                .setTitle('🎭 Painel do Narrador')
                .setColor('#FF6B6B')
                .setDescription('**Comandos Disponíveis:**')
                .addFields(
                    { 
                        name: '📊 Gerenciamento de Player', 
                        value: 
                            '`!admin darxp <@user> <valor>` - Dá XP\n' +
                            '`!admin darpontos <@user> <valor>` - Dá pontos de atributo\n' +
                            '`!admin darmoeda <@user> <valor>` - Dá moedas\n' +
                            '`!admin darlevel <@user> <nivel>` - Define o nível'
                    },
                    { 
                        name: '🎒 Gerenciamento de Itens', 
                        value: 
                            '`!admin daritem <@user> <item_id> [qtd]` - Dá itens\n' +
                            '`!admin removeritem <@user> <item_id> [qtd]` - Remove itens\n' +
                            '`!admin limparinv <@user>` - Limpa inventário'
                    },
                    { 
                        name: '🏰 Gerenciamento da Torre', 
                        value: 
                            '`!admin setandar <@user> <numero>` - Define andar da torre\n' +
                            '`!admin addmissao <@user> <nome_missao>` - Marca missão completa\n' +
                            '`!admin vermissoes <@user>` - Lista missões do player'
                    },
                    { 
                        name: '🎭 Outros', 
                        value: 
                            '`!admin resetcd <@user>` - Reseta todos os cooldowns\n' +
                            '`!admin setclasse <@user> <classe>` - Define classe\n' +
                            '`!admin info <@user>` - Mostra dados completos do player'
                    }
                )
                .setFooter({ text: 'Use com responsabilidade! Comandos afetam diretamente o jogo.' });
            return message.reply({ embeds: [helpEmbed] });
        }
        
        if (!targetUser && !['broadcast'].includes(subCommand)) {
            return message.reply('❌ Você precisa mencionar um usuário!');
        }

        const player = await getPlayerData(targetUser.id);
        
        switch (subCommand) {
            case 'darxp': {
                const amount = parseInt(args[2]);
                if (isNaN(amount) || amount <= 0) return message.reply('❌ Quantidade de XP inválida.');
                
                const levelUps = adicionarXp(player, amount);
                await db.set(targetUser.id, player);

                let replyMsg = `✅ Você deu **${amount} XP** para ${targetUser.username}.`;
                if (levelUps > 0) {
                    replyMsg += ` Ele subiu **${levelUps}** nível(is) e agora está no Nível **${player.level}**!`;
                }
                return message.reply(replyMsg);
            }
            
            case 'darlevel': {
                const nivel = parseInt(args[2]);
                if (isNaN(nivel) || nivel < 1) return message.reply('❌ Nível inválido.');
                
                player.level = nivel;
                player.xp = 0;
                player.xpParaUpar = Math.floor(Math.pow(nivel, 1.5) * 100);
                await db.set(targetUser.id, player);
                return message.reply(`✅ ${targetUser.username} agora está no nível **${nivel}**.`);
            }
            
            case 'darpontos': {
                const amount = parseInt(args[2]);
                if (isNaN(amount) || amount <= 0) return message.reply('❌ Quantidade de pontos inválida.');
                player.pontos.atributo += amount;
                await db.set(targetUser.id, player);
                return message.reply(`✅ Você deu **${amount} Pontos de Atributo** para ${targetUser.username}.`);
            }
            
            case 'darmoeda': {
                const amount = parseInt(args[2]);
                if (isNaN(amount) || amount <= 0) return message.reply('❌ Quantidade de moedas inválida.');
                player.moeda += amount;
                await db.set(targetUser.id, player);
                return message.reply(`✅ Você deu **${amount} Moedas** para ${targetUser.username}. Novo saldo: ${player.moeda}`);
            }
            
            case 'daritem': {
                const itemId = args[2]?.toLowerCase();
                const itemAmount = parseInt(args[3]) || 1;
                
                if (!itemId || !items[itemId]) {
                    return message.reply(`❌ Item ID inválido. Verifique o arquivo \`utils/items.js\`.`);
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
            
            case 'removeritem': {
                const itemId = args[2]?.toLowerCase();
                const itemAmount = parseInt(args[3]) || 1;
                
                const itemExistente = player.inventario.find(i => i.id === itemId);
                if (!itemExistente) {
                    return message.reply('❌ O player não possui este item.');
                }
                
                itemExistente.quantidade -= itemAmount;
                if (itemExistente.quantidade <= 0) {
                    player.inventario = player.inventario.filter(i => i.id !== itemId);
                }
                
                await db.set(targetUser.id, player);
                return message.reply(`✅ Removido **${itemAmount}x ${items[itemId].nome}** de ${targetUser.username}.`);
            }
            
            case 'limparinv': {
                player.inventario = [];
                await db.set(targetUser.id, player);
                return message.reply(`✅ Inventário de ${targetUser.username} foi limpo.`);
            }
            
            case 'setandar': {
                const andar = parseInt(args[2]);
                if (isNaN(andar) || andar < 0) return message.reply('❌ Número de andar inválido.');
                
                player.torre.andar = andar;
                await db.set(targetUser.id, player);
                return message.reply(`✅ ${targetUser.username} agora está no **Andar ${andar}** da torre.`);
            }
            
            case 'addmissao': {
                const missaoNome = args.slice(2).join(' ');
                if (!missaoNome) return message.reply('❌ Especifique o nome da missão.');
                
                if (!player.torre.missoesConcluidas.includes(missaoNome)) {
                    player.torre.missoesConcluidas.push(missaoNome);
                    await db.set(targetUser.id, player);
                    return message.reply(`✅ Missão **"${missaoNome}"** marcada como concluída para ${targetUser.username}.`);
                } else {
                    return message.reply(`⚠️ ${targetUser.username} já completou esta missão.`);
                }
            }
            
            case 'vermissoes': {
                const missoes = player.torre.missoesConcluidas || [];
                const embed = new EmbedBuilder()
                    .setColor('#4A90E2')
                    .setTitle(`📋 Missões de ${targetUser.username}`)
                    .setDescription(
                        `**Andar Atual:** ${player.torre.andar}\n\n` +
                        `**Missões Concluídas:**\n${missoes.length > 0 ? missoes.map((m, i) => `${i + 1}. ${m}`).join('\n') : 'Nenhuma missão concluída.'}`
                    );
                return message.reply({ embeds: [embed] });
            }
            
            case 'resetcd': {
                player.cooldowns = { treino: 0, cacar: 0, minerar: 0, torre: 0 };
                await db.set(targetUser.id, player);
                return message.reply(`✅ Todos os cooldowns de ${targetUser.username} foram resetados.`);
            }
            
            case 'setclasse': {
                const classe = args[2]?.toLowerCase();
                const classesValidas = ['guerreiro', 'mago', 'arqueiro', 'ladino'];
                
                if (!classesValidas.includes(classe)) {
                    return message.reply('❌ Classe inválida. Use: guerreiro, mago, arqueiro ou ladino.');
                }
                
                player.classe = classe.charAt(0).toUpperCase() + classe.slice(1);
                await db.set(targetUser.id, player);
                return message.reply(`✅ Classe de ${targetUser.username} definida como **${player.classe}**.`);
            }
            
            case 'info': {
                const embed = new EmbedBuilder()
                    .setColor('#9B59B6')
                    .setTitle(`🔍 Informações Completas de ${targetUser.username}`)
                    .addFields(
                        { name: '📊 Básico', value: `Nível: ${player.level}\nXP: ${player.xp}/${player.xpParaUpar}\nClasse: ${player.classe || 'Nenhuma'}`, inline: true },
                        { name: '💰 Recursos', value: `Moedas: ${player.moeda}\nPontos: ${player.pontos.atributo}`, inline: true },
                        { name: '🏰 Torre', value: `Andar: ${player.torre.andar}\nMissões: ${player.torre.missoesConcluidas.length}`, inline: true },
                        { name: '💪 Atributos', value: `FOR: ${player.atributos.forca} | DES: ${player.atributos.destreza}\nCON: ${player.atributos.constituicao} | INT: ${player.atributos.inteligencia}` },
                        { name: '📦 Inventário', value: `Itens: ${player.inventario.length} tipos` },
                        { name: '📊 Estatísticas', value: `Monstros: ${player.estatisticas?.monstrosDerrotados || 0}\nMortes: ${player.estatisticas?.mortesTotal || 0}` }
                    );
                return message.reply({ embeds: [embed] });
            }
            
            default:
                return message.reply('❌ Sub-comando de narrador desconhecido. Use `!admin` para ver todos os comandos.');
        }
    }
};
