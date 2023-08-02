import { dbSkillSecType, dbSkillcardType } from "../../../../types/types"
import { DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors, closestCenter, DragEndEvent } from "@dnd-kit/core"
import { SortableContext, horizontalListSortingStrategy, arrayMove } from "@dnd-kit/sortable"
import APskillItem from "./APskillItem"
import "../../../../styles/css/APskills.css"
import { useContext, useEffect, useState } from "react"
import { arrEquals } from "../../../../helperfunctions"
import Button from "../../../Button"
import { LangContext } from "../../../../App"
import ChangeFlag from "../ChangeFlag"

type skillProps = {
    name: string,
    sections: dbSkillcardType[][],
    hidden: dbSkillcardType[][],
    id: number
}


function APskills({ name, sections, hidden, id }: skillProps) {
    const [list, setList] = useState(sections)
    const [delList, setDelList] = useState(new Map<number, boolean>())
    const [otherList, setOtherList] = useState(hidden)
    const [delOtherList, setDelOtherList] = useState(new Map<number, boolean>())
    const { lang } = useContext(LangContext)

    const firstChange = !arrEquals(sections, list)
    const secondChange = !arrEquals(hidden, otherList)
    const anyChanges = firstChange || secondChange

    const sensors = useSensors(
        useSensor(PointerSensor)
    )


    function handleDragEnd1(e: DragEndEvent) {
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
                        if (index !== changeArrIndex) {
                            result.push(elem)
                        } else {
                            result.push(changeArray)
                        }
                    })

                    if (result[0] !== undefined) {
                        return result
                    } else {
                        return prev
                    }
                })
            }
        }
    }

    function handleDragEnd2(e: DragEndEvent) {
        //this function can currenty only handle changes in the same row
        const { active, over } = e

        const oldId = active.id as number
        let newId: number

        if (over) {
            newId = over.id as number

            if (newId && oldId !== newId) {
                setOtherList(prev => {
                    const changeArrIndex = Math.floor(oldId / 1000)
                    const oldIndex = oldId - (changeArrIndex * 1000)
                    const newIndex = newId - (changeArrIndex * 1000)
                    let changeArray = arrayMove(prev[changeArrIndex], oldIndex, newIndex)
                    let result: dbSkillcardType[][] = []
                    prev.forEach((elem, index) => {
                        if (index !== changeArrIndex) {
                            result.push(elem)
                        } else {
                            result.push(changeArray)
                        }
                    })

                    if (result[0] !== undefined) {
                        return result
                    } else {
                        return prev
                    }
                })
            }
        }
    }


    function resetRow(index: number, original: dbSkillcardType[][], dispatch: React.Dispatch<React.SetStateAction<dbSkillcardType[][]>>) {
        dispatch(prev => {
            let result = [...prev]
            result[index] = original[index]
            return result
        })
    }

    function deleteRow(index: number, dispatch: React.Dispatch<React.SetStateAction<Map<number, boolean>>>) {
        //complete deletion approach:
        /* dispatch(prev => {
            const previous = [...prev]
            if (index === 0) {
                return previous.slice(1)
            } else {
                let result = previous.slice(0, index - 1) //all rows before current row
                const lastElems = previous.slice(index)
                lastElems.forEach(elem => {
                    result.push(elem)
                })
                return result
            }
        }) */

        //"marking" deleted row:
        dispatch(prev => {
            let result = new Map(prev)
            result.set(index, true)
            return result
        })
    }

    function recoverRow(index: number, dispatch: React.Dispatch<React.SetStateAction<Map<number, boolean>>>) {
        dispatch(prev => {
            let result = new Map(prev)
            result.set(index, false)
            return result
        })
    }

    function addRow(dispatch: React.Dispatch<React.SetStateAction<dbSkillcardType[][]>>) {
        dispatch(prev => {
            let result = [...prev]
            result.push([])
            console.log("result:", result)
            return result
        })
    }

    function reset(dispatch: React.Dispatch<React.SetStateAction<dbSkillcardType[][]>>, original: dbSkillcardType[][]){
        dispatch(original)
    }

    useEffect(() => {
        console.log(list)
    }, [list])




    return (
        <div className={`apcSection apSkills scaleIn`} style={{ animationDelay: `${id * 0.05}s` }}>
            <ChangeFlag changes={anyChanges} />

            <h2>
                {name.replaceAll("_", " ")}
                {anyChanges &&
                    <Button
                        title={lang === "eng" ? "Reset every row" : "Setze die gesamten Zeilen zurück"}
                        onClick={() => {reset(setList, sections); reset(setOtherList, hidden)}}
                    >
                        <i className="fa-solid fa-arrow-rotate-left" />
                    </Button>
                }
            </h2>

            <h3>
                {lang === "eng" ? "Exposed" : "Offengelegt"}
                {firstChange &&
                    <Button
                        title={lang === "eng" ? "Reset all below rows" : "Setze alle Zeilen hierunter zurück"}
                        onClick={() => reset(setList, sections)}
                    >
                        <i className="fa-solid fa-arrow-rotate-left" />
                    </Button>
                }
            </h3>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd1}
            >
                {
                    list.map((sec, i) => {
                        const ids = sec.map((item, index) => i * 1000 + index) //allows up to 999 items
                        const changed = !arrEquals(sec, sections[i])
                        return (
                            <div className={`skillsLayout ${changed ? "changed" : ""} ${delList.get(i) ? "delete" : ""}`}>
                                <Button
                                    className="recoverBtn"
                                    title={lang === "eng" ? "Recover row" : "Reihe wieder einfügen"}
                                    onClick={() => recoverRow(i, setDelList)}
                                >
                                    <i className="fa-solid fa-turn-up" />
                                </Button>

                                <Button
                                    className="trashBtn"
                                    title={lang === "eng" ? "Delete row" : "Reihe löschen"}
                                    onClick={() => deleteRow(i, setDelList)}
                                >
                                    <i className="fa-solid fa-trash" />
                                </Button>

                                <Button
                                    buttonStyle="btn--dark"
                                    className={`rstBtn ${changed ? "" : "inactive"} ${sections[i] ? "" : "inactiveInvis"}`}
                                    title={lang === "eng" ? "Reset row" : "Reihe zurücksetzen"}
                                    onClick={() => resetRow(i, sections, setList)}
                                >
                                    <i className="fa-solid fa-arrow-rotate-left" />
                                </Button>

                                <div className={`skillsRow ${changed ? "changed" : ""}`}>
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

                                    <Button
                                    >
                                        +
                                    </Button>
                                </div>
                            </div>
                        )
                    })
                }
            </DndContext>

            <Button
                className="addRowBtn"
                title={lang === "eng" ? "Add row" : "Reihe hinzufügen"}
                onClick={() => addRow(setList)}
            >
                <i className="fa-solid fa-plus"></i>
            </Button>


            <h3>
                {lang === "eng" ? "Hidden" : "Eingeklappt"}
            </h3>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd2}
            >
                {
                    otherList.map((sec, i) => {
                        const ids = sec.map((item, index) => i * 1000 + index) //allows up to 999 items
                        const changed = !arrEquals(sec, hidden[i])
                        return (
                            <div className={`skillsLayout ${changed ? "changed" : ""}`}>
                                <Button
                                    className="trashBtn"
                                    title={lang === "eng" ? "Delete row" : "Reihe löschen"}
                                    onClick={() => deleteRow(i, setDelOtherList)}
                                >
                                    <i className="fa-solid fa-trash" />
                                </Button>

                                <Button
                                    buttonStyle="btn--dark"
                                    className={changed ? "" : "inactive"}
                                    title={lang === "eng" ? "Reset row" : "Reihe zurücksetzen"}
                                    onClick={() => resetRow(i, hidden, setOtherList)}
                                >
                                    <i className="fa-solid fa-arrow-rotate-left" />
                                </Button>

                                <div className={`skillsRow ${changed ? "changed" : ""}`}>
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
                                    <Button>
                                        +
                                    </Button>
                                </div>
                            </div>
                        )
                    })
                }
            </DndContext>

            <Button className="addRowBtn">
                <i className="fa-solid fa-plus"></i>
            </Button>

        </div>
    )
}

export default APskills