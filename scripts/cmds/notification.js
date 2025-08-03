module.exports = {
  config: {
    name: "noti",
    version: "1.2",
    author: "✨🐾 Knuckles-chan 🐾✨",
    countDown: 5,
    role: 0,
    shortDescription: {
      fr: "Broadcast personnalisé"
    },
    longDescription: {
      fr: "Envoie un message personnalisé dans toutes les discussions où le bot est présent. Réservé au développeur."
    },
    category: "system",
    guide: {
      fr: "{pn} <message>\nExemple : {pn} Coucou tout le monde 💌"
    }
  },

  onStart: async function ({ message, args, api, event }) {
    const ownerID = "61574037590577";
    if (event.senderID !== ownerID)
      return message.reply("⛔ | Seul le développeur peut utiliser cette commande.");

    const content = args.join(" ");
    if (!content)
      return message.reply("⚠️ | Tu dois entrer un message à envoyer.\nEx: .noti Bonjour à tous ✨");

    const threads = await api.getThreadList(50, null, ["INBOX"]);
    let success = 0, failed = 0;

    const formattedMsg = 
`╭── 🎀 𝓜𝓮𝓼𝓼𝓪𝓰𝓮 𝓭𝓾 𝓑𝓸𝓽 ✨🐾 Knuckles-chan 🐾✨ ──╮
${content}
╰────────────────────────────────────╯`;

    for (const thread of threads) {
      try {
        await api.sendMessage(formattedMsg, thread.threadID);
        success++;
      } catch (e) {
        failed++;
      }
    }

    return message.reply(
`📣 | Message envoyé à ${success} discussion(s)
❌ | Échec sur ${failed} discussion(s)`
    );
  }
};
