import '../styles/css/Footer.css'

import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { LangContext, ReadyContext } from "../App"
import instance from './network/axios'
import LangChange from './NavBar/LangChange'
import Loading from './helper/Loading'

type footerProps = {
    setContact: React.Dispatch<React.SetStateAction<boolean>>
    setDaten: React.Dispatch<React.SetStateAction<boolean>>
}

type footerSmall = {
    "type": "small"
    "text": string
}

type footerAction = {
    "type": "imprint" | "privacy_policy" | "login"
}

type footerSocial = {
    "type": "social"
    "symbol": {
        "type": "fontawesome" | "image"
        "path": string
    }
    "title": string
    "path": string
}


type footerContent = {
    "content": (footerSmall | footerAction | footerSocial)[][]
}


function Footer(props: footerProps) {
    const [content, setContent] = useState<footerContent | null>(null)
    const { ready } = useContext(ReadyContext)
    const { lang } = useContext(LangContext)

    const contactHandler = () => {
        props.setContact(true)
        props.setDaten(false)
    }

    const datenHandler = () => {
        props.setContact(false)
        props.setDaten(true)
    }

    useEffect(() => {
        if (ready) {
            instance.get("?type=footer_content", { headers: { "jwt": sessionStorage.getItem("jwt") } })
                .then(response => response.data)
                .then(result => { setContent(result); console.log(result) })
                .catch(error => console.warn(error))
        }
    }, [ready])



    function footerSmall(text: string) {
        return (
            <small>{`${text}`}</small>
        )
    }

    function footerAction(type: footerAction["type"]) {
        let fill = { "action": () => { }, "eng": "", "ger": "" }
        switch (type) {
            case "imprint":
                fill = { "action": contactHandler, "eng": "Imprint", "ger": "Impressum" }
                break;
            case "privacy_policy":
                fill = { "action": datenHandler, "eng": "Privacy policy", "ger": "Datenschutzerklärung" }
                break;
        }
        return (
            <>
                {type === "login" ?
                    <Link className="contact-btn" to="/changer">Login</Link>
                    :
                    <button onClick={fill.action} className='contact-btn'>{lang === "eng" ? fill.eng : fill.ger}</button>
                }
            </>
        )
    }

    function footerSocial(symbol: footerSocial["symbol"], title: string, path: string) {
        return (
            <a href={path} title={title} target='_blank' aria-label={title.replaceAll(" ", "-")} className='social-icon-link'>
                {symbol.type === "fontawesome" ?
                    <i className={symbol.path} />
                    :
                    <img src={symbol.path} className='social-symbol' />
                }
            </a>
        )
    }



    return (
        <div className='footer-container'>
            {content ?
                content.content.map(row => {
                    return (
                        <div className='social-media-wrap'>
                            {row.map(elem => {
                                switch (elem.type) {
                                    case "small":
                                        return footerSmall(elem.text)
                                    case "imprint":
                                    case "privacy_policy":
                                    case "login":
                                        return footerAction(elem.type)
                                    case "social":
                                        return footerSocial(elem.symbol, elem.title, elem.path)
                                }
                            })}
                        </div>
                    )
                })
                :
                <Loading light />
            }
        </div>
    )
}

export default Footer