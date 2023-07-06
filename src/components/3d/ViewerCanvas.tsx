import { Stage, OrbitControls, useGLTF, PerspectiveCamera, Html, Sky, Bounds } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useContext, useEffect, useRef } from "react";
import { LangContext } from "../../App";

type viewerCanvasType = {
    modelPath: string,
    fov: number
}


export default function ViewerCanvas({ modelPath, fov }: viewerCanvasType) {
    const { lang } = useContext(LangContext)
    const cam = useRef<typeof PerspectiveCamera>(null)
    const { scene } = useGLTF(modelPath)

    useEffect(() => {
        console.log(modelPath)
    }, [modelPath])

    return (
        <Canvas shadows camera={{ position: [-4, 2, 8], fov: fov }} className="viewCanvas">
            <color attach="background" args={["skyblue"]} />
            <Sky sunPosition={[100, 20, 100]} />
            <Stage
                adjustCamera={false}
                intensity={0.5}
                preset="rembrandt"
                shadows={{ type: 'accumulative', color: 'skyblue', colorBlend: 2, opacity: 2 }}
                environment="city">
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                    <planeBufferGeometry args={[50, 50, 50, 50]} />
                    <meshStandardMaterial wireframe color={"#555"} />
                </mesh>
                <Bounds>
                    <mesh castShadow>
                        <primitive object={scene} />
                    </mesh>
                </Bounds>
                {modelPath === "/models/standard.glb" &&
                    <Html position={[0, 0.8, 0]}>
                        <div className="pickHint">
                            <p>{lang === "eng" ? 
                            "Chose a model from the content browser" 
                            : "Wähle ein Modell aus dem Modellverzeichnis"
                            }</p>
                        </div>
                    </Html>
                }
            </Stage>
            <PerspectiveCamera position={[-4, 2, 8]} ref={cam} makeDefault fov={fov} />
            <OrbitControls />
        </Canvas>
    )
}