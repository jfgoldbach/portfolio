import { useRef, useState } from "react"
import "../../styles/css/Cookies.css"
import Button from "../Button"
import { Link } from "react-router-dom"


function Cookies() {
    const [details, setDetails] = useState(false)
    const [show, setShow] = useState(true)
    const cookieListRef = useRef<HTMLDivElement>(null)

    function detailList() {
        setDetails(prev => {
            const list = cookieListRef.current
            if(list){
                if(prev){
                    list.classList.remove("open")
                } else {
                    list.classList.add("open")
                }
            }
            return !prev
        })
    }

    function consent(consent: boolean) {
        localStorage.setItem("dataConsent", consent?"true" : "false")
    }

    return (
        <div className={`cookies`}>
            <div className="cookieHeader">
                <img src="images/cookies_data.svg" alt="Cookie symbol" />
                <h1>Cookies <br />&<br /> Personenbezogene Daten</h1>
            </div>
            <p className="cookieExplain">Diese Website benutzt keine Cookies und du wirst nicht getrackt.<br/>Für manche Funktionen werden aber persönliche Daten erhoben.</p>
            <Button className="cookiesDetails" onClick={detailList}>
                Details
                <p>
                    {details ? "▼" : "▲"}
                </p>
                <div ref={cookieListRef} className={`CDetailsList ${details? "open" : "closed"}`}>
                    <p>Wenn du annimmst stimmst du zu, dass:</p>
                    <ul>
                        <li>Beim Benutzen der Anmeldefunktion deine <strong>IP-Adresse</strong> auf <strong>unbestimmte Zeit</strong> gespeichert wird</li>
                    </ul>
                    <p className="CListDisclaimer">Wenn du willst, dass all deine Daten gelöscht werden oder du weitere Fragen hast, kontaktiere <a href="mailto:kontakt@jfgoldbach.de" target="_blank">kontakt@jfgoldbach.de</a> oder verwende das <Link to="contact">Kontaktformular</Link>.</p>
                </div>
            </Button>
            <div className="cookiesDecisions">
                <Button onClick={consent(true)}>Akzeptieren</Button>
                <Button onClick={consent(false)}>Ablehnen</Button>
            </div>
        </div>
    )
}

export default Cookies