import { createContext } from "react";

type langProps = {
    lang: string,
    setLang: React.Dispatch<React.SetStateAction<string>>
}

export const LangContext = createContext<langProps>({} as langProps)