import ProjectThumbnail from "../ProjectThumbnail"
import "./Tooltip.css"
import $ from 'jquery'
import { useContext, useEffect } from "react"
import { LangContext, OverviewContext } from "../../App"


type tooltipProps = {
    tech: string
    beneath?: boolean
}

function TooltipMatchProjects(props: tooltipProps) {
    const {overview} = useContext(OverviewContext)
    const projects = overview.filter(i => i.skillcards.filter(skill => {
        if(props.tech !== "JavaScript"){
           return skill.name === props.tech
        }else{
            return skill.name === props.tech || "TypeScript"
        }}).length >= 1)

    const {lang} = useContext(LangContext)

    useEffect(() => {
        const tooltipWidth = $(".tooltip__wrapper").width() as number
        const parentHalf = ($(".tooltip__wrapper").parent().width() as number)/2
        const parentLeft = $(".tooltip__wrapper").parent().offset()?.left || 0
        const parentMiddle = parentHalf + parentLeft
        const windowWidth = $(window).width() || 0
        
        //console.log(tooltipWidth, parentMiddle, windowWidth)
        
        if(parentMiddle + tooltipWidth/2 > windowWidth){ //overlapping right window edge
            const left = (parentLeft + tooltipWidth/2) - windowWidth
            $(".tooltip__wrapper").css("left", `${-left}px`)
            $(".tooltip__wrapper .arrow").css("left", `calc(50% + ${left + parentHalf}px)`)
        }else if(parentMiddle - tooltipWidth/2 < 0){ //overlapping left window edge
            const left = parentLeft - tooltipWidth/2
            $(".tooltip__wrapper").css("left", `${-left}px`)
            $(".tooltip__wrapper .arrow").css("left", `calc(50% + ${left + parentHalf}px)`)
        }
    },[])
    


  return (
    <div className={`tooltip__wrapper ${props.beneath ? "beneath" : ""}`}>
        <div className={`tooltip ${projects.length > 0? "" : "displayNone"}`}>
            <p>{lang === "eng" ? `Projects using ${props.tech}:` : `Projekte mit ${props.tech}:`}</p>
            <div className="arrow" />
            <div className="tooltip__projects">
                {projects.map
                    (item =>
                        <ProjectThumbnail title={item.name} small={true} link={item.link} source={item.thumbnail} name={item.name} />
                    )
                }
            </div>
        </div>
    </div>
  )
}

export default TooltipMatchProjects