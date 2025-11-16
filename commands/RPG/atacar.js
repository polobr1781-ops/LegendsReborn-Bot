const { EmbedBuilder } = require('discord.js');
const { db } = require('../../utils/database.js');
const { 
    getBatalha, 
    getJogadorAtual, 
    getOponente, 
    ataqueBasico,
    processarEfeitosDoTurno,
    proximoTurno,
    verificarFimBatalha,
    processarFimBatalha,
    criarEmbedBatalha,
    finalizarBatalha
} = require('../../utils/battleManager.js');

module.exports = {
    data: {
        name: 'atacar',
        aliases: ['attack', 'atk'],
        description: 'Realiza um ataque básico durante uma batalha'
    },
    async execute(message, args) {
        const batalha = getBatalha(message.channel.id);

        if (!batalha) {
            return message.reply('❌ Não há nenhuma batalha ativa neste canal!');
        }

        const jogadorAtual = getJogadorAtual(batalha);

        if (message.author.id !== jogadorAtual.userId) {
            return message.reply('❌ Não é o seu turno!');
        }

        const oponente = getOponente(batalha, jogadorAtual);

        const resultadoAtaque = ataqueBasico(batalha, jogadorAtual, oponente);

        let mensagemCompleta = `⚔️ **Turno ${batalha.turno}**\n\n${resultadoAtaque.mensagem}`;

        const efeitosJogador = processarEfeitosDoTurno(jogadorAtual);
        const efeitosOponente = processarEfeitosDoTurno(oponente);

        if (efeitosJogador.mensagens.length > 0) {
            mensagemCompleta += '\n' + efeitosJogador.mensagens.join('\n');
        }
        if (efeitosOponente.mensagens.length > 0) {
            mensagemCompleta += '\n' + efeitosOponente.mensagens.join('\n');
        }

        proximoTurno(batalha);

        const verificacao = verificarFimBatalha(batalha);

        if (verificacao.fim) {
            finalizarBatalha(message.channel.id);
            const embedFim = await processarFimBatalha(batalha, verificacao);
            return message.channel.send({ embeds: [embedFim] });
        }

        const novoJogador = getJogadorAtual(batalha);
        const embedProximoTurno = criarEmbedBatalha(batalha, mensagemCompleta);

        message.channel.send({ 
            content: `<@${novoJogador.userId}>`, 
            embeds: [embedProximoTurno] 
        });
    }
};
