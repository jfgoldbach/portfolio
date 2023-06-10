export type twoLang = {
    "ger": string;
    "eng": string
}

export type dbDualangType = {
    [key: string]: string;
    "type": "dualang";
} & twoLang

export type dbSkillcardType = {
    "name": string;
    "class"?: string;
    "color"?: string;
    "back"?: string
}

export type dbSkillSecType = {
    "type": "skilcards";
    "sections": dbSkillcardType[][];
    "hidden": dbSkillcardType[][]
}

export type dbNoteType = {
    "heading": twoLang;
    "description": twoLang;
    "path": string;
    "img": string
}

export type dbNotepadsType = {
    "type": "notepads";
    "notes": dbNoteType[]
}

export type dbInfoType = {
    "type": "info_link";
    "path": string;
    "ger": string;
    "eng": string
}

export type landingpageType = {
    "heading": dbDualangType;
    "subheading": dbDualangType;
    "carousel": dbInfoType;
    "aboutme_heading": dbDualangType;
    "aboutme_subheading": dbDualangType;
    "skillcard_sections": dbSkillSecType;
    "notepads": dbNotepadsType
}

export type indexTrackType = [number | null, number | null]


export type jwtPayload = {
    "iss": string;
    "name": string;
    "pw_hash": string;
    "iat": number;
    "exp": number;
    "admin": boolean
}