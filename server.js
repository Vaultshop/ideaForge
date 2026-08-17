const express = require('express');
const path = require('path');
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

let client = null;

app.post('/api/login', async (req, res) => {
  const { token } = req.body;
  
  if (!token) {
    return res.status(400).json({ error: 'Tokenas būtinas!' });
  }

  try {
    if (client && client.isReady()) {
      await client.destroy();
    }

    client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });

    client.on('messageCreate', async (message) => {
      if (message.author.bot) return;

      if (message.content.startsWith('!tell')) {
        const text = message.content.slice('!tell'.length).trim();
        if (!text) return message.reply('❌ Naudok: `!tell <tavo tekstas>`');

        const embed = new EmbedBuilder()
          .setDescription(text)
          .setColor(0x8A2BE2)
          .setTimestamp();

        await message.channel.send({ embeds: [embed] });
        await message.delete().catch(() => {});
      }

      if (message.content.startsWith('!embed')) {
        const args = message.content.slice('!embed'.length).trim();
        if (!args) return message.reply('❌ Naudok: `!embed <pavadinimas> | <tekstas>`');

        const parts = args.split('|');
        const title = parts[0]?.trim() || ' Pranešimas';
        const description = parts[1]?.trim() || args;

        const embed = new EmbedBuilder()
          .setTitle(title)
          .setDescription(description)
          .setColor(0x8A2BE2)
          .setTimestamp();

        await message.channel.send({ embeds: [embed] });
        await message.delete().catch(() => {});
      }
    });

    client.once('ready', () => {
      console.log(`✅ ideaForge botas prisijungęs kaip: ${client.user.tag}`);
    });

    await client.login(token);
    res.json({ success: true, message: `Sėkmingai prisijungta kaip ${client.user.tag}` });
    
  } catch (error) {
    console.error('Prisijungimo klaida:', error.message);
    res.status(400).json({ error: 'Neteisingas tokenas arba klaida.' });
  }
});

app.get('/api/status', (req, res) => {
  if (client && client.isReady()) {
    res.json({ status: 'online', user: client.user.tag });
  } else {
    res.json({ status: 'offline' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 Serveris veikia porte ${PORT}`);
});