import { FunctionComponent, useEffect } from "react"
import "../../styles/css/ParticleCode.css"
import snippets from "./codeSnippets.json"
import $ from 'jquery'

type particleProps = {
    id: number
    width?: number | 20
    emitters?: number | 1
    spawnRate?: number | 1000
    fixed?: boolean
    endPosition: string
    startPosition: string
    duration: number
}

const ParticleCode: FunctionComponent<particleProps> = ({id, width, emitters, endPosition, startPosition, spawnRate, duration, fixed}) => {

    const particleWidth = width? width : 20
    let emits = emitters? emitters : 1
    const rate = spawnRate? spawnRate : 1000

    //Because useEffect runs twice in strict mode, twice as many particles are spawned
    useEffect(() => {
        addParticles()
        if(fixed){
            $(".particleEmitter").addClass("fixed")
        }
    }, [])


    const addParticles = () => {
        //check if tab is visible & emiter parent still available, then spawn
        if(document.visibilityState === "visible" && $(`.particleEmitter.particleContainer${id}`).length !== 0){

            let ids: string[] = []
            for(let i = 0; i<emits; i++){
                ids.push(JSON.stringify(Math.random()))
            }

            const segment = (100 - particleWidth/2) / emits     //100vw - half element width /emits
            

            for(let i = 0; i<emits; i++){
                const rot = Math.random()*20 - 10   //max rotation 10deg in each direction
                //append or spawn "codeblock" with position dependent on number of emitters (so they dont overlap)
                $(`.particleEmitter.particleContainer${id}`)
                    //left: random pos in current segment (segment width - distance right) + distance left + segments before + distance far left
                    .append(`<code id="${ids[i]}" 
                        style="left: ${Math.random()*(segment- particleWidth/2) + particleWidth/2 + (segment)*i}vw;
                        max-width: ${particleWidth}vw;
                        --endPos: ${endPosition}; --startPos: ${startPosition}; --duration: ${duration}ms;
                        --startRot: 0deg; --endRot: ${rot}deg">
                        ${snippets[Math.floor(Math.random()*snippets.length)]}
                        </code>`
                    )

                setTimeout(() => {
                    //remove element after it reached its destination, which is when animation-duration is completed
                    document.getElementById(ids[i])?.remove()
                }, duration)
            }
        }
        
        //only loop again if container still exists
        if($(`.particleEmitter.particleContainer${id}`).length !== 0){
            setTimeout(() => {
                addParticles()
            }, Math.random()*(rate*0.4) + (rate*0.6))
        }else{
            //console.log(`element ${id} doesnt exist anymore`)
        }
    }



  return (
    <div className={`particleEmitter particleContainer${id}`} />
  )
}

export default ParticleCode