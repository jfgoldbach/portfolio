import './ProjectThumbnail.css'
import { Link } from 'react-router-dom'

type thumbnailProps = {
  link: string
  source: string
  name: string
  small?: boolean
}

function ProjectThumbnail(props: thumbnailProps) {
  return (
    <Link to={props.link} className={`thumbnail-container ${props.small ? "small" : ""}`}>
        <img src={props.source} />
        <p className='project-title'>{props.name}</p>
    </Link>
  )
}

export default ProjectThumbnail