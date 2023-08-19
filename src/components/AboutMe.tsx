import { useContext, useEffect, useRef, useState } from 'react'
import { LangContext } from '../App'
import { dbDualangType, dbSkillSecType } from '../types/types'
import CharCanvas from './3d/CharCanvas'
import '../styles/css/AboutMe.css'

import SkillCard from './SkillCard'
import { introContext } from './pages/Home'

type aboutmeProps = {
    "heading": dbDualangType,
    "subheading": dbDualangType,
    "skillcards": dbSkillSecType
}

function AboutMe({ heading, subheading, skillcards }: aboutmeProps) {
    const [plusskills, setPlusSkills] = useState(false)
    const { lang } = useContext(LangContext)
    const { finished } = useContext(introContext)
    const moreSkillsRef = useRef<HTMLDivElement>(null)

    const handleMoreSkills = () => {
        setPlusSkills(!plusskills)
    }

    useEffect(() => {
        const container = moreSkillsRef.current
        if (plusskills && container) {
            container.style.height = `${container.scrollHeight}px`
            setTimeout(() => {
                if (plusskills && container) {
                    container.style.overflow = "visible"
                    console.log("visible")
                }
            }, 200);
        } else if (container) {
            container.style.height = "0px"
            container.style.overflow = "hidden"
        }
    }, [plusskills])

    return (
        <div className='main-container aboutMe'>

            {/* {finished && <CharCanvas />} */}

            <div className='text-container'>
                {/* <h1>{lang === "eng" ? heading.eng : heading.ger}</h1> */}
                <p>{lang === "eng" ? subheading.eng : subheading.ger}</p>
            </div>
            <div className='skill-container'>
                {skillcards.sections.map(section => {
                    return (
                        <div className='category-container'>
                            {section.map(skill => <SkillCard skill={skill.name} type={skill.class} />)}
                        </div>
                    )
                })}
                <div className={`more-skills ${plusskills ? "unfold" : "folded"}`}>
                    <p onClick={handleMoreSkills}>
                        {lang === "eng" ? "Other skills" : "Andere Skills"}
                        <i className={`fa-solid fa-caret-up ${plusskills ? "turned" : ""}`} />
                    </p>
                    {skillcards.hidden.map(section =>
                        <div ref={moreSkillsRef} className={`category-container foldable ${plusskills ? "unfold" : ""}`}>
                            {
                                section.map(
                                    skill => <SkillCard skill={skill.name} type={skill.class} />
                                )
                            }
                        </div>
                    )
                    }
                </div>
            </div>
        </div>
    )
}

export default AboutMe