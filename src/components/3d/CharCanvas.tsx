import { Environment } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import { PerspectiveCamera } from '@react-three/drei/web'
import useIntersectionObserver from "../hooks/useIntersectionObserver";
import CharWave from "./CharWave";

export default function CharCanvas() {
    const target = useRef(null)
    const isVisible = useIntersectionObserver(target, 0.4)

    return (
        <Suspense>
            <Canvas ref={target} className="char-canvas">
                <PerspectiveCamera makeDefault position={[0.25, 1.5, 2.25]} rotation={[-0.25, 0, 0]} fov={44} />
                <ambientLight intensity={0.2} />
                <CharWave visible={isVisible} />
                <directionalLight shadow-mapSize={1024} castShadow intensity={0.8} position={[0.5, 1, 0.75]} />
                <directionalLight intensity={0} position={[0.25, 0.5, -1]} />
                <Environment preset='city' />
            </Canvas>
        </Suspense>
    )
}