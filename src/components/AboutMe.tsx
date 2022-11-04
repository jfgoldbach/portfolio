import { useState } from 'react'
import './AboutMe.css'
import SkillCard from './SkillCard'

function AboutMe() {
    const [plusskills, setPlusSkills] = useState(false)

    const handleMoreSkills = () => {
        setPlusSkills(!plusskills)
        console.log (plusskills)
    }

  return (
    <div className='main-container'>
        <div className='text-container'>
            <h1>Hi 👋, I'm Julian</h1>
            <p>Since i started to use computers i got quickly interested in creating things. 
                My journey first started with blender, then i got hooked in game development and not much later i started to create websites.
                I'm always excited to dive into new technologies and explore them. My skills are wide-ranged from 3D-modelling to photography, programming and more.</p>
        </div>
        <div className='skill-container'>
            <div className='category-container'>
                <SkillCard skill='React' type='react' />
                <SkillCard skill='three.js' type='three' />
                <SkillCard skill='Bootstrap' type='bootstrap' />
                <SkillCard skill='TypeScript' type='typescript' />
                <SkillCard skill='jQuery' type='jquery' />
                <SkillCard skill='CSS' type='css' />
                <SkillCard skill='SQL' type='sql' />
                <SkillCard skill='HTML' type='html' />
                <SkillCard skill='JavaScript' type='js' />
            </div>
            <div className='more-skills'>
                <p onClick={handleMoreSkills}>
                    Other skills 
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