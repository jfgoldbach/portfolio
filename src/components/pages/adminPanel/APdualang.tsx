import { useContext, useEffect, useRef, useState } from "react"
import Button from "../../Button"
import { apChanges } from "./APcontent"
import "../../../styles/css/DualLang.css"
import { LangContext } from "../../../App"

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
    const {lang} = useContext(LangContext)
    const { setChangesList, submitRef } = useContext(apChanges)

    const gerChanged = german !== ger
    const engChanged = english !== eng


    function listChanges() {
        setChangesList(prev => {
            let newState = { ...prev }
            newState[name] = gerChanged || engChanged
            return newState
        })
        if (submitRef.current) {
            submitRef.current[name] = { "type": "dualang", "ger": german, "eng": english }
        }
    }


    useEffect(() => {
        setGer(ger)
        setEng(eng)
    }, [])

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
            <h2 className={`${(gerChanged || engChanged) ? "changes" : ""}`}>
                {(gerChanged || engChanged) &&
                    <i className="fa-solid fa-pen"></i>
                }
                {name.replaceAll("_", " ")}
            </h2>
            <div className="textfields" title={lang === "eng"? "German" : "Deutsch"}>
                <div className="ger">
                    <div className="flagContainer">
                        <div className="flag" />
                        {gerChanged &&
                            <Button onClick={resetGer}>
                                <i className="fa-solid fa-arrow-rotate-right"></i>
                            </Button>
                        }
                    </div>
                    <textarea ref={gerRef} className={gerChanged ? "changed" : ""} value={german} onChange={changeGer} />
                </div>
                <div className="eng" title={lang === "eng"? "English" : "Englisch"}>
                    <div className="flagContainer">
                        <div className="flag" />
                        {engChanged &&
                            <Button onClick={resetEng}>
                                <i className="fa-solid fa-arrow-rotate-right"></i>
                            </Button>
                        }
                    </div>
                    <textarea ref={engRef} className={engChanged ? "changed" : ""} value={english} onChange={changeEng} />
                </div>
            </div>
        </div>
    )
}

export default APdualang