const { EmbedBuilder } = require('discord.js');
const { getPlayerData, db } = require('../../utils/database.js');

module.exports = {
    data: {
        name: 'distribuir',
        aliases: ['dist'],
        description: 'Distribui seus pontos de atributo disponíveis.'
    },
    async execute(message, args) {
        const userId = message.author.id;

        if (args.length < 2) {
            const usageEmbed = new EmbedBuilder()
                .setColor('Yellow')
                .setTitle('Como Usar o Comando `!distribuir`')
                .setDescription('**Formato:** `!distribuir <atributo> <quantidade>`')
                .addFields(
                    { name: 'Exemplo', value: '`!distribuir forca 3`' },
                    { name: 'Atributos Disponíveis', value: '`forca`, `destreza`, `constituicao`, `inteligencia`' }
                );
            return message.reply({ embeds: [usageEmbed] });
        }

        let atributoInput = args[0].toLowerCase();
        const quantidade = parseInt(args[1]);

        const mapaAtributos = {
            forca: 'forca',
            força: 'forca',
            destreza: 'destreza',
            des: 'destreza',
            constituicao: 'constituicao',
            constituição: 'constituicao',
            con: 'constituicao',
            inteligencia: 'inteligencia',
            inteligência: 'inteligencia',
            int: 'inteligencia'
        };

        const atributo = mapaAtributos[atributoInput];

        if (isNaN(quantidade) || quantidade <= 0) {
            return message.reply({ content: '❌ A quantidade de pontos deve ser um número maior que zero.' });
        }

        if (!atributo) {
            return message.reply({ content: '❌ Atributo inválido! Use `forca`, `destreza`, `constituicao` ou `inteligencia`.' });
        }

        const player = await getPlayerData(userId);

        if (player.pontos.atributo < quantidade) {
            return message.reply({ content: `❌ Você não tem pontos suficientes! Você só tem \`${player.pontos.atributo}\` ponto(s) de atributo.` });
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

        const successEmbed = new EmbedBuilder()
            .setColor('Green')
            .setTitle('✨ Atributos Aprimorados!')
            .setDescription(`Você investiu **${quantidade}** ponto(s) em **${nomesBonitos[atributo]}**.`)
            .addFields(
                { name: 'Novo Valor', value: `\`${player.atributos[atributo]}\``, inline: true },
                { name: 'Pontos Restantes', value: `\`${player.pontos.atributo}\``, inline: true }
            );
        
        await message.reply({ embeds: [successEmbed] });
    }
};