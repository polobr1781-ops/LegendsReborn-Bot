const { EmbedBuilder } = require('discord.js');
const { getPlayerData, db } = require('../../utils/database.js');
const { habilidades, verificarRequisitos } = require('../../utils/habilidades.js');

module.exports = {
    data: {
        name: 'aprender',
        aliases: ['learn', 'levelup-skill'],
        description: 'Aprende ou melhora uma habilidade usando pontos de habilidade'
    },
    async execute(message, args) {
        const playerData = await getPlayerData(message.author.id);

        if (!playerData.classe) {
            return message.reply('❌ Você precisa escolher uma classe primeiro usando `!classe`!');
        }

        if (!args.length) {
            return message.reply('❌ Use: `!aprender <nome-da-habilidade>`\nExemplo: `!aprender golpe-poderoso`');
        }

        const skillId = args.join('-').toLowerCase();
        const habilidade = habilidades[skillId];

        if (!habilidade) {
            return message.reply('❌ Habilidade não encontrada! Use `!habilidades` para ver as disponíveis.');
        }

        const nivelAtual = playerData.habilidades[skillId] || 0;
        const proximoNivel = nivelAtual + 1;

        const requisitos = verificarRequisitos(habilidade, playerData, proximoNivel);

        if (!requisitos.pode) {
            return message.reply(`❌ ${requisitos.motivo}`);
        }

        const custoNecessario = requisitos.custo;

        playerData.habilidades[skillId] = proximoNivel;
        playerData.pontosHabilidade -= custoNecessario;

        await db.set(message.author.id, playerData);

        const efeitos = habilidade.efeitos(proximoNivel);
        let efeitosTexto = '';
        
        if (efeitos.dano) efeitosTexto += `\n💥 **Dano:** ${efeitos.dano}`;
        if (efeitos.multiplicador) efeitosTexto += `\n⚡ **Multiplicador:** ${efeitos.multiplicador.toFixed(1)}x`;
        if (efeitos.bonusDano) efeitosTexto += `\n🔥 **Bônus de Dano:** +${efeitos.bonusDano}%`;
        if (efeitos.reducaoDano) efeitosTexto += `\n🛡️ **Redução de Dano:** ${efeitos.reducaoDano}%`;
        if (efeitos.bonusHP) efeitosTexto += `\n❤️ **HP Máximo:** +${efeitos.bonusHP}`;
        if (efeitos.bonusMP) efeitosTexto += `\n💙 **MP Máximo:** +${efeitos.bonusMP}`;
        if (efeitos.chance) efeitosTexto += `\n🎲 **Chance:** ${efeitos.chance}%`;
        if (efeitos.sangramento) efeitosTexto += `\n🩸 **Sangramento:** ${efeitos.sangramento}/turno`;
        if (efeitos.veneno) efeitosTexto += `\n☠️ **Veneno:** ${efeitos.veneno}/turno`;
        if (efeitos.absorcao) efeitosTexto += `\n🔰 **Absorção:** ${efeitos.absorcao}`;
        if (efeitos.bonusEsquiva) efeitosTexto += `\n💨 **Esquiva:** +${efeitos.bonusEsquiva}%`;
        if (efeitos.chanceCritico) efeitosTexto += `\n⚡ **Crítico:** +${efeitos.chanceCritico}%`;

        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle(nivelAtual === 0 ? '🌟 Habilidade Desbloqueada!' : '⬆️ Habilidade Melhorada!')
            .setDescription(`**${habilidade.nome}** agora está no nível **${proximoNivel}/${habilidade.nivelMax}**!`)
            .addFields(
                { name: '📖 Descrição', value: habilidade.descricao, inline: false },
                { name: '🔮 Efeitos (Nível ' + proximoNivel + ')', value: efeitosTexto || 'Efeitos especiais aplicados', inline: false },
                { name: '💎 Custo', value: `${custoNecessario} Pontos de Habilidade`, inline: true },
                { name: '⭐ Pontos Restantes', value: `${playerData.pontosHabilidade} PH`, inline: true }
            )
            .setFooter({ text: `Use !habilidades para ver todas as suas skills` });

        message.reply({ embeds: [embed] });
    }
};
