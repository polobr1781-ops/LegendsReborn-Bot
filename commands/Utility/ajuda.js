const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'ajuda',
        aliases: ['help', 'h', 'comandos', 'commands'],
        description: 'Mostra todos os comandos disponíveis e como usar o bot.'
    },
    async execute(message) {
        const mainEmbed = new EmbedBuilder()
            .setColor('#FFD700')
            .setTitle('⚔️ LEGENDS REBORN - GUIA DE COMANDOS')
            .setDescription(
                'Bem-vindo ao **Legends Reborn**! Um RPG de texto onde você escolhe sua classe, ' +
                'caça monstros, minera recursos, evolui seu personagem e sobe os andares de uma torre misteriosa!\n\n' +
                '**📚 Categorias de Comandos:**'
            )
            .addFields(
                { name: '⚔️ RPG Básico', value: '`!perfil`, `!classe`, `!distribuir`', inline: true },
                { name: '🎒 Inventário', value: '`!inventario`, `!equipar`, `!desequipar`', inline: true },
                { name: '⚔️ Combate', value: '`!caçar`', inline: true },
                { name: '💰 Economia', value: '`!loja`, `!vender`', inline: true },
                { name: '⛏️ Profissões', value: '`!minerar`', inline: true },
                { name: '🛠️ Utilidades', value: '`!ping`, `!admin`', inline: true }
            )
            .setFooter({ text: 'Use !ajuda <comando> para detalhes | Exemplo: !ajuda perfil', iconURL: message.author.displayAvatarURL() });

        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('help_category')
                    .setPlaceholder('📖 Selecione uma categoria para ver mais detalhes')
                    .addOptions([
                        {
                            label: 'RPG Básico',
                            description: 'Comandos essenciais de personagem',
                            value: 'rpg',
                            emoji: '⚔️'
                        },
                        {
                            label: 'Inventário & Equipamentos',
                            description: 'Gerencie seus itens e equipamentos',
                            value: 'inventario',
                            emoji: '🎒'
                        },
                        {
                            label: 'Combate & Grind',
                            description: 'Batalhas automáticas para evoluir',
                            value: 'combate',
                            emoji: '⚔️'
                        },
                        {
                            label: 'Economia',
                            description: 'Compre e venda itens',
                            value: 'economia',
                            emoji: '💰'
                        },
                        {
                            label: 'Profissões',
                            description: 'Mineração e outras profissões',
                            value: 'profissoes',
                            emoji: '⛏️'
                        }
                    ])
            );

        const reply = await message.reply({ embeds: [mainEmbed], components: [row] });

        const filter = i => i.user.id === message.author.id;
        const collector = reply.createMessageComponentCollector({ filter, time: 120000 });

        collector.on('collect', async i => {
            let embed = new EmbedBuilder().setColor('#FFD700');

            switch (i.values[0]) {
                case 'rpg':
                    embed.setTitle('⚔️ Comandos de RPG Básico')
                        .setDescription('Comandos essenciais para gerenciar seu personagem')
                        .addFields(
                            { 
                                name: '!perfil [@usuário]', 
                                value: 'Mostra seu perfil completo com nível, XP, atributos, equipamentos e estatísticas.\n**Aliases:** `!p`, `!profile`, `!status`' 
                            },
                            { 
                                name: '!classe', 
                                value: 'Escolha sua classe: **Guerreiro**, **Mago**, **Arqueiro** ou **Ladino**.\nCada classe oferece bônus únicos. **Escolha é permanente!**\n**Aliases:** `!class`, `!escolher`' 
                            },
                            { 
                                name: '!distribuir <atributo> <quantidade>', 
                                value: 'Distribui pontos de atributo que você ganhou ao subir de nível.\n**Atributos:** `forca`, `destreza`, `constituicao`, `inteligencia`\n**Exemplo:** `!distribuir forca 5`\n**Aliases:** `!dist`, `!d`' 
                            }
                        );
                    break;

                case 'inventario':
                    embed.setTitle('🎒 Inventário & Equipamentos')
                        .setDescription('Gerencie seus itens e equipamentos')
                        .addFields(
                            { 
                                name: '!inventario', 
                                value: 'Mostra todos os itens que você possui, com paginação e valor total.\n**Aliases:** `!inv`, `!i`, `!bag`' 
                            },
                            { 
                                name: '!equipar <nome do item>', 
                                value: 'Equipa um item do seu inventário para ganhar bônus de atributos.\n**Exemplo:** `!equipar Espada de Ferro`\n**Aliases:** `!equip`, `!e`' 
                            },
                            { 
                                name: '!desequipar <slot>', 
                                value: 'Remove um item equipado e o devolve ao inventário.\n**Slots:** `arma`, `elmo`, `peitoral`, `calcas`, `botas`, `anel`, `amuleto`\n**Exemplo:** `!desequipar arma`\n**Aliases:** `!unequip`, `!de`' 
                            }
                        );
                    break;

                case 'combate':
                    embed.setTitle('⚔️ Combate & Grind')
                        .setDescription('Batalhas automáticas para ganhar XP, moedas e itens')
                        .addFields(
                            { 
                                name: '!caçar', 
                                value: 'Enfrenta um monstro aleatório em batalha automática.\n**Recompensas:** XP, moedas e itens raros\n**Cooldown:** 3 minutos\n**Dica:** Quanto maior seu nível, mais fortes os monstros!\n**Aliases:** `!cacar`, `!hunt`, `!h`' 
                            },
                            { 
                                name: '💡 Dica de Combate', 
                                value: 'Seu poder em combate é calculado com base em:\n• Força (dano físico)\n• Destreza (precisão)\n• Constituição (resistência)\n• Inteligência (poder mágico)\n• Bônus de equipamentos\n\nEquipe-se bem antes de caçar!' 
                            }
                        );
                    break;

                case 'economia':
                    embed.setTitle('💰 Economia')
                        .setDescription('Compre e venda itens para ganhar moedas')
                        .addFields(
                            { 
                                name: '!loja [nome do item]', 
                                value: 'Sem argumentos: mostra todos os itens à venda.\nCom nome: compra o item especificado.\n**Exemplo:** `!loja Poção de Vida`\n**Aliases:** `!shop`, `!comprar`, `!buy`' 
                            },
                            { 
                                name: '!vender <quantidade|tudo> <nome do item>', 
                                value: 'Vende itens do seu inventário por moedas.\n**Exemplos:** \n`!vender 5 Pele de Goblin`\n`!vender tudo Pedra`\n**Aliases:** `!sell`, `!v`' 
                            }
                        );
                    break;

                case 'profissoes':
                    embed.setTitle('⛏️ Profissões')
                        .setDescription('Colete recursos com suas profissões')
                        .addFields(
                            { 
                                name: '!minerar', 
                                value: 'Minera em busca de pedras, minérios e cristais.\n**Recompensas:** Recursos variados, XP de profissão\n**Cooldown:** 5 minutos\n**Level Up:** Quanto maior o nível de mineração, melhores os recursos!\n**Aliases:** `!mine`, `!m`' 
                            },
                            { 
                                name: '💎 Sistema de Profissões', 
                                value: 'Cada profissão tem seu próprio nível e XP.\nAo subir de nível, você desbloqueia recursos mais raros!' 
                            }
                        );
                    break;
            }

            embed.setFooter({ text: `Solicitado por ${message.author.username}`, iconURL: message.author.displayAvatarURL() });
            await i.update({ embeds: [embed], components: [row] });
        });

        collector.on('end', () => {
            reply.edit({ components: [] }).catch(() => {});
        });
    }
};
