import { dbSkillSecType, dbSkillcardType } from "../../../../types/types"
import { DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors, closestCenter, DragEndEvent } from "@dnd-kit/core"
import { SortableContext, horizontalListSortingStrategy, arrayMove } from "@dnd-kit/sortable"
import APskillItem from "./APskillItem"
import "../../../../styles/css/APskills.css"
import { useState } from "react"
import { arrEquals } from "../../../../helperfunctions"

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


    function handleDragEnd(e: DragEndEvent) {
        //this function can currenty only handle changes in the same row
        const { active, over } = e

        const oldId = active.id as number
        let newId: number

        if (over) {
            newId = over.id as number

            if (newId && oldId !== newId) {
                setList(prev => {
                    const changeArrIndex = Math.floor(oldId / 1000)
                    const oldIndex = oldId - (changeArrIndex * 1000)
                    const newIndex = newId - (changeArrIndex * 1000)
                    let changeArray = arrayMove(prev[changeArrIndex], oldIndex, newIndex)
                    let result: dbSkillcardType[][] = []
                    prev.forEach((elem, index) => {
                        if(index !== changeArrIndex){
                            result.push(elem)
                        } else {
                            result.push(changeArray)
                        }
                    })
                    
                    if(result[0] !== undefined){
                        return result
                    } else {
                        return prev
                    }
                })
            }
        }
    }



    return (
        <div className={`apcSection apSkills scaleIn`} style={{ animationDelay: `${id * 0.05}s` }}>
            <h2>{name.replaceAll("_", " ")}</h2>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                {
                    list.map((sec, i) => {
                        const ids = sec.map((item, index) => i * 1000 + index) //allows up to 999 items
                        return (
                            <div className={`skillsRow ${arrEquals(sec, sections[i])? "" : "changed"}`}>
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
                                                key={skill.name}
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