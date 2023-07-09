//import '/styles/css/ProjectThumbnail.css'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

type thumbnailProps = {
  link: string
  source: string
  name: string
  small?: boolean
  title?: string
  wip?: boolean
  showTitle?: boolean
}

function ProjectThumbnail(props: thumbnailProps) {
  const location = useLocation()
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="thumbnailWrapper">
      <Link title={props.title} to={props.link} className={`
        thumbnail-container 
        ${props.small ? "small" : ""}
        ${location.pathname === props.link? "active" : ""}
        ${loaded? "" : "loading"}
        `}>
          <img src={props.source} onLoad={() => setLoaded(true)} />
      </Link>
        {props.wip &&
          <i className="fa-solid fa-wrench" />
        }
        {props.showTitle && <p className={`project-title ${location.pathname === props.link? "active" : ""}`}>{props.name}</p>}
    </div>
  )
}

export default ProjectThumbnail