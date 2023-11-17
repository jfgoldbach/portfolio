import { useContext } from "react"
import { LangContext, cookieContext } from "../../App"
import Button from "../Button"

function CookieMsg() {
    const { lang } = useContext(LangContext)
    const { cookie, setCookie } = useContext(cookieContext)

    function resetCookies() {
        localStorage.removeItem("dataConsent")
        setCookie(undefined)
    }

    if (cookie === false) {
        return (
            <div className="cookieMsgContainer scaleIn">
                <div className="ContainerBundle">
                    <i className="fa-solid fa-circle-info"></i>
                    <p className="cookieMsg">
                        {
                            lang === "ger"
                                ? "Funktion nicht verfügbar, da dem Sammeln bzw. Weitergeben von Daten nicht zu gestimmt wurde."
                                : "Feature unavailble due to not accepting the collection of your personal data."
                        }
                    </p>
                </div>
                <div className="ContainerBundle">
                    <Button buttonStyle="btn--dark" title={lang === "ger" ? "Cookie-Banner öffnen" : "Open cookie banner"} onClick={resetCookies}>
                        {
                            lang === "ger"
                                ? "Einstellungen ändern"
                                : "Change settings"
                        }
                    </Button>
                </div>
            </div>
        )
    }
    return null
}

export default CookieMsg