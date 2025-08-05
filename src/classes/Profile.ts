import { Database } from "quickmongo";
import config from "@root/config";

const UserSchema = {
	coin: 2000,
	bank: 5000,
	bankLimit: 20000,
	crystal: 5,
	signLastTimestamp: -1,
	signCombo: -1,
	signCount: -1,
	signFailedCount: -1,
	xp: {
		xp: 0,
		max: 0,
		level: -1
	}
} satisfies UserSchema;

const GuildSchema = {} satisfies GuildSchema;

interface UserSchema {
	coin: number;
	bank: number;
	bankLimit: number;
	crystal: number;
	signLastTimestamp: number;
	signCombo: number;
	signCount: number;
	signFailedCount: number;
	xp: {
		xp: number;
		max: number;
		level: number;
	};
}

interface GuildSchema {}

export const db = new Database(config.database.key, {
	collectionName: "zolloware"
});

export class Profile<T extends { [key: string]: any } = { [key: string]: any }> {
	__id: string;
	__prefix: string;
	__schema: T;

	[key: string]: any;

	constructor(id: string, prefix: string, schema: T) {
		this.__id = id;
		this.__schema = schema;
		this.__prefix = `${prefix}:`;
	}

	public async init() {
		const data = (await db.get(`${this.__prefix}${this.__id}`)) ?? -1;
		if (data == -1) return this;
		for (const [key, value] of Object.entries(data)) {
			this[key] = value;
		}
		return this;
	}

	public async check(): Promise<boolean> {
		return (await db.get(`${this.__prefix}${this.__id}`)) ? true : false;
	}

	public async checkAndUpdate(): Promise<true> {
		if (!(await this.check())) {
			await this.newSchema();
		}
		this.updateSchema();
		return true;
	}

	public get db() {
		return db;
	}

	public async newSchema() {
		if (!this.__schema) return false;
		if (this.__schema.__no) return false;
		Object.assign(this, this.__schema);
		return void this.save();
	}

	public async updateSchema() {
		if (!this.__schema) return false;
		if (this.__schema.__no) return false;
		let raw = this.raw;
		Object.assign(this, this.__schema, raw);
		return this.save();
	}

	public async save() {
		await db.set(`${this.__prefix}${this.__id}`, this.raw)
		return this;
	}

	public get raw() {
		const data = JSON.parse(JSON.stringify(this));
		delete data["__id"];
		delete data["__schema"];
		delete data["__prefix"];
		return data;
	}
}

export async function GuildProfile(id: any): Promise<Profile<UserSchema> & { [K in keyof GuildSchema]: GuildSchema[K] }> {
	return (await new Profile<GuildSchema>(id?.source?.guild?.id ?? id?.guild?.id ?? id, "guild", GuildSchema).init()) as unknown as Profile<UserSchema> & {
		[K in keyof GuildSchema]: GuildSchema[K];
	};
}

export async function UserProfile(id: any): Promise<Profile<UserSchema> & { [K in keyof UserSchema]: UserSchema[K] }> {
	return (await new Profile<UserSchema>(
		id?.source?.member?.user?.id ?? id?.author?.id ?? id?.user?.id ?? id,
		"user",
		UserSchema
	).init()) as unknown as Profile<UserSchema> & {
		[K in keyof UserSchema]: UserSchema[K];
	};
}
export async function GlobalProfile(): Promise<Profile<any> & any> {
	return (await new Profile<any>("var", "system", {
		__no: true
	}).init()) as unknown as Promise<Profile<any> & any>;
}
