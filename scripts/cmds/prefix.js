const { config } = global.GoatBot;
const path = require("path");
const fs = require("fs-extra");
const { utils } = global;
const axios = require("axios");

module.exports = {
	config: {
		name: "prefix",
		version: "1.4",
		author: "✨🐾 Knuckles-chan 🐾✨",
		countDown: 5,
		role: 0,
		shortDescription: "Change le préfixe du bot",
		longDescription: {
			fr: "Change le préfixe de ✨🐾 Knuckles-chan 🐾✨ dans ce salon ou globalement (admin uniquement)",
			en: "Change ✨🐾 Knuckles-chan 🐾✨ prefix in this thread or globally (admin only)"
		},
		category: "config",
		guide: {
			fr:
				"{pn} <nouveau prefix>\n"
				+ "Ex : {pn} !\n\n"
				+ "{pn} reset : réinitialiser le prefix à la valeur par défaut\n"
				+ "{pn} <prefix> -g : changer le prefix global (admin uniquement)",
			en:
				"{pn} <new prefix>\n"
				+ "Ex: {pn} !\n\n"
				+ "{pn} reset : reset prefix to default\n"
				+ "{pn} <prefix> -g : change global prefix (admin only)"
		}
	},

	langs: {
		fr: {
			reset: "🔄 Ton prefix a été réinitialisé à : 『%1』",
			onlyAdmin: "❌ Seuls les administrateurs peuvent changer le prefix global.",
			confirmGlobal: "⚠️ Réagis à ce message pour confirmer le changement de prefix global.",
			confirmThisThread: "⚠️ Réagis à ce message pour confirmer le changement de prefix ici.",
			successGlobal: "🌐 Prefix global changé avec succès : 『%1』",
			successThisThread: "📍 Prefix de ce salon changé avec succès : 『%1』",
			myPrefix:
`╭─────────────·🎀·─────────────╮
  🧸 𝓦𝓮𝓵𝓬𝓸𝓶𝓮 𝓽𝓸 ✨🐾 Knuckles-chan 🐾✨

  🛡️ Prefix global : 『%1』
  💌 Prefix de ce groupe : 『%2』

  ➤ Utilise %2help pour voir les commandes !
╰─────────────·🎀·─────────────╯`
		},
		en: {
			reset: "🔄 Your prefix has been reset to: 『%1』",
			onlyAdmin: "❌ Only bot admins can change the global prefix.",
			confirmGlobal: "⚠️ React to this message to confirm global prefix change.",
			confirmThisThread: "⚠️ React to this message to confirm prefix change in this thread.",
			successGlobal: "🌐 Global prefix successfully changed to: 『%1』",
			successThisThread: "📍 Thread prefix successfully changed to: 『%1』",
			myPrefix:
`╭─────────────·🎀·─────────────╮
  🧸 Welcome to ✨🐾 Knuckles-chan 🐾✨

  🛡️ System Prefix: 『%1』
  💌 Group Prefix:  『%2』

  ➤ Use %2help to explore all commands!
╰─────────────·🎀·─────────────╯`
		}
	},

	onStart: async function ({ message, role, args, commandName, event, threadsData, getLang }) {
		if (!args[0]) return message.SyntaxError();

		if (args[0] === "reset") {
			await threadsData.set(event.threadID, null, "data.prefix");
			return message.reply(getLang("reset", config.prefix));
		}

		if (args[0] === "file") {
			const isAdmin = config.adminBot.includes(event.senderID);
			if (!isAdmin) return message.reply("❌ Admin only.");
			const fileUrl = event.messageReply?.attachments?.[0]?.url;
			if (!fileUrl) return message.reply("❌ No file attached.");

			const folderPath = 'scripts/cmds/prefix';
			await fs.ensureDir(folderPath);
			const files = await fs.readdir(folderPath);
			for (const file of files) await fs.unlink(path.join(folderPath, file));

			const res = await axios.get(fileUrl, { responseType: "arraybuffer" });
			const type = res.headers['content-type'];

			let ext = type.includes("image") ? "jpg" :
				type.includes("video") ? "mp4" :
				type.includes("gif") ? "gif" : null;

			if (!ext) return message.reply("❌ Invalid file type.");

			fs.writeFileSync(path.join(folderPath, `media.${ext}`), res.data);
			return message.reply("✅ File saved.");
		}

		if (args[0] === "clear") {
			const isAdmin = config.adminBot.includes(event.senderID);
			if (!isAdmin) return message.reply("❌ Admin only.");
			const folderPath = 'scripts/cmds/prefix';
			if (fs.existsSync(folderPath)) {
				const files = await fs.readdir(folderPath);
				for (const file of files) await fs.unlink(path.join(folderPath, file));
				return message.reply("✅ Folder cleared.");
			}
			return message.reply("❌ Folder does not exist.");
		}

		const newPrefix = args[0];
		const formSet = {
			commandName,
			author: event.senderID,
			newPrefix,
			setGlobal: args[1] === "-g",
		};

		if (formSet.setGlobal && role < 2) return message.reply(getLang("onlyAdmin"));

		return message.reply(
			formSet.setGlobal ? getLang("confirmGlobal") : getLang("confirmThisThread"),
			(err, info) => {
				formSet.messageID = info.messageID;
				global.GoatBot.onReaction.set(info.messageID, formSet);
			}
		);
	},

	onReaction: async function ({ message, threadsData, event, Reaction, getLang }) {
		const { author, newPrefix, setGlobal } = Reaction;
		if (event.userID !== author) return;
		if (setGlobal) {
			global.GoatBot.config.prefix = newPrefix;
			fs.writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
			return message.reply(getLang("successGlobal", newPrefix));
		}
		await threadsData.set(event.threadID, newPrefix, "data.prefix");
		return message.reply(getLang("successThisThread", newPrefix));
	},

	onChat: async function ({ event, message, getLang }) {
		const folderPath = 'scripts/cmds/prefix';
		await fs.ensureDir(folderPath);
		const files = await fs.readdir(folderPath);
		const attachments = files.map(file => fs.createReadStream(path.join(folderPath, file)));

		if (["bot", "prefix"].includes(event.body?.toLowerCase()?.trim())) {
			return () => {
				return message.reply({
					body: getLang("myPrefix", config.prefix, utils.getPrefix(event.threadID)),
					attachment: attachments
				});
			};
		}
	}
};
