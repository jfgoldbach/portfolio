import { useContext, useEffect, useRef, useState } from 'react'
import TooltipMatchProjects from './helper/TooltipMatchProjects'
import { forwardRef } from 'react'
import { skillstyleContext } from '../App'
import '../styles/css/SkillCard.css'

type skillProps = {
  children?: any
  skill: string
  type?: string
  color?: string
  back?: string
  beneath?: boolean
  noHover?: boolean
  draggable?: boolean
}

const SkillCard = forwardRef<HTMLDivElement, skillProps>(({ skill, type, beneath, noHover, draggable, color, back, children }: skillProps, ref) => {
  const [hover, setHover] = useState(false)
  const cardStyles = useContext(skillstyleContext)
  const bridgeRef = useRef<HTMLParagraphElement>(null)

  function changeStyle() {
    const parent = bridgeRef.current?.parentElement
    if(parent){
      parent.style.color = `${type && cardStyles[type]
        ? cardStyles[type].color ?? (color ?? "black")
        : color ?? "unset"}`
      parent.style.background = `${type && cardStyles[type]
        ? cardStyles[type].back ?? (back ?? "white")
        : back ?? "unset"}`
    }
  }

  useEffect(() => {
    //changes the style initialy but also updates, when for example the style loads after this component is rendered
    //however the styling has to be set in the return statement,
    //so that it wont flicker on rerenders
    changeStyle()
  }, [cardStyles])


  useEffect(() => {
    /* console.log("render skillcard") */
    changeStyle()
  }, [])


  return (
    <div
      ref={ref}
      draggable={draggable ?? false}
      className={`skillContainer ${draggable ? "draggable" : ""}`} /* ${type ?? ""} */
      style={{
        color: `${type && cardStyles[type]
          ? cardStyles[type].color ?? (color ?? "black")
          : color ?? "unset"}`,
        background: `${type && cardStyles[type]
          ? cardStyles[type].back ?? (back ?? "white")
          : back ?? "unset"}`
      }}
      onMouseOver={noHover ? () => { } : () => setHover(true)}
      onMouseLeave={noHover ? () => { } : () => setHover(false)}
    >
      <p ref={bridgeRef}>{skill} </p>
      {hover &&
        <TooltipMatchProjects beneath={beneath} tech={skill} />
      }
      {children && children}
    </div>
  )
})

export default SkillCard