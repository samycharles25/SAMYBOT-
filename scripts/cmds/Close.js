const fs = require("fs-extra");
const path = require("path");
const pathData = path.join(__dirname, "closeMode.json");

// Crée le fichier JSON si jamais il n'existe pas
if (!fs.existsSync(pathData)) {
  fs.writeFileSync(pathData, JSON.stringify({ active: false }, null, 2));
}

module.exports = {
  config: {
    name: "close",
    version: "1.0",
    author: "samycharles",
    role: 0,
    shortDescription: {
      fr: "Désactive le bot pour tout le monde sauf toi."
    },
    longDescription: {
      fr: "Cette commande permet de désactiver toutes les réponses du bot sauf pour samycharles."
    },
    category: "🛡️ Contrôle",
    guide: {
      fr: ".close on → Active le mode fermé\n.close off → Désactive"
    }
  },

  onStart: async function ({ message, args, event }) {
    const isOwner = event.senderID === "61574037590577";
    const modeData = JSON.parse(fs.readFileSync(pathData));

    if (!isOwner) {
      return message.reply({
        body: "❌ Accès refusé. Tu n'es pas mon maître.\nSeul samycharles peut utiliser cette commande.",
        attachment: await global.utils.getStreamFromURL("https://tiny.one/2p87fxh3")
      });
    }

    const command = args[0]?.toLowerCase();
    if (command === "on") {
      modeData.active = true;
      fs.writeFileSync(pathData, JSON.stringify(modeData, null, 2));
      return message.reply({
        body: "🔒 Mode fermé activé.\nJe ne répondrai désormais qu'à toi, maître samycharles 🦔✨",
        attachment: await global.utils.getStreamFromURL("https://tiny.one/2p9cnfes")
      });
    } else if (command === "off") {
      modeData.active = false;
      fs.writeFileSync(pathData, JSON.stringify(modeData, null, 2));
      return message.reply("🔓 Mode fermé désactivé. Je peux à nouveau répondre à tout le monde.");
    } else {
      return message.reply("❗ Utilisation : .close on / .close off");
    }
  },

  onChat: async function ({ event }) {
    const modeData = JSON.parse(fs.readFileSync(pathData));
    const isOwner = event.senderID === "61574037590577";

    // Si le mode est activé, on bloque tous sauf samycharles
    if (modeData.active && !isOwner) return;
  }
};
