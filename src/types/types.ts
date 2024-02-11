import { AnimationAction } from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

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


export type errorType = {
    msg: string,
    code: string
}

export type overviewType = {
    id: number,
    name: string,
    info: string,
    link: string,
    thumbnail: string,
    video: string,
    skillcards: {
        name: string,
        type: string
    }[],
    description: {
        eng: string,
        ger: string
    },
    priority: number
}[]

export type accountType = {
    name: string,
    exp: number,
    admin: boolean
  } | undefined

export type langProps = {
    lang: string,
    setLang: React.Dispatch<React.SetStateAction<string>>
}

export type cookieProps = {
    cookie: boolean|undefined
    setCookie: React.Dispatch<React.SetStateAction<boolean|undefined>>
}

export type projectType = {
    id: number,
    name: string,
    info: string,
    link: string,
    thumbnail: string,
    video: string,
    skillcards: {
        name: string,
        type: string
    }[],
    description: {
        eng: string,
        ger: string
    },
    priority: number
}

export type captchaVerify = "verify" | "valid" | "invalid"

export type actionsType = {[key:string]: AnimationAction | null}

export type GLTFResult = GLTF & {
    nodes: {
        body: THREE.SkinnedMesh,
        Bone: THREE.Bone
    }
}