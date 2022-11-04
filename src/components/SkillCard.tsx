import { useState } from 'react'
import TooltipMatchProjects from './helper/TooltipMatchProjects'
import './SkillCard.css'

type skillProps = {
  skill: string
  type: string
  beneath?: boolean
}

function SkillCard(props: skillProps) {
  const [hover, setHover] = useState(false)

  return (
    <div className={`skillContainer ${props.type}`} onMouseOver={() => setHover(true)} onMouseLeave={() => setHover(false)}>
        <p>{props.skill}</p>
        {hover &&
          <TooltipMatchProjects beneath={props.beneath} tech={props.skill} />
        }
    </div>
  )
}

export default SkillCard