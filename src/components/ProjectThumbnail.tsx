//import '/styles/css/ProjectThumbnail.css'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

type thumbnailProps = {
  link: string
  source: string
  name: string
  small?: boolean
  title?: string
}

function ProjectThumbnail(props: thumbnailProps) {
  const location = useLocation()
  const [loaded, setLoaded] = useState(false)

  return (
    <Link title={props.title} to={props.link} className={`
      thumbnail-container 
      ${props.small ? "small" : ""}
      ${location.pathname === props.link? "active" : ""}
      ${loaded? "" : "loading"}
      `}>
        <img src={props.source} onLoad={() => setLoaded(true)} />
        <p className='project-title'>{props.name}</p>
    </Link>
  )
}

export default ProjectThumbnail