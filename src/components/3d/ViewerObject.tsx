import { useAnimations } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useEffect } from "react"
import { AnimationClip, Bone, BufferGeometry, Group, Material, SkinnedMesh } from "three"

type objectProps = {
    object: Group
    animations: AnimationClip[]
    playing: string
    rangeRef: React.RefObject<HTMLInputElement>
    timeDisplayRef: React.RefObject<HTMLParagraphElement>
    duration: number
    paused: boolean
    speed: number
    nodes: {
        body: SkinnedMesh<BufferGeometry, Material | Material[]>;
        Bone: Bone;
    }
}

function ViewerObject({ object, animations, nodes, playing, rangeRef,
    duration, timeDisplayRef, paused, speed }: objectProps) {

    const { actions, ref } = useAnimations(animations)

    const charBody = nodes["body"]
    const charRoot = nodes["Bone"]


    useEffect(() => {
        const animation = actions[playing]
        if (animation) {
            animation.reset().fadeIn(0.1).play()
            if (paused) {
                animation.setDuration(Infinity)
            }
        }

        return (() => {
            const animation = actions[playing]
            if (animation) {
                animation.fadeOut(0.1)
            }
        })
    }, [actions, playing])

    useEffect(() => {
        const animation = actions[playing]
        if (animation && !paused) {
            animation.setDuration(duration / speed)
        }
    }, [speed])

    useEffect(() => {
        const animation = actions[playing]
        if (animation) {
            if (paused) {
                animation.setDuration(Infinity)
            } else {
                console.log("pauseUnpase", duration)
                animation.setDuration(duration / speed)
                animation.play()
            }
        }
    }, [paused])

    useFrame((state, delta) => {
        const animation = actions[playing]
        const range = rangeRef.current
        const timeDisplay = timeDisplayRef.current
        if (animation && range) {
            range.value = ((animation.time * 100) / duration).toString()
            if (timeDisplay) {
                const minutes = Math.floor(animation.time / 60)
                const seconds = Math.ceil(animation.time - (minutes * 60))
                timeDisplay.innerHTML = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
            }
        }

    })


    return (
        <group>
            {(animations.length > 0 && charBody && charRoot) ?
                <>
                    <primitive ref={ref} object={charRoot} />
                    <skinnedMesh
                        geometry={charBody.geometry}
                        skeleton={charBody.skeleton}
                        material={charBody.material}
                        castShadow
                        receiveShadow
                    />
                </>
                :
                <mesh castShadow receiveShadow>
                    <primitive object={object} />
                </mesh>
            }
        </group>
    )
}

export default ViewerObject