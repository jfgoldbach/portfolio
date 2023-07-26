import { useEffect } from "react"
import { dbSkillcardType } from "../../../types/types"
import SkillCard from "../../SkillCard"

type skillProps = {
    name: string,
    sections: dbSkillcardType[][],
    hidden: dbSkillcardType[][],
    id: number
}


function APskills({ name, sections, hidden, id }: skillProps) {


    return (
        <div className="apcSection scaleIn" style={{ animationDelay: `${id * 0.05}s` }}>
            <h2>{name.replaceAll("_", " ")}</h2>

        {
            sections.map((sec, i) => {
                return sec.map((skill, y) => {
                    return <SkillCard skill={skill.name} type={skill.class} />
                })
            })
        }
            

        </div>
    )
}

export default APskills