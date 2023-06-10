import axios from "axios";
import { ChangeEvent, createContext, Suspense, useContext, useEffect, useState } from "react";
import { errorType, LangContext, ReadyContext } from "../../App";
import Button from "../Button";
import Loading from "../helper/Loading";
import MeshCard from "./MeshCard";
import ViewerCanvas from "./ViewerCanvas";
import request from '../../request.json'
import instance from "../network/axios";
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
    const { ready } = useContext(ReadyContext)

    function loadData() {
        setError({} as errorType)
        instance.get(`${request.url}?type=models`)
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
        if(metaIcon){
            metaIcon.href = "/images/favicon_viewer.ico"
        }
    }, [])

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
                    <div className="contentBrowser">
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
                            : error.msg
                                ? <div className="info-container mildWarn fetchError">
                                    <i className="fa-solid fa-triangle-exclamation" />
                                    <p>{`${lang === "eng" ? "Couldn't load model data:" : "Konnte Modelldaten nicht laden: "} ${error.msg} (${error.code})`}</p>
                                    <Button title={lang === "eng" ? "Try again" : "Erneut versuchen"} onClick={loadData}>
                                        <i className="fa-solid fa-rotate"></i>
                                    </Button>
                                </div>
                                : <Loading light />
                        }
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