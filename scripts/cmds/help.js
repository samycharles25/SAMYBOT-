const fs = require("fs");
const path = require("path");
const { getPrefix } = global.utils;

module.exports = {
  config: {
    name: "help",
    version: "2.0",
    author: "✨🐾 Knuckles-chan 🐾✨",
    countDown: 5,
    role: 0,
    description: {
      en: "Voir l'utilisation des commandes"
    },
    category: "info",
    guide: {
      en: "{pn} [commande]"
    }
  },

  langs: {
    en: {
      header:
`╭─ 🎀 𝓜𝓮𝓷𝓾 𝓭𝓮 𝓐𝓲𝓭𝓮 ✨🐾 Knuckles-chan 🐾✨ 🎀 ─╮
┃ 📌 Préfixe : 「{prefix}」 | 🧩 Total : {total} commandes
┃ ❔ Tape {prefix}help <commande> pour + de détails
╰────────────────────────────────────────╯`,

      footer: "🌸 𝓑𝓸𝓽 𝓹𝓪𝓻 ✨🐾 Knuckles-chan 🐾✨ 🌸"
    }
  },

  onStart: async function({ message, args, event, threadsData, getLang, role }) {
    const prefix = getPrefix(event.threadID);
    const commands = Array.from(global.GoatBot.commands.values());

    // Group commands by category with permission filter
    const categories = {};
    for (const cmd of commands) {
      if (cmd.config.role > role) continue;
      const cat = (cmd.config.category || "utility").toLowerCase();
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(cmd.config.name);
    }

    // Emojis and category titles
    const categoryEmojis = {
      game: "🎮",
      admin: "🛡️",
      ia: "🎨",
      media: "🎵",
      utility: "🧰",
      system: "⚙️"
    };
    const categoryNames = {
      game: "𝗝𝗘𝗨𝗫",
      admin: "𝗔𝗗𝗠𝗜𝗡",
      ia: "𝗜𝗔",
      media: "𝗠𝗘𝗗𝗜𝗔",
      utility: "𝗨𝗧𝗜𝗟𝗦",
      system: "𝗦𝗬𝗦𝗧𝗘𝗠𝗘"
    };

    // Build help message string
    let msg = getLang("header")
      .replace(/{prefix}/g, prefix)
      .replace(/{total}/g, commands.length);

    for (const cat of Object.keys(categoryNames)) {
      if (!categories[cat] || categories[cat].length === 0) continue;

      msg += `\n\n╭── ${categoryEmojis[cat]} ${categoryNames[cat]} ──╮\n`;

      categories[cat].sort().forEach(cmdName => {
        msg += `│  ${cmdName}\n`; // Indent for readability
      });

      msg += "╰────────────╯";
    }

    msg += `\n\n${getLang("footer")}`;

    // Attach help image if exists
    const imagePath = path.resolve(__dirname, "../../assets/help_media.jpg");
    const attachment = fs.existsSync(imagePath) ? fs.createReadStream(imagePath) : null;

    return message.reply({ body: msg, attachment });
  }
};
