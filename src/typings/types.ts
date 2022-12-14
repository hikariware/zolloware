import { ApplicationCommandOptionData, ApplicationCommandSubCommandData, ApplicationCommandSubGroupData, PermissionFlags } from "discord.js";
import { AutocompleteManager } from "../classes/AutocompleteManager";
import { ButtonManager } from "../classes/ButtonManager";
import { CommandManager } from "../classes/CommandManager";
import CooldownManager from "../classes/CooldownManager";
import { MessageTriggerManager } from "../classes/MessageTriggerManager";
import { SelectMenuManager } from "../classes/SelectMenuManager";
import { WebhookLogger } from "../classes/WebhookLogger";
import { ArgumentParseType, CommandManagerRejectReason, CommandOptionType } from "./enums";
import {
	CommandParserOptionFailWithChoicesResult,
	CommandParserOptionFailWithLimitResult,
	CommandParserOptionFailWithPureStatusResult,
	CommandParserOptionPassResult,
	PageSystemDescriptionOptions,
	PageSystemEmbedFieldOptions
} from "./interfaces";

export type Intersect<T, U> = { [K in keyof T & keyof U]: T[K] | U[K] };

export type ValueOf<T> = T[keyof T];

export type CommandParserOptionResult =
	| CommandParserOptionPassResult
	| CommandParserOptionFailWithPureStatusResult
	| CommandParserOptionFailWithChoicesResult
	| CommandParserOptionFailWithLimitResult;

export type CommandParserPassResult = { args: unknown[] } & Omit<CommandParserOptionPassResult, "arg">;

export type CommandParserFailResult = { index: number } & Exclude<CommandParserOptionResult, CommandParserOptionPassResult>;

export type CommandParserResult = CommandParserPassResult | CommandParserFailResult;

export type CommandManagerRejectInfo =
	| { reason: CommandManagerRejectReason.TwoFactorRequired; args: [] }
	| {
			reason: CommandManagerRejectReason.BotMissingPermission;
			args: [missings: (keyof PermissionFlags)[]];
	  }
	| {
			reason: CommandManagerRejectReason.UserMissingPermission;
			args: [missings: (keyof PermissionFlags)[]];
	  }
	| { reason: CommandManagerRejectReason.InCooldown; args: [time: number] }
	| {
			reason: CommandManagerRejectReason.IllegalArgument;
			args: [commandName: [string, string | undefined], commandOptions: ExtendedCommandOptionData[], result: CommandParserFailResult];
	  };

export type ExtendedCommandOptionData = Exclude<ApplicationCommandOptionData, ApplicationCommandSubCommandData | ApplicationCommandSubGroupData> & {
	parseAs?: CommandOptionType;
	repeat?: boolean;
};

export type ArgumentParseMethod =
	| { type: ArgumentParseType.None }
	| { type: ArgumentParseType.Split; separator: string }
	| { type: ArgumentParseType.Quote; quotes: [string, string] }
	| { type: ArgumentParseType.Custom; func(s: string): string[] };

export type AutocompleteData = {
	[key: string]: { name: string; devOnly?: boolean }[];
};

export type PageSystemOptions = PageSystemDescriptionOptions | PageSystemEmbedFieldOptions;

export type ThrowBallType = "??????" | "?????????" | "?????????" | "????????????";

declare module "discord.js" {
	interface BaseChannel {
		isTestChannel: () => boolean;
	}

	interface Client {
		/**
		 * ??????????????????????????????
		 */
		devMode: boolean;

		/**
		 * ????????????????????? ID
		 */
		blockedUsers: Set<string>;

		/**
		 * ????????????????????????
		 */
		logger: WebhookLogger;

		/**
		 * ????????????
		 */
		commands: CommandManager;

		/**
		 * ??????????????????
		 */
		triggers: MessageTriggerManager;

		/**
		 * ??????????????????
		 */
		autocomplete: AutocompleteManager;

		/**
		 * ??????????????????
		 */
		buttons: ButtonManager;

		/**
		 * ??????????????????
		 */
		selectmenus: SelectMenuManager;

		/**
		 * ??????????????????
		 */
		cooldown: CooldownManager;
		
		/**
		 * ??????????????????????????? Webhook
		 */
		bugHook: WebhookClient;

		/**
		 * ??????????????????????????? Webhook
		 */
		suggestHook: WebhookClient;

		/**
		 * ?????????????????????????????? Webhook
		 */
		replyHook: WebhookClient;

		/**
		 * ???????????????????????????
		 * @param userId ??????????????????
		 */
		block(userId: string): void;

		/**
		 * ???????????????????????????
		 * @param userId ??????????????????
		 */
		unblock(userId: string): void;

		/**
		 * ?????????????????????
		 */
		guildCount(): Promise<number>;
		
		/**
		 * ??????????????? HiZollo ????????????????????????
		 */
		get invitePermissions(): PermissionsBitField;
	}

	interface EmbedBuilder {
		applySettings: (member: GuildMember | null, authorText: string, footerText?: string) => EmbedBuilder;
		setMemberAuthor: (member: GuildMember | null, authorText: string) => EmbedBuilder;
		setMemberFooter: (member: GuildMember | null, footerText?: string) => EmbedBuilder;
		setUserAuthor: (user: User | null, authorText: string) => EmbedBuilder;
		setUserFooter: (user: User | null, footerText?: string) => EmbedBuilder;
		setConfig: () => EmbedBuilder;
	}

	interface GuildMember {
		tag: string;
	}

	interface User {
		blocked: boolean;
	}
}
