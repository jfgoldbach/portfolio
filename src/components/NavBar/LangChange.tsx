import { useContext } from "react"
import { LangContext } from "../../App"
//style in NavBar.sass


function LangChange() {
    const {lang, setLang} = useContext(LangContext)

    const langHandler = () => {
        setLang(lang === "eng" ? "ger" : "eng")
    }

    return (
        <select value={lang} className={`langSelect ${lang}`} onChange={langHandler}>
            <option value="eng">🇬🇧</option>
            <option value="ger">🇩🇪</option>
        </select>
    )
}

export default LangChange