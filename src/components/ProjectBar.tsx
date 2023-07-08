import React, {useContext, useEffect, useState} from 'react'
import { LangContext, OverviewContext } from '../App'
import ProjectThumbnail from './ProjectThumbnail'
import '../styles/css/ProjectBar.css'

type barProps = {
  type: string
}

function ProjectBar(props: barProps) {
  const {overview} = useContext(OverviewContext)
  const {lang} = useContext(LangContext)
  const [open, setOpen] = useState(false)

  return (
    <div id='bar' className={`project-bar ${props.type} ${open? "" : "closed"}`}>
        <div id='bar_item_container' className='item-container'>
          {overview.map(project => 
            <ProjectThumbnail 
              link={`/${project.link}`} 
              source={project.thumbnail} 
              name={project.name} 
              wip={project.info === "inConstruction"} 
            />
          )}
        </div>
        <button className='expandBtn' onClick={() => setOpen(prev => !prev)}>
          <p className={open? "invis" : ""}>{lang === "eng" ? "Projects" : "Projekte"}</p>
          <i className={`fa-solid fa-angles-right ${open? "open" : ""}`}></i>
        </button>
    </div>
  )
}

export default ProjectBar