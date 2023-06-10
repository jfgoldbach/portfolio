import { useGLTF } from "@react-three/drei"
import { useAnimations } from "@react-three/drei/web"
import { useEffect } from "react"
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader"

type charProps = {
    visible: boolean
}

type GLTFResult = GLTF & {
    nodes: {
        body: THREE.SkinnedMesh,
        Bone: THREE.Bone
    }
}


export default function CharWave({ visible }: charProps) {
    const { nodes, animations } = useGLTF("/models/char.glb") as unknown as GLTFResult //??ok typescript...
    const { ref, actions, names } = useAnimations(animations)

    const transitionSpeed = 0.3 //in seconds

    useEffect(() => {
        let timeout: NodeJS.Timeout
        if (visible) {
            actions.waving?.reset().fadeIn(transitionSpeed).play()
            timeout = setTimeout(() => {
                actions.waving?.reset().fadeOut(transitionSpeed).play()
                actions.coding?.reset().fadeIn(transitionSpeed).play()
            }, 2250);
        } else {
            actions.looking?.reset().fadeIn(transitionSpeed).play()
        }

        return () => {
            if (visible) {
                actions.waving?.reset().fadeOut(transitionSpeed).play()
                actions.coding?.reset().fadeOut(transitionSpeed).play()
                clearTimeout(timeout)
            } else {
                actions.looking?.reset().fadeOut(transitionSpeed).play()
            }
        }
    }, [visible])

    const charBody = nodes["body"]
    const charRoot = nodes["Bone"]

    return (
        <group position={[0, 0, 0]}>
            <primitive ref={ref} object={charRoot} position={[0, 0, 0]} />
            <skinnedMesh
                castShadow
                receiveShadow
                position={[0, 0, 0]}
                geometry={charBody.geometry}
                skeleton={charBody.skeleton}
                material={charBody.material}
            >
            </skinnedMesh>
        </group>
    )
}