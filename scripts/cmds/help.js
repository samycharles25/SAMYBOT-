const { getPrefix } = global.utils;
const { commands } = global.GoatBot;
const ytdl = require("ytdl-core"); // Assurez-vous que ytdl-core est installé

module.exports = {
    config: {
        name: "help",
        version: "1.0",
        author: "SAMY MD",
        countDown: 5,
        role: 0,
        category: "informations",
        shortDescription: { fr: "Affiche les infos de l'utilisateur et liste des commandes" },
        guide: { fr: "{pn}" }
    },

    onStart: async function ({ message, args, event, usersData, threadsData }) {
        const { threadID, senderID } = event;
        const prefix = getPrefix(threadID);

        // Récupérer infos utilisateur
        const userData = usersData.get(senderID) || { xp: 0 };
        const XP = userData.xp || 0;

        // Nombre total d'utilisateurs et de groupes
        const totalUsers = usersData.size;
        const totalGroups = threadsData.size;

        // Créer le message help
        let msg = `
🌞 Bonjour @${senderID} 👋

╭─ 「 Informations 」
│ 👤 Nom: SAMY MD
│ 🎖 Niveau: 0 | XP: ${XP}/10000
│ 🔓 Limite: 10
│ 🧭 Mode: Public 🌐
│ ⏱️ Temps actif: 00:33:10
│ 🌍 Utilisateurs enregistrés: ${totalUsers} | Groupes: ${totalGroups}
╰─❒
`;

        // Lister automatiquement les commandes par catégorie
        const categories = {};
        for (const [name, cmd] of commands) {
            if (cmd.config.role > 1) continue; // ignorer les commandes admin si rôle pas suffisant
            const cat = cmd.config.category || "Divers";
            if (!categories[cat]) categories[cat] = [];
            categories[cat].push(name);
        }

        for (const [cat, cmds] of Object.entries(categories)) {
            msg += `\n╭─ 「 ${cat.toUpperCase()} 」\n`;
            msg += cmds.sort().map(c => `│ ◦ ${prefix}${c}`).join("\n");
            msg += `\n╰─❒`;
        }

        // Envoyer le help
        await message.reply(msg);

        // Envoyer ensuite la vidéo YouTube en audio
        const youtubeUrl = "https://youtu.be/Sfv6OmOB1W4?si=43lOiniBV4sjOs6x";
        try {
            const stream = ytdl(youtubeUrl, { filter: "audioonly" });
            await message.reply({
                body: "🎵 Voici la musique que tu as demandée :",
                attachment: stream
            });
        } catch (e) {
            console.log("Erreur lors de la lecture de la vidéo :", e);
            await message.reply("❌ Impossible de lire la vidéo YouTube en audio.");
        }
    }
};
