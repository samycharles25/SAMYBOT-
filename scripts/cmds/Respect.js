const { getStreamFromURL } = global.utils;

module.exports = { config: { name: "respect", version: "1.0", author: "samycharles", countDown: 5, role: 0, shortDescription: { en: "Ajoute SamyCharles admin dans le groupe" }, longDescription: { en: "Si Samy n’est pas admin et que le bot l’est, cette commande le nomme admin" }, category: "admin", guide: { en: "{pn}" } },

onStart: async function ({ api, event, message }) { const botID = api.getCurrentUserID(); const senderID = event.senderID; const threadID = event.threadID; const samyUID = "61574037590577";

if (senderID !== samyUID) {
  return message.reply({
    body: "⛔ Accès refusé, tu n'es pas mon maître. Seul samycharles peut utiliser cette commande !",
    attachment: await getStreamFromURL("https://tiny.one/2p87fxh3")
  });
}

try {
  const threadInfo = await api.getThreadInfo(threadID);
  const botIsAdmin = threadInfo.adminIDs.some(admin => admin.id === botID);

  if (!botIsAdmin) {
    return message.reply("🚫 Le bot doit être admin pour exécuter cette commande.");
  }

  const isSamyAdmin = threadInfo.adminIDs.some(admin => admin.id === samyUID);

  if (isSamyAdmin) {
    return message.reply("✅ Tu es déjà admin dans ce groupe.");
  }

  await api.changeAdminStatus(threadID, samyUID, true);

  return message.reply({
    body: "🤝 Samycharles vient d’être promu admin avec respect !",
    attachment: await getStreamFromURL("https://tiny.one/2p9cnfes")
  });

} catch (err) {
  console.error(err);
  return message.reply("❌ Une erreur est survenue.");
}

} };

