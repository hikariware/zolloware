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
import { Database } from "quickmongo";

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

export type ThrowBallType = "棒球" | "保齡球" | "乒乓球" | "巧克力球";

declare module "discord.js" {
	interface BaseChannel {
		isTestChannel: () => boolean;
	}

	interface Client {
		/**
		 * 是否在開發模式中運行
		 */
		devMode: boolean;

		/**
		 * 被封鎖的使用者 ID
		 */
		blockedUsers: Set<string>;

		/**
		 * 重要事件的記錄器
		 */
		logger: WebhookLogger;

		/**
		 * 指令管家
		 */
		commands: CommandManager;

		/**
		 * 隱藏指令管家
		 */
		triggers: MessageTriggerManager;

		/**
		 * 自動匹配管家
		 */
		autocomplete: AutocompleteManager;

		/**
		 * 永久按鈕管家
		 */
		buttons: ButtonManager;

		/**
		 * 永久選單管家
		 */
		selectmenus: SelectMenuManager;

		/**
		 * 冷卻系統管家
		 */
		cooldown: CooldownManager;
		
		/**
		 * 用於記錄錯誤回報的 Webhook
		 */
		bugHook: WebhookClient;

		/**
		 * 用於記錄建議回報的 Webhook
		 */
		suggestHook: WebhookClient;

		/**
		 * 用於記錄開發者回覆的 Webhook
		 */
		replyHook: WebhookClient;

		
		db: Database;

		/**
		 * 暫時封鎖一名使用者
		 * @param userId 指定的使用者
		 */
		block(userId: string): void;

		/**
		 * 暫時解封一名使用者
		 * @param userId 指定的使用者
		 */
		unblock(userId: string): void;

		/**
		 * 取得伺服器總數
		 */
		guildCount(): Promise<number>;
		
		/**
		 * 要完整使用 HiZollo 所需的最少量權限
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
