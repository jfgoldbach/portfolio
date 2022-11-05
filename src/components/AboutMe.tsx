import { useContext, useState } from 'react'
import './AboutMe.css'
import { LangContext } from './context/LangContext'
import SkillCard from './SkillCard'
import startContent from './startContent.json'

function AboutMe() {
    const [plusskills, setPlusSkills] = useState(false)
    const {lang, setLang} = useContext(LangContext)

    const handleMoreSkills = () => {
        setPlusSkills(!plusskills)
        console.log (plusskills)
    }

  return (
    <div className='main-container'>
        <div className='text-container'>
            <h1>{lang === "eng"? "Hi 👋, I'm Julian" : "Hi 👋, Ich bin Julian"}</h1>
            <p>{startContent[0][lang as "eng" || "ger"]}</p>
        </div>
        <div className='skill-container'>
            <div className='category-container'>
                <SkillCard skill='React' type='react' />
                <SkillCard skill='three.js' type='three' />
                <SkillCard skill='Bootstrap' type='bootstrap' />
                <SkillCard skill='php' type='php' />
                <SkillCard skill='TypeScript' type='typescript' />
                <SkillCard skill='jQuery' type='jquery' />
                <SkillCard skill='CSS' type='css' />
                <SkillCard skill='SQL' type='sql' />
                <SkillCard skill='HTML' type='html' />
                <SkillCard skill='JavaScript' type='js' />
            </div>
            <div className='more-skills'>
                <p onClick={handleMoreSkills}>
                    {lang === "eng"? "Other skills" : "Andere skills"} 
                    <i className={`fa-solid fa-caret-up ${plusskills? "turned" : ""}`} />
                </p>
                {plusskills &&
                    <div className="category-container">
                        <SkillCard skill='Photoshop' type='photoshop'/>
                        <SkillCard skill='Inkscape' type='bw' />
                        <SkillCard skill='Davinci Resolve' type='davinci'/>
                        <SkillCard skill='Gimp' type='gimp'/>
                        <SkillCard skill='Unreal Engine' type='bw'/>
                        <SkillCard skill='Blender' type='blender'/>
                    </div>
                }
            </div>
            <div className='category-container'>
                
            </div>
        </div>
    </div>
  )
}

export default AboutMe