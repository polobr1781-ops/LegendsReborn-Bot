const { EmbedBuilder } = require('discord.js');
const { getPlayerData, calcularBonusEquipamentos } = require('../../utils/database.js');

module.exports = {
    data: {
        name: 'perfil',
        aliases: ['profile', 'p'],
        description: 'Mostra o perfil completo do seu personagem.'
    },
    async execute(message) {
        const targetUser = message.mentions.users.first() || message.author;
        const player = await getPlayerData(targetUser.id);
        
        const bonus = calcularBonusEquipamentos(player);

        const totalForca = player.atributos.forca + bonus.forca;
        const totalDestreza = player.atributos.destreza + bonus.destreza;
        const totalConstituicao = player.atributos.constituicao + bonus.constituicao;
        const totalInteligencia = player.atributos.inteligencia + bonus.inteligencia;

        const xpAtual = player.xp;
        const xpParaUpar = player.xpParaUpar;
        const porcentagemXP = Math.floor((xpAtual / xpParaUpar) * 100);
        const barraCheia = '🟩';
        const barraVazia = '⬛';
        const tamanhoBarra = 10;
        const blocosCheios = Math.round((porcentagemXP / 100) * tamanhoBarra);
        const blocosVazios = tamanhoBarra - blocosCheios;
        const barraXPVisual = barraCheia.repeat(blocosCheios) + barraVazia.repeat(blocosVazios);
        
        const formatarAtributo = (base, bonus, total) => {
            return `\`${base}\` ${bonus > 0 ? `\`(+${bonus})\`` : ''} = \`${total}\``;
        };

        const perfilEmbed = new EmbedBuilder()
            .setColor(player.cor)
            .setTitle(`📜 PERFIL DE ${targetUser.username}`)
            .setThumbnail(targetUser.displayAvatarURL())
            .addFields(
                { 
                    name: '🔰 Nível e Progressão', 
                    value: `**Nível:** \`${player.level}\`\n**XP:** \`${xpAtual} / ${xpParaUpar}\` (${porcentagemXP}%)\n${barraXPVisual}`
                },
                {
                    name: '📊 Atributos (Base + Bônus = Total)',
                    value: `**💪 Força:** ${formatarAtributo(player.atributos.forca, bonus.forca, totalForca)}\n` +
                           `**🤸 Destreza:** ${formatarAtributo(player.atributos.destreza, bonus.destreza, totalDestreza)}\n` +
                           `**❤️ Constituição:** ${formatarAtributo(player.atributos.constituicao, bonus.constituicao, totalConstituicao)}\n` +
                           `**🧠 Inteligência:** ${formatarAtributo(player.atributos.inteligencia, bonus.inteligencia, totalInteligencia)}`
                },
                {
                    name: '✨ Pontos Disponíveis',
                    value: `**Atributo:** \`${player.pontos.atributo}\``,
                    inline: true
                }
            )
            .setFooter({ text: 'Use !distribuir para usar seus pontos de atributo.' });

        await message.reply({ embeds: [perfilEmbed] });
    }
};