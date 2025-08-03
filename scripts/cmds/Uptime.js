module.exports = {
  config: {
    name: "uptime",
    version: "1.0",
    author: "✨🐾 Knuckles-chan 🐾✨",
    countDown: 5,
    role: 0,
    shortDescription: {
      fr: "Affiche le temps de fonctionnement du bot",
      en: "Show bot uptime"
    },
    longDescription: {
      fr: "Affiche depuis combien de temps ✨🐾 Knuckles-chan 🐾✨ est en ligne",
      en: "Displays how long ✨🐾 Knuckles-chan 🐾✨ has been running"
    },
    category: "info",
    guide: {
      fr: "{pn}",
      en: "{pn}"
    }
  },

  langs: {
    fr: {
      uptime: 
`╭────── ⋆⋅☆⋅⋆ ──────╮
💖 𝓤𝓹𝓽𝓲𝓶𝓮 𝓭𝓮 ✨🐾 Knuckles-chan 🐾✨
⏳ 𝓣𝓮𝓶𝓹𝓼 𝓭𝓮 𝓯𝓸𝓷𝓬𝓽𝓲𝓸𝓷𝓷𝓮𝓶𝓮𝓷𝓽 : %1
╰────── ⋆⋅☆⋅⋆ ──────╯`
    },
    en: {
      uptime: 
`╭────── ⋆⋅★⋅⋆ ──────╮
💖 𝓤𝓹𝓽𝓲𝓶𝓮 𝓸𝓯 ✨🐾 Knuckles-chan 🐾✨
⏳ 𝓡𝓾𝓷𝓷𝓲𝓷𝓰 𝓽𝓲𝓶𝓮: %1
╰────── ⋆⋅★⋅⋆ ──────╯`
    }
  },

  onStart: async function ({ message, getLang }) {
    const seconds = process.uptime();
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const time = `${d}j ${h}h ${m}m ${s}s`;

    message.reply(getLang("uptime", time));
  }
};
