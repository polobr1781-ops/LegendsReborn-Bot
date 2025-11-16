const { EmbedBuilder } = require('discord.js');
const { db } = require('../../utils/database.js');
const { 
    getBatalha, 
    getOponente, 
    finalizarBatalha,
    verificarFimBatalha,
    processarFimBatalha
} = require('../../utils/battleManager.js');

module.exports = {
    data: {
        name: 'desistir',
        aliases: ['surrender', 'forfeit', 'flee'],
        description: 'Desiste da batalha atual'
    },
    async execute(message, args) {
        const batalha = getBatalha(message.channel.id);

        if (!batalha) {
            return message.reply('❌ Você não está em uma batalha!');
        }

        const jogadorAtual = batalha.jogadores.find(j => j.userId === message.author.id);

        if (!jogadorAtual) {
            return message.reply('❌ Você não está participando desta batalha!');
        }

        jogadorAtual.hp = 0;

        const verificacao = verificarFimBatalha(batalha);

        if (verificacao.fim) {
            finalizarBatalha(message.channel.id);
            
            const embedFim = await processarFimBatalha(batalha, verificacao);
            
            embedFim.setColor('#FF0000')
                  .setTitle('🏳️ Desistência!')
                  .setDescription(`**${jogadorAtual.nome}** desistiu da batalha!\n\n${embedFim.data.description}`)
                  .setFooter({ text: 'Nunca desista nos momentos difíceis!' });

            return message.channel.send({ embeds: [embedFim] });
        }
    }
};
