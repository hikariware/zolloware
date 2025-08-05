import config from "@root/config";
import constant from "@root/constant.json";

const constants: TranslatorType = {
	bot: {
		...constant.bot,
		...config.bot,
		token: "d3d3LnlvdXR1.YmUuY29tL3dhdGNoP3Y9ZFF3NHc.5V2dYY1E="
	}
};

interface TranslatorType {
	[key: string]: string | number | TranslatorType;
}

function $(format: string, addtionalTraslator: TranslatorType = {}) {
	const r = format.replace(/%([0-9a-zA-Z\.\_\-]*?)%/g, (_, replaceName) => {
		const _s = _translator(replaceName, addtionalTraslator);
		return _s;
	}).replaceAll("\\%", "%").replaceAll("%\\", "%");

	return r;
}

function _translator(piece: string, additionalTranslator: TranslatorType) {
	const _p = piece.split(".");
	const _v = get_value(_p, additionalTranslator);
	return _v ? _v.toString() : "";
}

function get_value(keys: string[], additionalTranslator: TranslatorType) {
	// normal translate
	const v1 = get_translate(keys, constants);
	if (v1) return v1;
	const v2 = get_translate(keys, additionalTranslator);
	if (v2) return v2;
	return null;
}

function get_translate(keys: string[], translator: TranslatorType): string | null {
	let k: TranslatorType | string | undefined = translator;
	for (const key of keys) {
		if (!k) return null;
		if (typeof k === "string") return k;
		k = k[key] ? `${k[key]}` : undefined;
	}
	if (!k) return null;
	return k as any;
}

export default $;
