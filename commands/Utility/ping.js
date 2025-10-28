module.exports = {
    data: {
        name: 'ping',
        aliases: [],
        description: 'Verifica a latência do bot.'
    },
    async execute(message) {
        const latencia = Date.now() - message.createdTimestamp;
        await message.reply(`Pong! 🏓 A latência da mensagem é de ${latencia}ms.`);
    }
};