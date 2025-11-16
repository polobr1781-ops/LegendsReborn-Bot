const { EmbedBuilder } = require('discord.js');
const { getPlayerData, db } = require('../../utils/database.js');
const { criarBatalha, criarEmbedBatalha, getJogadorAtual } = require('../../utils/battleManager.js');

module.exports = {
    data: {
        name: 'duelo',
        aliases: ['duel', 'pvp'],
        description: 'Desafia outro jogador para um combate PvP por turnos'
    },
    async execute(message, args) {
        const desafiante = message.author;
        const playerData1 = await getPlayerData(desafiante.id);

        if (!playerData1.classe) {
            return message.reply('❌ Você precisa escolher uma classe antes de duelar! Use `!classe`');
        }

        if (playerData1.level < 5) {
            return message.reply('❌ Você precisa ser pelo menos nível 5 para participar de duelos!');
        }

        const mencionado = message.mentions.users.first();
        if (!mencionado) {
            return message.reply('❌ Você precisa mencionar um jogador para desafiar!\nUso: `!duelo @jogador`');
        }

        if (mencionado.id === desafiante.id) {
            return message.reply('❌ Você não pode duelar consigo mesmo!');
        }

        if (mencionado.bot) {
            return message.reply('❌ Você não pode duelar com bots!');
        }

        const playerData2 = await getPlayerData(mencionado.id);

        if (!playerData2.classe) {
            return message.reply('❌ O jogador mencionado precisa escolher uma classe primeiro!');
        }

        if (playerData2.level < 5) {
            return message.reply('❌ O jogador mencionado precisa ser pelo menos nível 5 para duelar!');
        }

        const embedConvite = new EmbedBuilder()
            .setColor('#FF4500')
            .setTitle('⚔️ Desafio de Duelo!')
            .setDescription(`${desafiante} desafiou ${mencionado} para um duelo PvP!`)
            .addFields(
                { 
                    name: `${desafiante.username} (${playerData1.classe})`, 
                    value: `Nível ${playerData1.level}`, 
                    inline: true 
                },
                { 
                    name: `${mencionado.username} (${playerData2.classe})`, 
                    value: `Nível ${playerData2.level}`, 
                    inline: true 
                }
            )
            .setFooter({ text: `${mencionado.username}, digite !aceitar para começar o duelo ou !recusar para recusar` });

        const conviteMsg = await message.reply({ content: `${mencionado}`, embeds: [embedConvite] });

        const filter = (m) => m.author.id === mencionado.id && (m.content.toLowerCase() === '!aceitar' || m.content.toLowerCase() === '!recusar');
        
        try {
            const collected = await message.channel.awaitMessages({ 
                filter, 
                max: 1, 
                time: 60000, 
                errors: ['time'] 
            });

            const resposta = collected.first();

            if (resposta.content.toLowerCase() === '!recusar') {
                return message.channel.send(`❌ ${mencionado.username} recusou o desafio!`);
            }

            const batalha = criarBatalha(
                message.channel.id,
                desafiante,
                mencionado,
                playerData1,
                playerData2
            );

            const embedInicio = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('⚔️ Duelo Iniciado!')
                .setDescription(`A batalha entre **${desafiante.username}** e **${mencionado.username}** começou!`)
                .addFields(
                    { name: '📜 Regras', value: 'Turnos de 60 segundos\nUse `!atacar`, `!usar <habilidade>` ou `!item <item>`\nVence quem reduzir o HP do oponente a 0!', inline: false }
                );

            await message.channel.send({ embeds: [embedInicio] });

            const jogadorInicial = getJogadorAtual(batalha);
            const embedTurno = criarEmbedBatalha(batalha);
            
            await message.channel.send({ 
                content: `<@${jogadorInicial.userId}>`, 
                embeds: [embedTurno] 
            });

        } catch (error) {
            return message.channel.send('❌ Tempo esgotado! O duelo foi cancelado.');
        }
    }
};
