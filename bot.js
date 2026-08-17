const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

// Sukuriame client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// ✅ KOMANDA: !tell <tekstas>
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  // !tell komanda
  if (message.content.startsWith('!tell')) {
    const text = message.content.slice('!tell'.length).trim();
    
    if (!text) {
      return message.reply('❌ Naudok: `!tell <tavo tekstas>`');
    }

    const embed = new EmbedBuilder()
      .setDescription(text)
      .setColor(0x8A2BE2)
      .setTimestamp();

    await message.channel.send({ embeds: [embed] });
    await message.delete().catch(() => {});
  }

  // !embed komanda
  if (message.content.startsWith('!embed')) {
    const args = message.content.slice('!embed'.length).trim();
    
    if (!args) {
      return message.reply('❌ Naudok: `!embed <pavadinimas> | <tekstas>`');
    }

    const parts = args.split('|');
    const title = parts[0]?.trim() || '📢 Pranešimas';
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

// Bot prisijungė
client.once('ready', () => {
  console.log(`✅ ideaForge botas prisijungęs kaip: ${client.user.tag}`);
  console.log(`📌 Pakviesk botą: https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=274878024768&scope=bot`);
});

// Prisijungiame su token (iš .env arba command line)
const token = process.argv[2] || process.env.DISCORD_TOKEN;

if (!token) {
  console.error('❌ Klaida: Nenurodytas tokenas!');
  console.log('Naudojimas: node bot.js <tavo-tokenas>');
  console.log('Arba: nustatyk DISCORD_TOKEN environment variable');
  process.exit(1);
}

client.login(token);