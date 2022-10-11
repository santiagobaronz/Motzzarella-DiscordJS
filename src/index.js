const dotenv = require('dotenv');
const { DisTube } = require('distube')
const { Client, Intents, DiscordAPIError, Collection } = require('discord.js');
const client = new Client({
	intents: [
	"Guilds",
	"GuildMessages",
	"GuildVoiceStates",
	"MessageContent"
	]
})

client.DisTube = new DisTube(client, {
	leaveOnStop: false,
	emitNewSongOnly: true,
	emitAddSongWhenCreatingQueue: false,
	emitAddListWhenCreatingQueue: false
})

const config = require('../config.json')
const fs = require('fs');

client.config = require('../config.json');
client.commands = new Collection();
client.aliases = new Collection();
client.emotes = config.emoji;

/***************************************************************
 *                     Bot status 
***************************************************************/

client.on('ready', () => {
	console.log(`${client.user.tag} is ready to play music.`)
})

/***************************************************************
 *                     Play music 
***************************************************************/

client.on('messageCreate', async message => {
	if (message.author.bot || !message.guild) return
	const prefix = config.prefix
	if (!message.content.startsWith(prefix)) return
	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();

	if(command === "play"){
		if(args == ""){
			message.channel.send(`❌ El comando no puede estar vacío`)
		}else{
			if (!message.member.voice.channel) {
				return message.channel.send(`❌ Debes estar conectado a un canal`)
			}else{
				client.DisTube.play(message.member.voice.channel, args.join(" "), {
					member: message.member,
					textChannel: message.channel,
					message
				})
			}
		}
	}
});

client.DisTube.on("playSong", (queue, song) => {
	queue.textChannel.send(`🎵 Esta sonando: | ${song.name} | \n\n ▶ URL del video: (${song.url})`);
})

client.DisTube.on("addSong", (queue, song) => queue.textChannel.send(
    `La canción ${song.name} - se agregó a la cola de reproducción.`
));


/***************************************************************
 *                 Pause and resume music 
***************************************************************/


client.on('messageCreate', (message) => {
    if (!message.content.startsWith(config.prefix)) return;
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift();
    if (command === "stop") {
        client.DisTube.pause(message);
        message.channel.send(`☑️ La canción se ha pausado`);
    }
});

client.on('messageCreate', (message) => {
    if (!message.content.startsWith(config.prefix)) return;
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift();
    if (command === "continue") {
        client.DisTube.resume(message);
        message.channel.send(`☑️ La canción se ha resumido`);
    }
});

/***************************************************************
 *                     Skip music 
***************************************************************/

client.on('messageCreate', (message) => {
    if (!message.content.startsWith(config.prefix)) return;
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift();
    if (command == "skip"){
		client.DisTube.skip(message);
		message.channel.send(`Se ha pasado a la siguiente canción`);
	}
});

/***************************************************************
 *                     Connection 
***************************************************************/

dotenv.config()
const TOKEN = process.env.TOKEN;
client.login(TOKEN)
