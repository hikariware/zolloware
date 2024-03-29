import "dotenv/config";

if (!process.env.TOKEN) throw new Error("Bot token not configured.");
if (!process.env.MAIN_WEBHOOK_URL) throw new Error("Main webhook url not configured.");
if (!process.env.ERROR_WEBHOOK_URL) throw new Error("Error webhook url not configured.");
if (!process.env.BUG_WEBHOOK_URL) throw new Error("Bug webhook url not configured.");
if (!process.env.SUGGEST_WEBHOOK_URL) throw new Error("Suggest webhook url not configured.");
if (!process.env.REPLY_WEBHOOK_URL) throw new Error("Reply webhook url not configured.");
if (!process.env.NETWORK_WEBHOOK_URL) throw new Error("Network webhook url not configured.");
if (!process.env.MONGODB_CONNECT_URL) throw new Error("Mongo DB url not configured.");

export default {
	bot: {
		prefix: "<>",
		id: Buffer.from(process.env.TOKEN.split(".")[0], "base64").toString("ascii"),
		token: process.env.TOKEN
	},

	webhooks: {
		main: {
			id: process.env.MAIN_WEBHOOK_URL.split("/")[5],
			token: process.env.MAIN_WEBHOOK_URL.split("/")[6]
		},
		error: {
			id: process.env.ERROR_WEBHOOK_URL.split("/")[5],
			token: process.env.ERROR_WEBHOOK_URL.split("/")[6]
		},
		bug: {
			id: process.env.BUG_WEBHOOK_URL.split("/")[5],
			token: process.env.BUG_WEBHOOK_URL.split("/")[6]
		},
		suggest: {
			id: process.env.SUGGEST_WEBHOOK_URL.split("/")[5],
			token: process.env.SUGGEST_WEBHOOK_URL.split("/")[6]
		},
		reply: {
			id: process.env.REPLY_WEBHOOK_URL.split("/")[5],
			token: process.env.REPLY_WEBHOOK_URL.split("/")[6]
		},
		network: {
			id: process.env.NETWORK_WEBHOOK_URL.split("/")[5],
			token: process.env.NETWORK_WEBHOOK_URL.split("/")[6]
		}
	},

	database: {
		key: process.env.MONGODB_CONNECT_URL
	}
};
