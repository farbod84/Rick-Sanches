const Discord = require('discord.js');
const dotenv = require('dotenv')
const { REST } =  require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const fs = require('fs')
const { Player } = require('discord-player')

dotenv.config()
const TOKEN = process.env.TOKEN

class Deque {
    constructor() {
        this.front = this.back = undefined;
    }
    addFront(value) {
        if (!this.front) this.front = this.back = { value };
        else this.front = this.front.next = { value, prev: this.front };
    }
    removeFront() {
        let value = this.peekFront();
        if (this.front === this.back) this.front = this.back = undefined;
        else (this.front = this.front.prev).next = undefined;
        return value;
    }
    peekFront() { 
        return this.front && this.front.value;
    }
    addBack(value) {
        if (!this.front) this.front = this.back = { value };
        else this.back = this.back.prev = { value, next: this.back };
    }
    removeBack() {
        let value = this.peekBack();
        if (this.front === this.back) this.front = this.back = undefined;
        else (this.back = this.back.next).back = undefined;
        return value;
    }
    peekBack() { 
        return this.back && this.back.value;
    }
    reset() {
        this.front = this.back = undefined;
    }
}


const LOAD_SLASH = process.argv[2] == 'load'

const CLIENT_ID = '960222885346148362'
const GUILD_ID = '874934536054661141'

const client = new Discord.Client({
    intents: [
        "GUILDS",
        "GUILD_VOICE_STATES"
    ]
})

const prefix = '.';

client.slashcommands = new Discord.Collection();
client.player = new Player(client, {
    ytdlOptions: {
        quality: 'highestaudio',
        highWaterMark: 1 << 25
    }
})
client.commands = new Discord.Collection();

let cmd = []

const slashFiles = fs.readdirSync('./slash').filter(file => file.endsWith('.js'));
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for (const file of slashFiles) {
    const slashcmd = require('./slash/' + file);
    client.slashcommands.set(slashcmd.data.name, slashcmd);
    if (LOAD_SLASH) cmd.push(slashcmd.data.toJSON());
}
for (const file of commandFiles) {
    const command = require('./commands/' + file);

    client.commands.set(command.name, command);
}

if (LOAD_SLASH) {
    const rest = new REST({ version: '9' }).setToken(TOKEN);
    console.log('Deploying slash commands');
    rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {body: cmd})
    .then(() => {
        console.log('Successfully loaded')
        process.exit(0)
    })
    .catch((err) => {
        if (err) {
            console.log(err)
            process.exit(1)
        }
    })
}
else {
    client.on('ready', () => {
        console.log('Rick is online!');

        client.user.setActivity('Prefix: \'.\'', {type: "PLAYING"});
    });
    client.on('interactionCreate', (interaction) => {
        async function handleCommand() {
            if (!interaction.isCommand()) return
            
            const slashcmd = client.slashcommands.get(interaction.commandName)
            if (!slashcmd) interaction.reply('Not a valid slash command')

            await interaction.deferReply()
            await slashcmd.run({ client, interaction })
        }
        handleCommand()
    })
    /*let dq = new Deque

    client.on('messageCreate', message =>{
        if (message.content === '<:dibs:960133368194932807>') {
            message.react('✔️');
            dq.addBack(message.author.toString());
        }
        else if (message.content === 'سختی' || message.content === 'زیبایی') {
            message.react('1️⃣').then(
                () => message.react('2️⃣').then(
                    () => message.react('3️⃣').then(
                        () => message.react('4️⃣').then(
                            () => message.react('5️⃣')
                        )
                    )
                )
            )
        }

        if(!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();

        if (command === 'ping') {
            client.commands.get('ping').execute(message, args);
        }
        else if (command === 'kick') {
            client.commands.get('kick').execute(message, args);
        }
        else if (command === 'ban') {
            client.commands.get('ban').execute(message, args);
        }
    });*/
    client.login(TOKEN)
}
