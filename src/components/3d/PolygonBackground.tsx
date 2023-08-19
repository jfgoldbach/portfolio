import { shaderMaterial } from "@react-three/drei"
import { Canvas, extend, ReactThreeFiber, ThreeElements, useFrame } from "@react-three/fiber"
import { Suspense, useRef } from "react"


const vertexShader = `
varying vec3 pos;
varying float calcZ;
uniform float uTime;
void main() {
    pos = position;
    calcZ = (sin((position.x - 18.0) * (uTime / 12.0)) * sin((position.y - 8.0) * (uTime / 12.0)))/ 8.0;
    gl_Position = projectionMatrix * modelViewMatrix * 
        vec4(
            position.x, 
            position.y, 
            calcZ, 
            1
        );
}
`

const fragmentShader = `
varying vec3 pos;
varying float calcZ;
float depth;
void main() {
    depth = calcZ * 10.0;
    gl_FragColor = vec4(depth, depth, depth, 1.0);
}
`

const shaderProps = {uTime: 6.0,}

const PolygonMaterial = shaderMaterial(shaderProps, vertexShader, fragmentShader)

extend({ PolygonMaterial })

/* type PolygonMat = {
    uTime: number
} & JSX.IntrinsicElements['shaderMaterial'] */


declare global {
    namespace JSX {
        interface IntrinsicElements {
            polygonMaterial: ReactThreeFiber.Node<typeof PolygonMaterial & JSX.IntrinsicElements['shaderMaterial'], typeof PolygonMaterial>
        }
    }
}



function PolygonMesh() {
    const matRef = useRef<typeof PolygonMaterial>(null)
    useFrame((state, delta) => {
        const mat = matRef.current
        if (mat) {
            mat.uTime += delta / 1.5
        }
    })

    return (
        <mesh>
            <planeGeometry args={[18.0, 8.0, 18.0, 8.0]} />
            <polygonMaterial ref={matRef} wireframe />
        </mesh>
    )
}



export default function PolygonBackground() {
    return (
        <Suspense>
            <Canvas className="polygon-canvas">
                <PolygonMesh />
            </Canvas>
        </Suspense>
    )
}