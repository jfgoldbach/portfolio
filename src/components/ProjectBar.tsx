import React, {useContext, useEffect} from 'react'
import { OverviewContext } from '../App'
import ProjectThumbnail from './ProjectThumbnail'
//import '/styles/css/ProjectBar.css'

type barProps = {
  type: string
}

function ProjectBar(props: barProps) {
  const {overview} = useContext(OverviewContext)

  //useEffect(() => {
  //    if(props.scroll>50){
  //      document.getElementById('bar')?.classList.add('zero-height');
  //      document.getElementById('bar_item_container')?.classList.add('zero-height');
  //    } else{
  //      document.getElementById('bar')?.classList.remove('zero-height');
  //      document.getElementById('bar_item_container')?.classList.remove('zero-height');
  //    }
  //}, [props.scroll])

  return (
    <div id='bar' className={`project-bar ${props.type}`}>
        <div id='bar_item_container' className='item-container'>
          {overview.map(project => 
            <ProjectThumbnail link={`/${project.link}`} source={project.thumbnail} name={project.name} wip={project.info === "inConstruction"} />
          )}
        </div>
    </div>
  )
}

export default ProjectBar