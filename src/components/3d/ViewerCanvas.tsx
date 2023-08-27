import { Stage, OrbitControls, useGLTF, PerspectiveCamera, Html, Sky, Bounds, useAnimations } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useContext, useEffect, useRef, useState } from "react";
import { LangContext } from "../../App";
import { GLTFResult, actionsType } from "../../types/types";
import Button from "../Button";
import ViewerObject from "./ViewerObject";
import { viewerContext } from "./ModelViewer";

type viewerCanvasType = {
    modelPath: string
    fov: number
}


export default function ViewerCanvas({ modelPath, fov }: viewerCanvasType) {
    const [anim, setAnim] = useState("")
    const [duration, setDuration] = useState({ minutes: 0, seconds: 0 })
    const [durSec, setDurSec] = useState(0)
    const [speed, setSpeed] = useState(1)
    const [paused, setPaused] = useState(false)
    const [minim, setMinim] = useState(false)

    const rangeRef = useRef<HTMLInputElement>(null)
    const timeDisplayRef = useRef<HTMLParagraphElement>(null)
    const rangeContainerRef = useRef<HTMLDivElement>(null)
    const rangeAfterRef = useRef<HTMLDivElement>(null)

    const { lang } = useContext(LangContext)
    const { autoPlay, autoCam } = useContext(viewerContext)

    const cam = useRef<typeof PerspectiveCamera>(null)

    const { scene, animations, nodes } = useGLTF(modelPath) as unknown as GLTFResult


    useEffect(() => {
        setPaused(!autoPlay)
    }, [modelPath])


    useEffect(() => {
        console.log(animations)
        if (animations.length > 0) {
            setAnim(animations[0].name)
        }
    }, [animations])

    function indexOfAnim(name: string) {
        for (let i = 0; i < animations.length; i++) {
            if (animations[i].name === name) {
                return i
            }
        }
        return null
    }

    function getDurationInSeconds() {
        let index = indexOfAnim(anim)
        if (index) {
            return animations[index].duration
        }
        return null
    }

    function calcDuration() {
        let index = indexOfAnim(anim)
        console.log("calcDuration", index)
        if (typeof (index) === "number") {
            const dur = animations[index].duration
            setDurSec(dur)
            const minutes = Math.floor(dur / 60)
            const seconds = Math.ceil(dur - (minutes * 60))
            console.log("change duration", minutes, seconds)
            setDuration({ minutes, seconds })
        }
    }

    useEffect(() => {
        console.log("anim changed")
        calcDuration()
    }, [anim])

    function selectChange(event: React.ChangeEvent<HTMLSelectElement>) {
        setAnim(event.target.value)
    }

    function prevAnim() {
        const index = indexOfAnim(anim)
        if (typeof (index) === "number") {
            console.log("prev anim")
            setAnim(animations[index - 1].name)
        }
    }

    function nextAnim() {
        const index = indexOfAnim(anim)
        if (typeof (index) === "number") {
            console.log("next anim")
            setAnim(animations[index + 1].name)
        }
    }

    function speedChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setSpeed(parseFloat(e.target.value))
    }



    return (
        <>
            <Canvas shadows camera={{ position: [-4, 2, 8], fov: fov }} className="viewCanvas">
                <color attach="background" args={["skyblue"]} />
                <Sky sunPosition={[100, 20, 100]} />
                <Stage
                    adjustCamera={autoCam}
                    intensity={0.5}
                    preset="rembrandt"
                    shadows={true}
                    environment="city"
                >
                    <mesh rotation={[-Math.PI / 2, 0, 0]}>
                        <planeBufferGeometry args={[50, 50, 50, 50]} />
                        <meshStandardMaterial wireframe color={"#555"} />
                    </mesh>
                    <Bounds>

                        <ViewerObject
                            object={scene}
                            animations={animations}
                            nodes={nodes}
                            playing={anim}
                            duration={durSec}
                            rangeRef={rangeRef}
                            timeDisplayRef={timeDisplayRef}
                            paused={paused}
                            speed={speed}
                            rangeStyle={{ container: rangeContainerRef.current, after: rangeAfterRef.current }}
                        />

                    </Bounds>
                    {/* {modelPath === "/models/standard.glb" &&
                        <Html position={[0, 0.8, 0]}>
                            <div className="pickHint">
                                <p>{lang === "eng" ?
                                    "Chose a model from the content browser"
                                    : "Wähle ein Modell aus dem Modellverzeichnis"
                                }</p>
                            </div>
                        </Html>
                    } */}
                </Stage>
                <PerspectiveCamera position={[-4, 2, 8]} ref={cam} makeDefault fov={fov} />
                <OrbitControls />
            </Canvas>


            <div className={`animation-bar ${animations.length > 0 ? "active" : ""} ${minim ? "minimized" : ""}`}>
                <div className="top-container">
                    <h3>Animation</h3>
                    <div className="times-container">
                        <p ref={timeDisplayRef}>
                            0:00
                        </p>
                        <p>
                            {`${Math.floor(duration.minutes)}:${duration.seconds < 10 ? "0" : ""}${duration.seconds}`}
                        </p>
                    </div>
                    <Button className={`minimizeBtn ${minim ? "minimized" : ""}`} onClick={() => setMinim(prev => !prev)}>
                        {minim ?
                            <i className="fa-solid fa-caret-up" />
                            :
                            "-"
                        }
                    </Button>
                </div>

                <div ref={rangeContainerRef} className="rangeContainer">
                    <input ref={rangeRef} type="range" step="any" />
                    <div ref={rangeAfterRef} className="rangeAfter" />
                </div>

                <div className="bottom-navigation">
                    <select
                        className="speedBtn"
                        value={speed}
                        onChange={speedChange}
                    >
                        <option value={0.25}>0.25&times;</option>
                        <option value={0.5}>0.5&times;</option>
                        <option value={0.75}>0.75&times;</option>
                        <option value={1}>1&times;</option>
                        <option value={1.25}>1.25&times;</option>
                        <option value={1.5}>1.5&times;</option>
                        <option value={1.75}>1.75&times;</option>
                        <option value={2}>2&times;</option>
                        <option value={3}>3&times;</option>
                        <option value={4}>4&times;</option>
                    </select>
                    <div className="time-buttons">
                        <Button
                            className={anim === animations[0]?.name ? "inactive" : ""}
                            title={lang === "eng" ? "Previous animation" : "Vorherige Animation"}
                            onClick={prevAnim}
                        >
                            <i className="fa-solid fa-forward-step rotate180" />
                        </Button>
                        <Button
                            title={lang === "eng" ? "Pause" : "Pausieren"}
                            onClick={() => setPaused(prev => !prev)}
                        >
                            {paused ?
                                <i className="fa-solid fa-play" />
                                :
                                <i className="fa-solid fa-pause" />
                            }
                        </Button>
                        <Button
                            className={anim === animations[animations.length - 1]?.name ? "inactive" : ""}
                            title={lang === "eng" ? "Next animation" : "Nächste Animation"}
                            onClick={nextAnim}
                        >
                            <i className="fa-solid fa-forward-step" />
                        </Button>
                    </div>
                    {animations.length > 0 &&
                        <select value={anim} onChange={selectChange}>
                            {animations.map(anim => <option>{anim.name}</option>)}
                        </select>
                    }
                </div>
            </div>
        </>
    )
}