require('dotenv').config();

const fs = require('fs');
const path = require('path');

const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  EmbedBuilder,
  MessageFlags
} = require('discord.js');

const {
  joinVoiceChannel,
  VoiceConnectionStatus,
  entersState
} = require('@discordjs/voice');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// =======================
// ⚙️ CONFIG
// =======================
const CHANNEL_ID = '1488135944371572866';
const AUTO_VC_ID = '1488854856633680083';

const PANEL_TITLE = 'BETLEHEM ROLE GAMING';
const PANEL_MESSAGE_FILE = path.join(__dirname, 'panel.json');

const rolesMap = {
  among: '1488434644016959571',
  aov: '1488434719975669811',
  apexm: '1488434903732195418',
  ff: '1488435095814803486',
  gi: '1488435159198859304',
  lolm: '1488435269081239623',
  ml: '1488435375725740172',
  roblox: '1488435629011374120',
  pubgm: '1488435756350308443',
  sausage: '1488435820560912434',
  supers: '1488441075680153680',
  stumble: '1488435872826130593',
  hok: '1488436005139644426',
  codm: '1488435039275319356',
  apexl: '1488432911290994769',
  cs2: '1488433170876600360',
  dota2: '1488433456252850297',
  ft: '1488433517049417728',
  gtav: '1488433623588802630',
  lolpc: '1488433735966920734',
  mc: '1488433861905092668',
  pb: '1488434230143881398',
  pubg: '1488434320308965546',
  r6: '1488434488064086117',
  vl: '1488434562114785371'
};

// =======================
// 🔥 AUTO JOIN + AUTO REJOIN VC
// =======================
async function connectToVC() {
  try {
    const vc = await client.channels.fetch(AUTO_VC_ID).catch(() => null);
    if (!vc) return console.log('❌ VC tidak ditemukan');

    const connection = joinVoiceChannel({
      channelId: vc.id,
      guildId: vc.guild.id,
      adapterCreator: vc.guild.voiceAdapterCreator,
      selfDeaf: false
    });

    console.log('🎤 Bot masuk voice channel');

    connection.on(VoiceConnectionStatus.Disconnected, async () => {
      try {
        await Promise.race([
          entersState(connection, VoiceConnectionStatus.Signalling, 5000),
          entersState(connection, VoiceConnectionStatus.Connecting, 5000)
        ]);
      } catch {
        console.log('🔄 Bot keluar VC, rejoin...');
        try { connection.destroy(); } catch {}
        setTimeout(connectToVC, 3000);
      }
    });
  } catch (err) {
    console.log('❌ Error join VC:', err);
    setTimeout(connectToVC, 5000);
  }
}

// =======================
// 📦 PANEL (TIDAK NYAMPAH)
// =======================
function loadPanelId() {
  try {
    return JSON.parse(fs.readFileSync(PANEL_MESSAGE_FILE, 'utf8')).messageId || null;
  } catch {
    return null;
  }
}

function savePanelId(id) {
  try {
    fs.writeFileSync(PANEL_MESSAGE_FILE, JSON.stringify({ messageId: id }));
  } catch (err) {
    console.log('⚠️ Gagal simpan panel.json:', err.message);
  }
}

function buildMenus() {
  const mobile1 = new StringSelectMenuBuilder()
    .setCustomId('mobile1')
    .setPlaceholder('📱 Mobile Games (1)')
    .addOptions([
      { label: 'Among Us', value: 'among', emoji: { id: '1488232855724101853' } },
      { label: 'AOV', value: 'aov', emoji: { id: '1488232953292001452' } },
      { label: 'Apex Mobile', value: 'apexm', emoji: { id: '1488233017087492167' } },
      { label: 'Free Fire', value: 'ff', emoji: { id: '1488233144732876820' } },
      { label: 'Genshin', value: 'gi', emoji: { id: '1488233389638156391' } },
      { label: 'League Mobile', value: 'lolm', emoji: { id: '1488233476292608171' } },
      { label: 'Mobile Legends', value: 'ml', emoji: { id: '1488225517113966673' } }
    ]);

  const mobile2 = new StringSelectMenuBuilder()
    .setCustomId('mobile2')
    .setPlaceholder('📱 Mobile Games (2)')
    .addOptions([
      { label: 'Roblox', value: 'roblox', emoji: { id: '1489081406406525121' } },
      { label: 'PUBG Mobile', value: 'pubgm', emoji: { id: '1488233818153418824' } },
      { label: 'Sausage Man', value: 'sausage', emoji: { id: '1488233909241118721' } },
      { label: 'Super Sus', value: 'supers', emoji: { id: '1488233979168559257' } },
      { label: 'Stumble Guys', value: 'stumble', emoji: { id: '1488234053906989126' } },
      { label: 'Honor of Kings', value: 'hok', emoji: { id: '1488234145787154653' } },
      { label: 'COD Mobile', value: 'codm', emoji: { id: '1488233107642515496' } }
    ]);

  const pc = new StringSelectMenuBuilder()
    .setCustomId('pc')
    .setPlaceholder('💻 PC Games')
    .addOptions([
      { label: 'Apex Legends', value: 'apexl', emoji: { id: '1488234574109610096' } },
      { label: 'CS2', value: 'cs2', emoji: { id: '1488229246441754744' } },
      { label: 'Dota 2', value: 'dota2', emoji: { id: '1488225450865066064' } },
      { label: 'Fortnite', value: 'ft', emoji: { id: '1488229574780391434' } },
      { label: 'GTA V', value: 'gtav', emoji: { id: '1488229820977516666' } },
      { label: 'League PC', value: 'lolpc', emoji: { id: '1488230038808821851' } },
      { label: 'Minecraft', value: 'mc', emoji: { id: '1488230360260284488' } },
      { label: 'Point Blank', value: 'pb', emoji: { id: '1488230516355240037' } },
      { label: 'PUBG PC', value: 'pubg', emoji: { id: '1488230934602973325' } },
      { label: 'R6', value: 'r6', emoji: { id: '1488231298135752748' } },
      { label: 'Valorant', value: 'vl', emoji: { id: '1488225389724700724' } }
    ]);

  return [
    new ActionRowBuilder().addComponents(mobile1),
    new ActionRowBuilder().addComponents(mobile2),
    new ActionRowBuilder().addComponents(pc)
  ];
}

async function sendOrUpdatePanel() {
  const channel = await client.channels.fetch(CHANNEL_ID).catch(() => null);
  if (!channel) return console.log('❌ Channel tidak ditemukan');

  const savedId = loadPanelId();

  // Cari semua panel milik bot di channel (tidak bergantung ke panel.json saja)
  const recent = await channel.messages.fetch({ limit: 100 }).catch(() => null);
  const panels = recent
    ? [...recent.filter(m =>
        m.author.id === client.user.id &&
        m.embeds[0]?.title === PANEL_TITLE
      ).values()] // urut terbaru dulu
    : [];

  let panelMsg = panels.find(m => m.id === savedId) || panels[0] || null;

  if (!panelMsg && savedId) {
    panelMsg = await channel.messages.fetch(savedId).catch(() => null);
  }

  // Hapus panel duplikat yang numpuk
  for (const m of panels) {
    if (m.id === panelMsg?.id) continue;
    await m.delete().catch(() => {});
    console.log(`🧹 Hapus panel duplikat ${m.id}`);
  }

  const embed = new EmbedBuilder()
    .setColor('#FFD700')
    .setAuthor({
      name: 'BETLEHEM',
      iconURL: 'https://media.discordapp.net/attachments/1487590787284734143/1492050545219862598/bthl.png'
    })
    .setTitle(PANEL_TITLE)
    .setDescription('✨ Pilih role game kamu di dropdown bawah 🔥')
    .setImage('https://media.discordapp.net/attachments/1487590787284734143/1492050006507651173/Black_and_White_Grunge_Gaming_Youtube_Banner.png')
    .setFooter({
      text: 'Copyright ©2018 - BTHL | BETLEHEM Role',
      iconURL: channel.guild.iconURL() || undefined
    })
    .setTimestamp();

  const components = buildMenus();

  if (panelMsg) {
    try {
      await panelMsg.edit({ embeds: [embed], components });
      savePanelId(panelMsg.id);
      console.log('♻️ Panel di-update');
      return;
    } catch {
      console.log('⚠️ Gagal edit panel, kirim ulang');
      await panelMsg.delete().catch(() => {});
    }
  }

  const msg = await channel.send({ embeds: [embed], components });
  savePanelId(msg.id);
  console.log('✅ Panel dikirim');
}

// =======================
// 🚀 READY
// =======================
client.once('ready', async () => {
  console.log(`✅ Login sebagai ${client.user.tag}`);

  setTimeout(connectToVC, 3000);

  try {
    await sendOrUpdatePanel();
  } catch (err) {
    console.log('❌ Error setup panel:', err);
  }
});

// =======================
// 🎮 ROLE SYSTEM
// =======================
client.on('interactionCreate', async interaction => {
  if (!interaction.isStringSelectMenu()) return;
  if (!['mobile1', 'mobile2', 'pc'].includes(interaction.customId)) return;

  // reset dropdown ke placeholder supaya game yang sama bisa dipilih ulang
  interaction.message.edit({ components: buildMenus() }).catch(() => {});

  const member = interaction.member;
  const added = [];
  const removed = [];

  for (const val of interaction.values) {
    const roleId = rolesMap[val];
    if (!roleId) continue;

    try {
      if (member.roles.cache.has(roleId)) {
        await member.roles.remove(roleId);
        removed.push(`<@&${roleId}>`);
      } else {
        await member.roles.add(roleId);
        added.push(`<@&${roleId}>`);
      }
    } catch (err) {
      console.log('❌ Gagal ubah role:', err.message);
    }
  }

  let desc = '';
  if (added.length) desc += `✅ **Added:** ${added.join(', ')}\n`;
  if (removed.length) desc += `❌ **Removed:** ${removed.join(', ')}`;
  if (!desc) desc = '⚠️ Gagal mengubah role, hubungi ADMIN.';

  await interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setColor('#57F287')
        .setTitle('Role Updated')
        .setDescription(desc)
        .setFooter({ text: 'BETLEHEM • Role System' })
    ],
    flags: MessageFlags.Ephemeral
  }).catch(() => {});
});

// =======================
// 🛡️ ANTI CRASH
// =======================
process.on('unhandledRejection', err => console.log('Unhandled Rejection:', err));
process.on('uncaughtException', err => console.log('Uncaught Exception:', err));

client.login(process.env.TOKEN);
