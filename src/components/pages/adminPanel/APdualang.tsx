import { useContext, useEffect, useRef, useState } from "react"
import Button from "../../Button"
import { apChanges, changesType } from "./APcontent"
import "../../../styles/css/DualLang.css"
import { LangContext } from "../../../App"
import ChangeFlag from "./ChangeFlag"

type duallangProps = {
    name: string,
    ger: string,
    eng: string,
    index: number
}

function APdualang({ name, ger, eng, index }: duallangProps) {
    const [german, setGer] = useState("")
    const [english, setEng] = useState("")
    const gerRef = useRef<HTMLTextAreaElement>(null)
    const engRef = useRef<HTMLTextAreaElement>(null)
    const { lang } = useContext(LangContext)
    const { setChangesList, resetAll } = useContext(apChanges)

    const gerChanged = german !== ger
    const engChanged = english !== eng


    function listChanges() {
        setChangesList(prev => {
            let newState = { ...prev }
            let changeObj: changesType = {}
            if (gerChanged) changeObj["ger"] = german
            if (engChanged) changeObj["eng"] = english
            if (!gerChanged && !engChanged) {
                delete newState[name]
            } else {
                newState[name] = changeObj
            }
            return newState
        })
    }


    useEffect(() => {
        setGer(ger)
        setEng(eng)
    }, [])

    useEffect(() => {
        if(resetAll) {
            resetGer()
            resetEng()
        }
    }, [resetAll])

    useEffect(() => {
        listChanges()
    }, [german, english])


    function changeGer(e: React.ChangeEvent<HTMLTextAreaElement>) {
        setGer(e.target.value)
    }

    function changeEng(e: React.ChangeEvent<HTMLTextAreaElement>) {
        setEng(e.target.value)
    }

    function resetGer() {
        setGer(ger)
    }

    function resetEng() {
        setEng(eng)
    }



    return (
        <div className={`apcSection dualLang scaleIn`} style={{ animationDelay: `${index * 0.05}s` }}>
            <ChangeFlag changes={gerChanged || engChanged} />

            <h2>
                {name.replaceAll("_", " ")}
            </h2>

            <div className="textfields" title={lang === "eng" ? "German" : "Deutsch"}>
                <div className="ger">
                    <Button
                        onClick={resetGer}
                        className={`DLrstBtn ${gerChanged ? "" : "inactiveInvis"}`}
                        title={lang === "eng" ? "Reset german text" : "Deutschen Text zurücksetzen"}
                    >
                        <i className="fa-solid fa-arrow-rotate-left"></i>
                    </Button>
                    <div className="flagContainer">
                        <div className="flag" />
                    </div>
                    <textarea ref={gerRef} className={gerChanged ? "changed" : ""} value={german} onChange={changeGer} />
                </div>

                <div className="eng" title={lang === "eng" ? "English" : "Englisch"}>
                    <Button
                        onClick={resetEng}
                        className={`DLrstBtn ${engChanged ? "" : "inactiveInvis"}`}
                        title={lang === "eng" ? "Reset english text" : "Englischen Text zurücksetzen"}
                    >
                        <i className="fa-solid fa-arrow-rotate-left"></i>
                    </Button>
                    <div className="flagContainer">
                        <div className="flag" />
                    </div>
                    <textarea ref={engRef} className={engChanged ? "changed" : ""} value={english} onChange={changeEng} />
                </div>
            </div>
        </div>
    )
}

export default APdualang