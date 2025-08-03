const { getStreamFromURL } = global.utils;

module.exports = {
  config: {
    name: "slot",
    version: "1.0",
    author: "✨🐾 Knuckles-chan 🐾✨",
    countDown: 5,
    role: 0,
    shortDescription: "🎰 Machine à sous",
    longDescription: {
      fr: "Tente ta chance avec la machine à sous et gagne de l'argent !"
    },
    category: "game",
    guide: {
      fr: "{pn}"
    }
  },

  onStart: async function ({ event, message, usersData }) {
    const userID = event.senderID;

    // Vérifie si le user a réclamé le daily
    const userData = await usersData.get(userID);
    const lastDaily = userData?.data?.lastDaily;
    const today = new Date().toDateString();

    if (lastDaily !== today) {
      return message.reply("⛔ Tu dois d'abord utiliser la commande `.daily` pour jouer au slot !");
    }

    const symbols = ["🍒", "🍋", "🍊", "💎", "🔔"];
    const spin = [
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)]
    ];

    const [a, b, c] = spin;
    let win = 0;
    let resultMsg = "";

    if (a === b && b === c) {
      win = a === "💎" ? 100000 : 10000;
      resultMsg = `🎉 JACKPOT ${a}${b}${c} 🎉\n🏆 Tu gagnes ${win.toLocaleString()} $ !`;
    } else if (a === b || b === c || a === c) {
      win = 2000;
      resultMsg = `😺 Bien joué ! Tu as obtenu deux symboles identiques.\n💰 Tu gagnes ${win.toLocaleString()} $ !`;
    } else {
      resultMsg = "💀 Aïe... aucune correspondance.\n❌ Tu perds cette fois-ci.";
    }

    // Ajout de l'argent si gagné
    if (win > 0) {
      await usersData.addMoney(userID, win);
    }

    const slotResult =
`╭─ 🎰 𝓜𝓪𝓬𝓱𝓲𝓷𝓮 𝓪̀ 𝓼𝓸𝓾𝓼 ─╮
│ ${spin.join(" | ")}
╰────────────────────╯
${resultMsg}`;

    return message.reply(slotResult);
  }
};
