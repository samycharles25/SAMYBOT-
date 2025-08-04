const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
	config: {
		name: "help",
		version: "1.17",
		author: "samycharles",
		countDown: 5,
		role: 0,
		shortDescription: {
			en: "View command usage and list all commands directly",
		},
		longDescription: {
			en: "View command usage and list all commands directly",
		},
		category: "cmd-list",
		guide: {
			en: "{pn} / help cmdName",
		},
		priority: 1,
	},

	onStart: async function ({ message, args, event, threadsData, role }) {
		const { threadID } = event;
		const prefix = getPrefix(threadID);

		if (args.length === 0) {
			const categories = {};
			let msg = "";

			msg += `╭───────────────🦔✨───────────────╮
 Bienvenue sur 🦔✨ ✘.𝑲𝑵𝑼𝑪𝑲𝑳𝑬𝑺 —シ✨🦔
╰───────────────🦔✨───────────────╯\n`;

			for (const [name, value] of commands) {
				if (value.config.role > 1 && role < value.config.role) continue;
				const category = value.config.category || "Uncategorized";
				if (!categories[category]) categories[category] = [];
				categories[category].push(name);
			}

			for (const [category, cmds] of Object.entries(categories)) {
				msg += `\n📁 ${category.toUpperCase()}:\n`;
				const lines = cmds.sort().map(cmd => `➤ ${cmd}`).join("\n");
				msg += lines + "\n";
			}

			const total = commands.size;
			msg += `\n📌 Total commandes : ${total}`;
			msg += `\n📘 Tape ${prefix}help [nom_commande] pour plus de détails.`;
			msg += `\n📎 Facebook : https://www.facebook.com/SAMYCHARLES2010`;
			msg += `\n❤️ Merci d'utiliser ✘.𝑲𝑵𝑼𝑪𝑲𝑳𝑬𝑺 —シ`;

			// Image jointe à la réponse
			const imgUrl = "https://tiny.one/yckvjykn";
			try {
				const res = await axios.get(imgUrl, { responseType: "stream" });
				return message.reply({
					body: msg,
					attachment: res.data
				});
			} catch (e) {
				return message.reply("✅ Liste des commandes :\n\n" + msg);
			}
		} else {
			const commandName = args[0].toLowerCase();
			const command = commands.get(commandName) || commands.get(aliases.get(commandName));
			if (!command) return message.reply(`❌ Commande "${commandName}" introuvable.`);

			const c = command.config;
			const roleText = convertRole(c.role);
			const usage = c.guide?.en?.replace(/{p}/g, prefix).replace(/{n}/g, c.name) || "Pas de guide dispo.";
			const description = c.longDescription?.en || "Pas de description.";
			const author = c.author || "Inconnu";

			const details = `
🔹 Nom : ${c.name}
🔹 Alias : ${c.aliases?.join(", ") || "Aucun"}
🔹 Catégorie : ${c.category || "Aucune"}
🔹 Auteur : ${author}
🔹 Rôle requis : ${roleText}
🔹 Temps entre usages : ${c.countDown || 1}s
🔹 Description : ${description}
🔹 Utilisation : ${usage}
`;

			await message.reply(details);
		}
	}
};

function convertRole(role) {
	switch (role) {
		case 0: return "0 (Tous les utilisateurs)";
		case 1: return "1 (Admins du groupe)";
		case 2: return "2 (Admins du bot)";
		default: return `${role}`;
	}
            }
