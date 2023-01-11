import { useContext, useState } from 'react'
import { LangContext } from '../App'
//import 'src/styles/css/AboutMe.css'

import SkillCard from './SkillCard'
import startContent from './startContent.json'

function AboutMe() {
    const [plusskills, setPlusSkills] = useState(false)
    const {lang} = useContext(LangContext)

    const handleMoreSkills = () => {
        setPlusSkills(!plusskills)
    }

  return (
    <div className='main-container aboutMe'>
        <div className='text-container'>
            <h1>{lang === "eng"? "Hi 👋, I'm Julian" : "Hi 👋, Ich bin Julian"}</h1>
            <p>{startContent[0][lang as "eng" || "ger"]}</p>
        </div>
        <div className='skill-container'>
            <div className='category-container'>
                <SkillCard skill='React' type='react' />
                
                <SkillCard skill='Vite.js' type='vite' />
            </div>
            <div className='category-container'>
                <SkillCard skill='three.js' type='three' />
                
                <SkillCard skill='TypeScript' type='typescript' />
                <SkillCard skill='jQuery' type='jquery' />
                
                <SkillCard skill='HTML' type='html' />
                <SkillCard skill='JavaScript' type='js' />
                <SkillCard skill='Axios' type='axios' />
            </div>
            <div className='category-container'>
                <SkillCard skill='SASS' type='sass' />
                <SkillCard skill='CSS' type='css' />
                <SkillCard skill='Bootstrap' type='bootstrap' />
            </div>
            <div className='category-container'>
                <SkillCard skill='php' type='php' />
                <SkillCard skill='SQL' type='sql' />
            </div>
            <div className='more-skills'>
                <p onClick={handleMoreSkills}>
                    {lang === "eng"? "Other skills" : "Andere Skills"} 
                    <i className={`fa-solid fa-caret-up ${plusskills? "turned" : ""}`} />
                </p>
                {plusskills &&
                    <div className={`category-container unfold`}>
                        <SkillCard skill='Photoshop' type='photoshop'/>
                        <SkillCard skill='Inkscape' type='bw' />
                        <SkillCard skill='Davinci Resolve' type='davinci'/>
                        <SkillCard skill='Gimp' type='gimp'/>
                        <SkillCard skill='Unreal Engine' type='bw'/>
                        <SkillCard skill='Blender' type='blender'/>
                    </div>
                }
            </div>
        </div>
    </div>
  )
}

export default AboutMe