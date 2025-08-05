import { Message } from "discord.js";
import { MessageTrigger } from "../classes/MessageTrigger";

export default class Random extends MessageTrigger {
	constructor() {
		super("random");
	}

	public filter(message: Message): boolean {
		return message.content === "hi";
	}

	public execute(message: Message): boolean {
		message.reply("hi");
		return true;
	}
}
