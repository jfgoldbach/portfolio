import { WidgetInstance } from "friendly-challenge"
import { useContext, useEffect, useRef } from "react"
import { LangContext } from "../../App"
import { captchaVerify } from "../../types/types"


type captchaProps = {
    setValid?: React.Dispatch<React.SetStateAction<captchaVerify>>
}


function FriendlyCaptcha({ setValid }: captchaProps) {
    const container = useRef<HTMLDivElement>(null)
    const widget = useRef<WidgetInstance>()
    const { lang } = useContext(LangContext)


    function captchaDone(solution: string) {
        if(setValid){
            setValid("valid")
        }
    }

    function captchaError(error: string) {
        console.warn("Could not solve captcha.", error)
        if(setValid){
            setValid("invalid")
        }
    }

    useEffect(() => {
        if (container.current && !widget.current) {
            widget.current = new WidgetInstance(container.current, {
                startMode: "auto",
                doneCallback: captchaDone,
                errorCallback: captchaError
            })
        }
    }, [container])



    return (
        <div
            ref={container}
            className="frc-captcha"
            data-sitekey="FCMGET3I886A1EDL"
            data-lang={lang === "eng" ? "en" : "de"}
        />
    )
}

export default FriendlyCaptcha