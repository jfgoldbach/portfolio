import { useContext, useEffect, useRef, useState } from "react"
import "../../styles/css/Cookies.css"
import Button from "../Button"
import { Link } from "react-router-dom"
import { LangContext, cookieContext } from "../../App"
import { toast } from "react-toastify"


function Cookies() {
    const storageName = "dataConsent"
    const [details, setDetails] = useState(false)
    const cookieListRef = useRef<HTMLDivElement>(null)
    const timeoutRef = useRef<NodeJS.Timeout>()

    const { cookie, setCookie } = useContext(cookieContext)
    const { lang } = useContext(LangContext)



    function initLSConsent() { //local storage consent
        //console.log("init ls consent")
        const consent = localStorage.getItem(storageName)
        if (consent) {
            //console.log(consent)
            return consent === "true" ? true : false
        } else {
            //console.log("cookies undefined")
            return undefined
        }
    }

    function detailList() {
        setDetails(prev => {
            const list = cookieListRef.current
            if (list) {
                if (prev) {
                    list.classList.remove("open")
                } else {
                    list.classList.add("open")
                }
            }
            return !prev
        })
    }

    function consent(consent: boolean) {
        setDetails(false)
        localStorage.setItem(storageName, consent.toString())
        toast.success(`
            ${lang === "ger" ? "Du hast " : "You have "} 
            ${lang === "ger" ? (consent? "zugestimmt" : "abgelehnt") : (consent ? "accepted" : "declined")} 
            ${lang === "ger" 
                ? ", dass deine Daten verarbeitet werden können.\nWenn du das ändern willst, klicke auf den Link am Ende der Seite." 
                : " to have your data collected.\nIf you want to change this, click on the button on the end of this site."
            }`)
        setCookie(consent)
    }

    function checkConsent() {
        timeoutRef.current = setTimeout(() => {
            ////console.log("check consent")
            setCookie(initLSConsent)
            checkConsent()
        }, 3000);
    }

    useEffect(() => {
        setCookie(initLSConsent) //sets the apps cookie value to whatever is in storage initialy
        checkConsent()
        return (() => {
            const timeout = timeoutRef.current
            if (timeout) clearTimeout(timeout)
        })
    }, [])


    useEffect(() => {
        const list = cookieListRef.current
        if (list) {
            if (details) {
                list.style.height = `${list.scrollHeight}px`
                list.style.overflow = "default"
            } else {
                list.style.height = "0px"
                list.style.overflow = "hidden"
            }
        }
    }, [details])



    return (
        <div className={`cookies ${cookie !== undefined ? "decided" : "animIn"}`}>
            <div className="cookieHeader">
                <img src="images/cookies_data.svg" alt="Cookie symbol" />
                <h1>Cookies &amp; Personenbezogene Daten</h1>
            </div>
            <p className="cookieExplain">Diese Website benutzt keine Cookies und du wirst nicht getrackt.<br />Wenn du akzeptierst stimmst du aber zu, dass persönliche Daten von dir erhoben werden können.</p>
            <div className="CDetailsList_wrapper">
                <div ref={cookieListRef} className={`CDetailsList ${details ? "open" : "closed"}`}>
                    <p>Wenn du annimmst stimmst du zu, dass:</p>
                    <ul>
                        <li>Beim Benutzen der Anmeldefunktion deine <strong>IP-Adresse</strong> auf <strong>unbestimmte Zeit</strong> gespeichert wird</li>
                        <li>An <strong>Friendly Captcha</strong> die <strong>Request Headers</strong> User-Agent, Origin und Referer weitergeleitet werden. Mehr <a href="https://friendlycaptcha.com/de/legal/privacy-end-users/" target="_blank">hier</a>.</li>
                    </ul>
                    <p className="CListDisclaimer">Wenn du willst, dass all deine Daten gelöscht werden oder du weitere Fragen hast, kontaktiere bitte <a href="mailto:kontakt@jfgoldbach.de" target="_blank">kontakt@jfgoldbach.de</a> oder verwende das <Link to="contact?ip_checkbox=true">Kontaktformular</Link>.</p>
                </div>
            </div>
            <Button className="cookiesDetails" onClick={detailList}>
                Details
                <p>
                    {details ? "▼" : "▲"}
                </p>
            </Button>
            <div className="cookiesDecisions">
                <Button onClick={() => consent(true)}><strong>Akzeptieren</strong></Button>
                <Button onClick={() => consent(false)}><strong>Ablehnen</strong></Button>
            </div>
        </div>
    )
}

export default Cookies