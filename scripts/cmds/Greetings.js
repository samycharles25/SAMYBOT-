const axios = require("axios");

module.exports = {
  config: {
    name: "greetings",
    version: "1.0",
    author: "✨🐾 Knuckles-chan 🐾✨",
    countDown: 2,
    role: 0,
    shortDescription: "Répond automatiquement à Bonjour, Salut, Yo, Bonsoir",
    longDescription: {
      fr: "Le bot répond automatiquement quand quelqu’un dit Bonjour, Salut, Yo ou Bonsoir.",
      en: "Bot replies automatically when someone says Hello, Yo, Hi or Good evening."
    },
    category: "auto-response"
  },

  // 🛠️ Ajout de onStart vide pour que l'installation fonctionne
  onStart: async function () {},

  onChat: async function ({ event, message }) {
    const body = event.body?.toLowerCase().trim();

    const matches = {
      "bonjour": "https://tiny.one/5n8wjytp",
      "salut": "https://tiny.one/5n8wjytp",
      "yo": "https://tiny.one/5n8wjytp",
      "bonsoir": "https://tiny.one/bdrbp77d"
    };

    if (!matches[body]) return;

    try {
      const res = await axios.get(matches[body], { responseType: "stream" });
      return message.reply({
        body: `💬 ${body.charAt(0).toUpperCase() + body.slice(1)} à toi aussi !`,
        attachment: res.data
      });
    } catch (e) {
      return message.reply("❌ Erreur lors du chargement de l'image.");
    }
  }
};
