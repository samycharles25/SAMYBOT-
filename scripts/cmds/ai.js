const axios = require('axios');

const API_URL = 'https://messie-flash-api-ia.vercel.app/chat?prompt=';
const API_KEY = 'messie12356osango2025jinWoo';

async function getAIResponse(input) {
    try {
        const response = await axios.get(`${API_URL}${encodeURIComponent(input)}&apiKey=${API_KEY}`, {
            timeout: 10000,
            headers: { 'Accept': 'application/json' }
        });

        if (response.data?.parts?.[0]?.reponse) return response.data.parts[0].reponse;
        if (response.data?.response) return response.data.response;
        return "Désolé, réponse non reconnue de l'API";
    } catch (error) {
        console.error("API Error:", error.response?.status, error.message);
        return "Erreur de connexion au serveur IA";
    }
}

function toGothicStyle(text) {
    const map = {
        A: '𝖠', B: '𝖡', C: '𝖢', D: '𝖣', E: '𝖤', F: '𝖥', G: '𝖦', H: '𝖧',
        I: '𝖨', J: '𝖩', K: '𝖪', L: '𝖫', M: '𝖬', N: '𝖭', O: '𝖮', P: '𝖯',
        Q: '𝖰', R: '𝖱', S: '𝖲', T: '𝖳', U: '𝖴', V: '𝖵', W: '𝖶', X: '𝖷',
        Y: '𝖸', Z: '𝖹',
        a: '𝗮', b: '𝗯', c: '𝗰', d: '𝗱', e: '𝗲', f: '𝗳', g: '𝗴', h: '𝗵',
        i: '𝗶', j: '𝗷', k: '𝗸', l: '𝗹', m: '𝗺', n: '𝗻', o: '𝗼', p: '𝗽',
        q: '𝗾', r: '𝗿', s: '𝘀', t: '𝘁', u: '𝘂', v: '𝘃', w: '𝘄', x: '𝘅',
        y: '𝘆', z: '𝘇'
    };
    return text.split('').map(c => map[c] || c).join('');
}

function formatResponse(content) {
    const styled = toGothicStyle(content);
    return `✨💫 『 ${styled} 』 💫✨\n🌟💬❤️`;
}

module.exports = {
    config: {
        name: 'ai',
        author: 'Messie Osango',
        version: '2.0',
        role: 0,
        category: 'AI',
        shortDescription: 'IA intelligente',
        longDescription: 'Une IA capable de répondre à diverses questions et demandes.',
        keywords: ['ai']
    },
    onStart: async function({ api, event, args }) {
        const input = args.join(' ').trim();
        if (!input) return api.sendMessage(formatResponse("Salut ! Comment puis-je vous aider aujourd'hui ? 😊"), event.threadID);

        try {
            const res = await getAIResponse(input);
            api.sendMessage(formatResponse(res), event.threadID, event.messageID);
        } catch {
            api.sendMessage(formatResponse("Oups, quelque chose n'a pas marché, réessaie s'il te plaît !"), event.threadID);
        }
    },
    onChat: async function({ api, event, message }) {
        const triggers = ['ai'];
        const body = event.body?.toLowerCase() || "";

        // Récupère l'ID du bot (à adapter selon ton API)
        const botID = api.getCurrentUserID ? api.getCurrentUserID() : null;

        // Vérifie si le message est une réponse à un message du bot
        const isReplyToBot = event.message?.reply_to?.senderID === botID;

        // Si le message ne commence pas par un trigger et n'est pas une réponse au bot, ignore
        if (!triggers.some(t => body.startsWith(t)) && !isReplyToBot) return;

        // Récupère le texte à traiter selon contexte
        let input;
        if (isReplyToBot) {
            // C'est une réponse à un message du bot : on prend tout le message
            input = event.body.trim();
        } else {
            // C'est une commande classique, on enlève le trigger 'ai'
            input = body.slice(body.split(' ')[0].length).trim();
        }

        if (!input) return message.reply(formatResponse("✨💫 『 𝗦𝗮𝗹𝘂𝘁 ! 𝗖𝗼𝗺𝗺𝗲𝗻𝘁 𝗽𝘂𝗶𝘀-𝗷𝗲 𝘃𝗼𝘂𝘀 𝗮𝗶𝗱𝗲𝗿 𝗮𝘂𝗷𝗼𝘂𝗿𝗱'𝗵𝘂𝗶 ? 😊 』 💫✨\n🌟💬❤️"));

        try {
            const res = await getAIResponse(input);
            message.reply(formatResponse(res));
        } catch {
            message.reply(formatResponse("✨💫 『 𝗢𝘂𝗽𝘀, 𝗾𝘂𝗲𝗹𝗾𝘂𝗲 𝗰𝗵𝗼𝘀𝗲 𝗻'𝗮 𝗽𝗮𝘀 𝗺𝗮𝗿𝗰𝗵𝗲́, 𝗿𝗲́𝗲𝘀𝘀𝗮𝗶𝗲 𝘀'𝗶𝗹 𝘁𝗲 𝗽𝗹𝗮𝗶̂𝘁 ! 』 💫✨\n🌟💬❤️"));
        }
    }
};
