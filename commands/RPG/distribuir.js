const { EmbedBuilder } = require('discord.js');
const { getPlayerData, db, calcularBonusEquipamentos } = require('../../utils/database.js');

module.exports = {
    data: {
        name: 'distribuir',
        aliases: ['dist', 'd', 'atributo'],
        description: 'Distribui seus pontos de atributo disponíveis para melhorar seu personagem.'
    },
    async execute(message, args) {
        const userId = message.author.id;
        const player = await getPlayerData(userId);

        if (args.length < 2) {
            const bonus = calcularBonusEquipamentos(player);
            const usageEmbed = new EmbedBuilder()
                .setColor('#FFD700')
                .setTitle('✨ Como Distribuir Pontos de Atributo')
                .setDescription('**Formato:** `!distribuir <atributo> <quantidade>`')
                .addFields(
                    { name: '📝 Exemplo', value: '`!distribuir forca 3`\n`!distribuir int 5`' },
                    { name: '💪 Atributos Disponíveis', value: '`forca` (FOR), `destreza` (DES), `constituicao` (CON), `inteligencia` (INT)' },
                    { name: '📊 Seus Atributos Atuais', value: 
                        `**Força:** ${player.atributos.forca} (+${bonus.forca})\n` +
                        `**Destreza:** ${player.atributos.destreza} (+${bonus.destreza})\n` +
                        `**Constituição:** ${player.atributos.constituicao} (+${bonus.constituicao})\n` +
                        `**Inteligência:** ${player.atributos.inteligencia} (+${bonus.inteligencia})`
                    },
                    { name: '⭐ Pontos Disponíveis', value: `\`${player.pontos.atributo}\` pontos` }
                )
                .setFooter({ text: 'Dica: Cada atributo afeta diferentes aspectos do combate!' });
            return message.reply({ embeds: [usageEmbed] });
        }

        let atributoInput = args[0].toLowerCase();
        const quantidade = parseInt(args[1]);

        const mapaAtributos = {
            'forca': 'forca', 'força': 'forca', 'for': 'forca', 'str': 'forca',
            'destreza': 'destreza', 'des': 'destreza', 'dex': 'destreza', 'agi': 'destreza',
            'constituicao': 'constituicao', 'constituição': 'constituicao', 'con': 'constituicao', 'vit': 'constituicao',
            'inteligencia': 'inteligencia', 'inteligência': 'inteligencia', 'int': 'inteligencia', 'mag': 'inteligencia'
        };

        const atributo = mapaAtributos[atributoInput];

        if (isNaN(quantidade) || quantidade <= 0) {
            return message.reply('❌ A quantidade de pontos deve ser um número maior que zero!');
        }

        if (!atributo) {
            return message.reply('❌ Atributo inválido! Use: `forca`, `destreza`, `constituicao` ou `inteligencia`.');
        }

        if (player.pontos.atributo < quantidade) {
            return message.reply(`❌ Pontos insuficientes! Você tem apenas \`${player.pontos.atributo}\` ponto(s) disponível(is).`);
        }

        player.pontos.atributo -= quantidade;
        player.atributos[atributo] += quantidade;
        await db.set(userId, player);
        
        const nomesBonitos = {
            forca: '💪 Força',
            destreza: '🤸 Destreza',
            constituicao: '❤️ Constituição',
            inteligencia: '🧠 Inteligência'
        };

        const descricoes = {
            forca: 'Aumenta seu dano físico em combate',
            destreza: 'Melhora sua chance de acerto e esquiva',
            constituicao: 'Aumenta sua vida máxima e resistência',
            inteligencia: 'Potencializa habilidades mágicas'
        };

        const successEmbed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('✨ Atributos Aprimorados!')
            .setDescription(`Você investiu **${quantidade}** ponto(s) em **${nomesBonitos[atributo]}**!`)
            .addFields(
                { name: '📈 Novo Valor', value: `\`${player.atributos[atributo]}\``, inline: true },
                { name: '⭐ Pontos Restantes', value: `\`${player.pontos.atributo}\``, inline: true },
                { name: '💡 Efeito', value: descricoes[atributo] }
            )
            .setFooter({ text: `Use !perfil para ver suas estatísticas completas` })
            .setTimestamp();
        
        await message.reply({ embeds: [successEmbed] });
    }
};
