import "./ProjectCards.css"
import "../SkillCard.css"
import { Link } from "react-router-dom"
import { useContext } from "react"
import { LangContext, OverviewContext } from "../../App"

type cardsprops = {
    index: number
}

function ProjectCards({index} : cardsprops) {
  const {overview} = useContext(OverviewContext)
  const {lang} = useContext(LangContext)
  const project = overview[index - 1]

  return (
    <Link to={project.link.replaceAll("webdev/", "")} className="projectCard">
        <div className="imgContainer">
            <img src={project.thumbnail} alt={project.name} />
        </div>
        <h1>{project.name}</h1>
        <hr />
        <div className="skillcards">
        {project.skillcards.map(
            item => <p className={item.type}>{item.name}</p>
        )}
        </div>
        <p>{project.description[lang as "eng" || "ger"]}</p>
    </Link>
  )
}

export default ProjectCards