import { useContext, useEffect, useState } from "react"
import Button from "../Button"
import { LangContext } from "../../App"
import '../../styles/css/ErrorInfo.css'


type errorInfoProps = {
    msg?: { eng: string, ger: string } | string
    request?: () => void
    minimal?: boolean
    countdown?: number
    dark?: boolean
    autoRetry?: boolean
}

function ErrorInfo({ msg, request, minimal, countdown, dark, autoRetry }: errorInfoProps) {
    const { lang } = useContext(LangContext)
    const [time, setTime] = useState(countdown ?? 5)


    useEffect(() => {
        if (autoRetry) {
            if (time > 0) {
                countDown()
            } else if (request) {
                request()
            }
        }
    }, [time])

    function countDown() {
        if (time) {
            if (time > 0) {
                setTimeout(() => {
                    setTime(prev => prev ? prev - 1 : 0)
                }, 1000);
            }
        }
    }

    return (
        <div className={`warn-container scaleIn ${dark ? "dark" : ""}`}>
            {!minimal &&
                <>
                    <i className="fa-solid fa-triangle-exclamation" />
                    <h4>{msg ?? lang === "eng" ? "An error occured" : "Ein Fehler ist aufgetreten"}</h4>
                </>
            }
            {request ?
                autoRetry ?
                    <p className="time-display">
                        {minimal &&
                            <i className="fa-solid fa-triangle-exclamation" />
                        }
                        {`${lang === "eng" ? "Trying again in" : "Erneuter Versuch in"} ${time}s`}
                    </p>
                    :
                    <Button onClick={request} buttonStyle={dark ? "btn--dark" : ""}>
                        {minimal &&
                            <i className="fa-solid fa-triangle-exclamation" />
                        }
                        {lang === "eng" ? "Try again" : "Erneut versuchen"}
                        <i className="fa-solid fa-arrow-right"></i>
                    </Button>
                :
                <Button onClick={() => window.location.reload()} buttonStyle={dark ? "btn--dark" : ""}>
                    {minimal &&
                        <i className="fa-solid fa-triangle-exclamation" />
                    }
                    <i className="fa-solid fa-rotate"></i>
                    <p>{lang === "eng" ? "Reload site" : "Seite neu laden"}</p>
                </Button>
            }

        </div>
    )
}

export default ErrorInfo