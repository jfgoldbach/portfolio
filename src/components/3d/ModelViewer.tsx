import { createContext, Suspense, useContext, useEffect, useRef, useState } from "react";
import { LangContext, ReadyContext } from "../../App";
import Button from "../Button";
import Loading from "../helper/Loading";
import MeshCard from "./MeshCard";
import ViewerCanvas from "./ViewerCanvas";
import instance from "../network/axios";
import "../../styles/css/WebDev.css"
import { actionsType, errorType } from "../../types/types";
import ErrorInfo from "../helper/ErrorInfo";
import { AnimationAction } from "three";
//styling in WebDev.sass

type modelInfos = {
    id: number
    name: string
    thumbnail: string
    path: string
    vertices: number
    anim: number
}[]

type viewerContextType = {
    activeModel: string
    setActiveModel: React.Dispatch<string>
    autoPlay: boolean
    autoCam: boolean
}

export const viewerContext = createContext<viewerContextType>({} as viewerContextType)

export default function ModelViewer() {
    const { lang } = useContext(LangContext)
    const [models, setModels] = useState<modelInfos>()
    const [error, setError] = useState<errorType>({} as errorType)
    const [activeModel, setActiveModel] = useState<string>("/models/standard.glb")
    const [fov, setFov] = useState(35)
    const [lr, setLr] = useState("")
    const [expand, setExpand] = useState(false)
    const [autoPlay, setAutoPlay] = useState(true)
    const [autoCam, setAutoCam] = useState(false)
    const browserRef = useRef<HTMLDivElement>(null)
    const { ready } = useContext(ReadyContext)


    function loadData() {
        setError({} as errorType)
        instance.get("?type=models", { headers: { "jwt": sessionStorage.getItem("jwt") } })
            .then(response => response.data)
            .then(result => { setModels(result) })
            .catch(error => setError({ "msg": error.message, "code": error.code }))
    }

    useEffect(() => {
        if (ready) loadData()
    }, [ready])

    useEffect(() => {
        if (ready) loadData()
        const metaIcon: HTMLLinkElement = document.getElementById("icon") as HTMLLinkElement
        if (metaIcon) {
            metaIcon.href = "/images/favicon_viewer.ico"
        }


    }, [])

    useEffect(() => {
        console.log("browserRef", browserRef.current)
        const cBrowser = browserRef.current

        function checkLR() {
            let classes = []
            if (cBrowser) {
                if (cBrowser.scrollLeft > 15) {
                    classes.push("left")
                }
                if (cBrowser.scrollWidth - cBrowser.scrollLeft - cBrowser.clientWidth > 15) {
                    classes.push("right")
                }
            }
            setLr(classes.join(" "))
        }

        if (cBrowser) {
            if (cBrowser.scrollWidth > cBrowser.clientWidth) {
                setLr("right")
            }
            cBrowser.addEventListener('scroll', checkLR)
        }

        return (() => {
            cBrowser?.removeEventListener('scroll', checkLR)
        })
    }, [browserRef])


    useEffect(() => {
        console.log(models)
        const cBrowser = browserRef.current
        if (cBrowser) {
            if (cBrowser.scrollWidth > cBrowser.clientWidth) {
                setLr("right")
            }
        }
    }, [models])



    function createCards(amount: number) {
        let result: JSX.Element[] = []
        if (models) {
            const model = models[0]
            for (let i = 0; i < amount; i++) {
                result.push(<MeshCard id={i} path={model.path} img={model.thumbnail} name={model.name} verts={model.vertices} />)
            }
            return result
        }
    }

    const cards = createCards(23)

    function changeFov(e: React.ChangeEvent<HTMLInputElement>) {
        setFov(parseFloat(e.target.value))
    }

    function resetFov() {
        setFov(35)
    }

    function autoPlayChange() {
        setAutoPlay(prev => !prev)
    }

    function autoCamChange() {
        setAutoCam(prev => !prev)
    }

    function infoMessage() {
        window.alert(lang === "eng" ? 
            "Controls with a mouse:\nLeft button + drag: rotate\nRight button + drag: move\nScrollwheel: Zoom\n\nControls on a touchscreen device:\nPinch 2 fingers: Zoom\nDrag 1 finger: rotate\nDrag 2 fingers: move" :
            "Steuerung mit Maus:\nLinke Taste + ziehen: Drehen\nRechte Taste + ziehen: Bewegen\nScrollrad: Zoom\n\nSteuerung mit einem mobilen Gerät:\n2 Finger zusammenziehen: Zoom\n1 Finger bewegen: Drehen\n2 Finger bewegen: Bewegen")
    }


    return (
        <viewerContext.Provider value={{ activeModel, setActiveModel, autoPlay, autoCam }} >
            <div className="modelViewer-container">
                <div className={`content-wrapper ${expand ? "settings-expand" : ""}`}>
                    <div className="canvas-wrapper">
                        <div className="viewer-label">
                            <i className="fa-solid fa-eye"></i>
                            <p>{lang === "eng" ? "3D view" : "3D Ansicht"}</p>
                        </div>
                        <div className="model-info">
                            <p>
                                {activeModel ?? "none"}
                            </p>
                        </div>
                        <div className="canvas-info">
                            <Button onClick={infoMessage}>
                                i
                            </Button>
                        </div>
                        {activeModel !== "" &&
                            <Suspense fallback={<Loading light />}>
                                <ViewerCanvas modelPath={activeModel} fov={fov} />
                            </Suspense>
                        }
                    </div>

                    <div className={`contentBrowser ${lr}`}>
                        <div ref={browserRef} className={`cardContainer`}>
                            {models
                                ? models.map((model, index) =>
                                    <MeshCard
                                        key={index}
                                        id={index}
                                        path={model.path}
                                        img={model.thumbnail}
                                        name={model.name}
                                        verts={model.vertices}
                                        anim={model.anim}
                                    />
                                )
                                : error.msg ?
                                    <ErrorInfo request={loadData} />
                                    :
                                    <Loading light />
                            }
                        </div>
                        <div className="viewer-label">
                            <i className="fa-regular fa-folder-open"></i>
                            <p>{lang === "eng" ? "Content browser" : "Modellverzeichnis"}</p>
                        </div>
                    </div>

                    <div className="viewerSettings" onClick={() => setExpand(prev => !prev)}>
                        <div className="viewer-label">
                            <i className="fa-solid fa-gear"></i>
                            <p>{lang === "eng" ? "Settings" : "Einstellungen"}</p>
                        </div>
                        <div className="settings-list">
                            <label title="changes the cameras field of view">
                                <p>Field of view</p>
                                <div className="inputContainer">
                                    <input type="number" value={fov} onChange={changeFov} />
                                    <Button
                                        className="resetBtn"
                                        onClick={resetFov}
                                        title={lang === "eng" ? "Reset FOV" : "FOV zurücksetzen"}
                                    >
                                        <i className="fa-solid fa-arrow-rotate-right"></i>
                                    </Button>
                                </div>
                            </label>
                            <label>
                                <p>{lang === "eng" ? "Auto play animations" : "Animationen automatisch abspielen"}</p>
                                <div className="inputContainer">
                                    <input type="checkbox" checked={autoPlay} onChange={autoPlayChange}></input>
                                </div>
                            </label>
                            <label>
                                <p>{lang === "eng" ? "Adjust camera to model" : "Kamera am Modell ausrichten"}</p>
                                <div className="inputContainer">
                                    <input type="checkbox" checked={autoCam} onChange={autoCamChange}></input>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </viewerContext.Provider>
    )
}