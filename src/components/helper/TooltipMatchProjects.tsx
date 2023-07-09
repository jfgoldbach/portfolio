import ProjectThumbnail from "../ProjectThumbnail"
import '../../styles/css/Tooltip.css'
import $ from 'jquery'
import { useContext, useEffect, useState } from "react"
import { LangContext, OverviewContext } from "../../App"


type tooltipProps = {
    tech: string
    beneath?: boolean
}

function TooltipMatchProjects(props: tooltipProps) {
    const { overview } = useContext(OverviewContext)
    const { lang } = useContext(LangContext)
    const [lr, setLr] = useState("")

    const projects = overview.filter(i => i.skillcards.filter(skill => {
        if (props.tech !== "JavaScript") {
            return skill.name === props.tech
        } else {
            return skill.name === props.tech || "TypeScript"
        }
    }).length >= 1)


    useEffect(() => {
        const tooltipWidth = $(".tooltip__wrapper").width() as number
        const parentHalf = ($(".tooltip__wrapper").parent().width() as number) / 2
        const parentLeft = $(".tooltip__wrapper").parent().offset()?.left || 0
        const parentMiddle = parentHalf + parentLeft
        const windowWidth = $(window).width() || 0

        //console.log(tooltipWidth, parentMiddle, windowWidth)

        if (parentMiddle + tooltipWidth / 2 > windowWidth) { //overlapping right window edge
            const left = (parentLeft + tooltipWidth / 2) - windowWidth
            $(".tooltip__wrapper").css("left", `${-left}px`)
            $(".tooltip__wrapper .arrow").css("left", `calc(50% + ${left + parentHalf}px)`)
        }
        else if (parentMiddle - tooltipWidth / 2 < 0) { //overlapping left window edge
            const left = parentLeft - tooltipWidth / 2
            $(".tooltip__wrapper").css("left", `${-left}px`)
            $(".tooltip__wrapper .arrow").css("left", `calc(50% + ${left + parentHalf}px)`)
        }


        const projects = document.getElementById('projectsContainer')

        if (projects && projects.scrollWidth > projects.clientWidth) { //initialize
            setLr("right")
        }

        const changeLr = () => {
            let classes = []
            if (projects && projects.scrollLeft > 15) {
                classes.push('left')
            }
            if (projects && projects.scrollWidth - projects.scrollLeft - projects.clientWidth > 15) {
                classes.push('right')
            }
            
            setLr(classes.toString().replace(",", " "))
        }

        if (projects) {
            //Evenet listener that checks scrolls and adds corresponding class names based on scroll position
            projects.addEventListener('scroll', changeLr)
        }

        return(() =>{
            const projects = document.getElementById('projectsContainer')
            if(projects){
                projects.removeEventListener('scroll', changeLr)
            }
        })
    }, [])



    return (
        <div className={`tooltip__wrapper ${props.beneath ? "beneath" : ""}`}>
            <div className={`tooltip ${projects.length > 0 ? "" : "displayNone"}`}>
                <p>{lang === "eng" ? `Projects using ${props.tech}:` : `Projekte mit ${props.tech}:`}</p>
                <div className="arrow" />
                <div className={`tooltip__projects ${lr}`} id="projectsContainer">
                    {projects.map
                        (item =>
                            <ProjectThumbnail title={item.name} small={true} link={`/${item.link}`} source={item.thumbnail} name={item.name} />
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default TooltipMatchProjects