import {Client} from 'discord.js'
import * as dotenv from 'dotenv'

dotenv.config()
const client = new Client({intents: ['Guilds', 'GuildMessages']});
const TOKEN = process.env.TOKEN;

client.login(TOKEN)
