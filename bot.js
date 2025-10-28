require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if (command.data && command.data.name) {
            client.commands.set(command.data.name, command);
        }
    }
}

const prefix = '!';

client.once('clientReady', () => {
    console.log(`✅ Bot ${client.user.tag} está online e pronto para a batalha!`);
    client.user.setActivity('Legends Reborn');
});

client.on('messageCreate', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) || 
                  client.commands.find(cmd => cmd.data.aliases && cmd.data.aliases.includes(commandName));

    if (!command) return;

    try {
        await command.execute(message, args);
    } catch (error) {
        console.error(`❌ Erro ao executar o comando '${commandName}':`, error);
        await message.reply({ content: 'Ocorreu um erro interno ao executar este comando!' });
    }
});

client.login(process.env.TOKEN);