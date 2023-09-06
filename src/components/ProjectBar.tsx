import React, { useContext, useEffect, useRef, useState } from 'react'
import { LangContext, OverviewContext } from '../App'
import ProjectThumbnail from './ProjectThumbnail'
import '../styles/css/ProjectBar.css'

type barProps = {
  type: string
}

function ProjectBar(props: barProps) {
  const { overview } = useContext(OverviewContext)
  const { lang } = useContext(LangContext)
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const outerRef = useRef<HTMLDivElement>(null)

  function calcGrid(delay?: number) {
    const container = containerRef.current
    const outer = outerRef.current
    if (container && outer) {
      setTimeout(() => {
        const rows = Math.floor((outer.clientHeight * 0.8) / 100)
        container.style.gridTemplateRows = `repeat(${rows}, auto)`
        console.log("new rows", rows)
      }, delay ?? 0);

    }
  }

  useEffect(() => {
    calcGrid(0)
    function calcWithDelay() {
      calcGrid(400)
    }
    window.addEventListener('resize', calcWithDelay)

    return (() => {
      window.removeEventListener('resize', calcWithDelay)
    })
  }, [])


  return (
    <div
      ref={outerRef}
      id='bar'
      className={`project-bar ${props.type} ${open ? "" : "closed"}`}
    >
      <div
        ref={containerRef}
        id='bar_item_container'
        className='item-container'
      >
        {overview.map(project =>
          <ProjectThumbnail
            showTitle
            link={`/${project.link}`}
            source={project.thumbnail}
            name={project.name}
            wip={project.info === "inConstruction"}
          />
        )}
      </div>
      <button className='expandBtn' onClick={() => setOpen(prev => !prev)}>
        <p className={open ? "invis" : ""}>{lang === "eng" ? "Projects" : "Projekte"}</p>
        <i className={`fa-solid fa-angles-right ${open ? "open" : ""}`}></i>
      </button>
    </div>
  )
}

export default ProjectBar