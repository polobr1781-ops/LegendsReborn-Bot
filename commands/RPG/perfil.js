const { EmbedBuilder } = require('discord.js');
const { getPlayerData, calcularBonusEquipamentos } = require('../../utils/database.js');
const { items } = require('../../utils/items.js');

module.exports = {
    data: {
        name: 'perfil',
        aliases: ['profile', 'p', 'status'],
        description: 'Mostra o perfil completo do seu personagem com estatísticas, atributos e equipamentos.'
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
            if (bonus > 0) {
                return `\`${base}\` + \`${bonus}\` = \`${total}\``;
            }
            return `\`${total}\``;
        };

        const classeTexto = player.classe ? `**${player.classe}**` : '`Não escolhida`';
        const andarTorre = player.torre?.andar || 0;

        const equipamentoTexto = Object.entries(player.equipamento)
            .map(([slot, itemId]) => {
                if (!itemId) return `${slot.charAt(0).toUpperCase() + slot.slice(1)}: \`Vazio\``;
                const item = items[itemId];
                if (!item) return `${slot.charAt(0).toUpperCase() + slot.slice(1)}: \`Erro\``;
                return `${slot.charAt(0).toUpperCase() + slot.slice(1)}: **${item.nome}**`;
            })
            .join('\n');

        const perfilEmbed = new EmbedBuilder()
            .setColor(player.cor)
            .setTitle(`⚔️ PERFIL DE ${targetUser.username.toUpperCase()}`)
            .setThumbnail(targetUser.displayAvatarURL())
            .addFields(
                { 
                    name: '🎭 Classe & Nível', 
                    value: `**Classe:** ${classeTexto}\n**Nível:** \`${player.level}\`\n**Torre:** Andar \`${andarTorre}\``,
                    inline: true
                },
                {
                    name: '💰 Recursos',
                    value: `**Moedas:** \`${player.moeda}\`\n**Pontos:** \`${player.pontos.atributo}\``,
                    inline: true
                },
                { 
                    name: '📊 Progressão de XP', 
                    value: `**XP:** \`${xpAtual} / ${xpParaUpar}\` (${porcentagemXP}%)\n${barraXPVisual}`
                },
                {
                    name: '💪 Atributos (Base + Bônus = Total)',
                    value: `**Força:** ${formatarAtributo(player.atributos.forca, bonus.forca, totalForca)}\n` +
                           `**Destreza:** ${formatarAtributo(player.atributos.destreza, bonus.destreza, totalDestreza)}\n` +
                           `**Constituição:** ${formatarAtributo(player.atributos.constituicao, bonus.constituicao, totalConstituicao)}\n` +
                           `**Inteligência:** ${formatarAtributo(player.atributos.inteligencia, bonus.inteligencia, totalInteligencia)}`
                },
                {
                    name: '🎒 Equipamento Atual',
                    value: equipamentoTexto
                }
            )
            .setFooter({ text: `Use !distribuir para usar seus pontos de atributo. | ${message.author.username}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        if (!player.classe) {
            perfilEmbed.addFields({
                name: '⚠️ Escolha sua Classe!',
                value: 'Use `!classe` para escolher sua classe e desbloquear habilidades especiais!'
            });
        }

        await message.reply({ embeds: [perfilEmbed] });
    }
};
