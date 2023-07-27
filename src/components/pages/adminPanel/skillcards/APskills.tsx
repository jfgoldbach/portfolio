import { dbSkillcardType } from "../../../../types/types"
import { DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors, closestCenter } from "@dnd-kit/core"
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable"
import APskillItem from "./APskillItem"
import "../../../../styles/css/APskills.css"
import { useState } from "react"

type skillProps = {
    name: string,
    sections: dbSkillcardType[][],
    hidden: dbSkillcardType[][],
    id: number
}


function APskills({ name, sections, hidden, id }: skillProps) {
    const [list, setList] = useState(sections)
    const [otherList, setOtherList] = useState(hidden)


    const sensors = useSensors(
        useSensor(PointerSensor)
    )

    return (
        <div className="apcSection apSkills scaleIn" style={{ animationDelay: `${id * 0.05}s` }}>
            <h2>{name.replaceAll("_", " ")}</h2>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
            >
                {
                    list.map((sec, i) => {
                        const ids = sec.map((item, index) => i * 1000 + index) //allows up to 999 items
                        return (
                            <div className="skillsRow">
                                <SortableContext
                                    items={ids}
                                    strategy={horizontalListSortingStrategy}
                                >
                                    {sec.map((skill, y) => {
                                        const id = i * 1000 + y
                                        return (
                                            <APskillItem
                                                skill={skill.name}
                                                type={skill.class}
                                                key={id}
                                                id={id}
                                            />
                                        )
                                    })}
                                </SortableContext>
                            </div>
                        )
                    })
                }
            </DndContext>

        </div>
    )
}

export default APskills