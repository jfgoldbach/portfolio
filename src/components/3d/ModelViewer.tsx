import { createContext, Suspense, useContext, useEffect, useRef, useState } from "react";
import { LangContext, ReadyContext } from "../../App";
import Button from "../Button";
import Loading from "../helper/Loading";
import MeshCard from "./MeshCard";
import ViewerCanvas from "./ViewerCanvas";
import instance from "../network/axios";
import "../../styles/css/WebDev.css"
import { errorType } from "../../types/types";
import ErrorInfo from "../helper/ErrorInfo";
//styling in WebDev.sass

type modelInfos = {
    id: number,
    name: string,
    thumbnail: string,
    path: string,
    vertices: number
}[]

type viewerContextType = {
    activeModel: string,
    setActiveModel: React.Dispatch<string>
}

export const viewerContext = createContext<viewerContextType>({} as viewerContextType)

export default function ModelViewer() {
    const { lang } = useContext(LangContext)
    const [models, setModels] = useState<modelInfos>()
    const [error, setError] = useState<errorType>({} as errorType)
    const [activeModel, setActiveModel] = useState<string>("/models/standard.glb")
    const [fov, setFov] = useState(35)
    const [lr, setLr] = useState("")
    const browserRef = useRef<HTMLDivElement>(null)
    const { ready } = useContext(ReadyContext)

    function loadData() {
        setError({} as errorType)
        instance.get("?type=models", { headers: { "jwt": sessionStorage.getItem("jwt") } })
            .then(response => response.data)
            .then(result => { setModels(result); console.log(result) })
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

        return(() => {
            cBrowser?.removeEventListener('scroll', checkLR)
        })
    }, [browserRef])


    useEffect(() => {
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


    return (
        <viewerContext.Provider value={{ activeModel, setActiveModel }} >
            <div className="modelViewer-container">
                <div className="content-wrapper">
                    <div className="canvas-wrapper">
                        <div className="viewer-label">
                            <i className="fa-solid fa-eye"></i>
                            <p>{lang === "eng" ? "3D view" : "3D Ansicht"}</p>
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

                    <div className="viewerSettings">
                        <div className="viewer-label">
                            <i className="fa-solid fa-gear"></i>
                            <p>{lang === "eng" ? "Settings" : "Einstellungen"}</p>
                        </div>
                        <label title="changes the cameras field of view">
                            <p>fov</p>
                            <div className="inputContainer">
                                <input type="number" value={fov} onChange={changeFov} />
                                <Button onClick={resetFov}>
                                    <i className="fa-solid fa-arrow-rotate-right"></i>
                                </Button>
                            </div>

                        </label>
                    </div>
                </div>
            </div>
        </viewerContext.Provider>
    )
}