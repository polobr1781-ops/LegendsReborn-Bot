const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { getPlayerData, db } = require('../../utils/database.js');

const classes = {
    guerreiro: {
        nome: '⚔️ Guerreiro',
        emoji: '⚔️',
        descricao: 'Mestre do combate corpo a corpo com alta resistência',
        bonusAtributos: { forca: 3, constituicao: 2 },
        especialidade: 'Dano físico e resistência',
        cor: '#CD5C5C'
    },
    mago: {
        nome: '🔮 Mago',
        emoji: '🔮',
        descricao: 'Conjurador de feitiços poderosos e magias arcanas',
        bonusAtributos: { inteligencia: 4, destreza: 1 },
        especialidade: 'Dano mágico e controle',
        cor: '#4169E1'
    },
    arqueiro: {
        nome: '🏹 Arqueiro',
        emoji: '🏹',
        descricao: 'Atirador preciso com alta mobilidade e destreza',
        bonusAtributos: { destreza: 4, forca: 1 },
        especialidade: 'Precisão e velocidade',
        cor: '#228B22'
    },
    ladino: {
        nome: '🗡️ Ladino',
        emoji: '🗡️',
        descricao: 'Especialista em furtividade e golpes críticos',
        bonusAtributos: { destreza: 3, inteligencia: 2 },
        especialidade: 'Críticos e evasão',
        cor: '#8B008B'
    }
};

module.exports = {
    data: {
        name: 'classe',
        aliases: ['class', 'escolher'],
        description: 'Escolha ou visualize sua classe de personagem.'
    },
    async execute(message) {
        const userId = message.author.id;
        const player = await getPlayerData(userId);

        if (player.classe) {
            const classeInfo = classes[player.classe.toLowerCase()];
            const embed = new EmbedBuilder()
                .setColor(classeInfo.cor)
                .setTitle(`${classeInfo.nome} - Sua Classe Atual`)
                .setDescription(classeInfo.descricao)
                .addFields(
                    { name: '🎯 Especialidade', value: classeInfo.especialidade },
                    { name: '📊 Bônus Iniciais Recebidos', value: Object.entries(classeInfo.bonusAtributos)
                        .map(([attr, val]) => `+${val} ${attr.charAt(0).toUpperCase() + attr.slice(1)}`)
                        .join('\n') }
                )
                .setFooter({ text: 'Você já escolheu sua classe e não pode mudar!' });
            return message.reply({ embeds: [embed] });
        }

        const embed = new EmbedBuilder()
            .setColor('#FFD700')
            .setTitle('🎭 Escolha Sua Classe!')
            .setDescription('Selecione uma classe para seu personagem. **Esta escolha é permanente!**\n\nCada classe oferece bônus únicos e define seu estilo de jogo.')
            .addFields(
                {
                    name: classes.guerreiro.nome,
                    value: `${classes.guerreiro.descricao}\n**Bônus:** +${classes.guerreiro.bonusAtributos.forca} FOR, +${classes.guerreiro.bonusAtributos.constituicao} CON\n**Especialidade:** ${classes.guerreiro.especialidade}`,
                    inline: false
                },
                {
                    name: classes.mago.nome,
                    value: `${classes.mago.descricao}\n**Bônus:** +${classes.mago.bonusAtributos.inteligencia} INT, +${classes.mago.bonusAtributos.destreza} DES\n**Especialidade:** ${classes.mago.especialidade}`,
                    inline: false
                },
                {
                    name: classes.arqueiro.nome,
                    value: `${classes.arqueiro.descricao}\n**Bônus:** +${classes.arqueiro.bonusAtributos.destreza} DES, +${classes.arqueiro.bonusAtributos.forca} FOR\n**Especialidade:** ${classes.arqueiro.especialidade}`,
                    inline: false
                },
                {
                    name: classes.ladino.nome,
                    value: `${classes.ladino.descricao}\n**Bônus:** +${classes.ladino.bonusAtributos.destreza} DES, +${classes.ladino.bonusAtributos.inteligencia} INT\n**Especialidade:** ${classes.ladino.especialidade}`,
                    inline: false
                }
            )
            .setFooter({ text: '⚠️ Atenção: A escolha de classe é permanente!' });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('classe_guerreiro')
                    .setLabel('Guerreiro')
                    .setEmoji('⚔️')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('classe_mago')
                    .setLabel('Mago')
                    .setEmoji('🔮')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('classe_arqueiro')
                    .setLabel('Arqueiro')
                    .setEmoji('🏹')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('classe_ladino')
                    .setLabel('Ladino')
                    .setEmoji('🗡️')
                    .setStyle(ButtonStyle.Secondary)
            );

        const reply = await message.reply({ embeds: [embed], components: [row] });

        const filter = i => i.user.id === userId;
        const collector = reply.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            const classeEscolhida = i.customId.split('_')[1];
            const classeInfo = classes[classeEscolhida];

            player.classe = classeEscolhida.charAt(0).toUpperCase() + classeEscolhida.slice(1);
            
            for (const [attr, bonus] of Object.entries(classeInfo.bonusAtributos)) {
                player.atributos[attr] += bonus;
            }

            await db.set(userId, player);

            const confirmEmbed = new EmbedBuilder()
                .setColor(classeInfo.cor)
                .setTitle(`✅ Classe Escolhida: ${classeInfo.nome}`)
                .setDescription(`Parabéns! Você agora é um **${classeInfo.nome}**!\n\n${classeInfo.descricao}`)
                .addFields(
                    { name: '🎁 Bônus Aplicados', value: Object.entries(classeInfo.bonusAtributos)
                        .map(([attr, val]) => `+${val} ${attr.charAt(0).toUpperCase() + attr.slice(1)}`)
                        .join('\n') },
                    { name: '🎯 Próximos Passos', value: 'Use `!perfil` para ver suas estatísticas atualizadas!\nComece sua jornada com `!caçar` ou explore a `!torre`!' }
                )
                .setFooter({ text: 'Boa sorte em sua jornada, aventureiro!' })
                .setTimestamp();

            await i.update({ embeds: [confirmEmbed], components: [] });
            collector.stop();
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                const timeoutEmbed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('⏰ Tempo Esgotado')
                    .setDescription('Você não escolheu uma classe a tempo. Use `!classe` novamente quando estiver pronto!');
                reply.edit({ embeds: [timeoutEmbed], components: [] }).catch(() => {});
            }
        });
    }
};
