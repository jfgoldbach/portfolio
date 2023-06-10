import { useContext, useEffect, useRef, useState } from "react"
import { dbSkillcardType, indexTrackType } from "../../../../types/types"
import SkillCard from "../../../SkillCard"
import Button from "../../../Button"
import { skillstyleContext } from "../../../../App"
import useDragObject from "../../../hooks/useDragObject"
import useDragContainer from "../../../hooks/useDragContainer"

type dragdropProps = {
  list: any[],
  setParent: React.Dispatch<React.SetStateAction<dbSkillcardType[][] | undefined>>,
  parent: dbSkillcardType[][] | undefined,
  li: number,
  id: {mapIndex: number, startIndex?: number}
}

type dragobjProps = {
  name: string,
  type?: string,
  color?: string,
  back?: string,
  objID: number
}



function APdragdrop({ list, setParent, parent, li, id }: dragdropProps) {
  const [color, setColor] = useState("#000000")
  const [back, setBack] = useState("#ffffff")
  const [addName, setAddName] = useState("")


  const containerRef = useRef<HTMLDivElement>(null)
  const cardStyles = useContext(skillstyleContext)

  useEffect(() => {
    console.log("render APskillsSection")
  }, [])

  const [local, setLocal, changed,
    reset, clearSection, addItem, 
    removeItem, changedIndex] = useDragContainer(list, id, parent, setParent)



  function DragObj({ name, type, color, back, objID }: dragobjProps) {
    const dragRef = useRef<HTMLDivElement>(null)
    useDragObject(dragRef, containerRef, changedIndex, local, setLocal, `${li}_${id.mapIndex + (id.startIndex ?? 0)}`, objID)


    useEffect(() => {
      console.log("render DragObj")
    }, [])

    return (
      <SkillCard ref={dragRef} draggable noHover skill={name} type={type} color={color} back={back} >
        <Button className="deleteBtn" onClick={() => removeItem(objID)}>
          <i className="fa-solid fa-trash" title={`Delete item "${name}"`}></i>
        </Button>
      </SkillCard>
    )
  }



  //additional logic for this specific component:

  function changeColor(e: React.ChangeEvent<HTMLInputElement>) {
    setColor(e.target.value)
  }

  function changeBack(e: React.ChangeEvent<HTMLInputElement>) {
    setBack(e.target.value)
  }

  function changeByPreset(e: React.ChangeEvent<HTMLSelectElement>) {
    const preset = cardStyles[e.target.value]
    if (preset) {
      if (preset.color) setColor(preset.color)
      if (preset.back) setBack(preset.back)
    } else {
      console.error("A name for a preset class couldn't be found!")
    }
  }

  function changeAddName(e: React.ChangeEvent<HTMLInputElement>) {
    setAddName(e.target.value)
  }

  //add a new item to the local list based on input
  function addSkill() {
    console.log("add")
    if (local && (addName !== "")) {
      let valid = true
      for (let i = 0; i < local?.length; i++) {
        if (local[i].name === addName) {
          valid = false
          window.alert(`"${addName}" already exists in this row. \n Can't add another skill with the same name.`)
          setAddName("")
        }
      }
      if (valid) {
        addItem({ name: addName, color: color, back: back })
      }
    }
  }



  if (local) {
    return (
      <div className={`skillWrapper ${changed ? "changes" : ""}`} draggable>
        <Button className="deleteBtn" title="Delete whole row" onClick={clearSection}>
          <i className="fa-solid fa-trash"></i>
        </Button>

        <Button className={`changedBtn ${changed ? "" : "inactiveInvis"}`} onClick={reset}>
          <i className="fa-solid fa-arrow-rotate-right"></i>
        </Button>


        <div className={`category-container`} ref={containerRef} id={`dragCon${li}_${id.mapIndex + (id.startIndex ?? 0)}`}>
          {local.map((item, index) => <DragObj objID={index} name={item.name} type={item.class} color={item.color} back={item.back} />)}
          {local.length === 0 &&
            <div className="warnContainer" title="This row will be removed entirely when submiting changes.">
              <i className="fa-solid fa-triangle-exclamation"></i>
            </div>
          }
        </div>

        <div className="addContainer">


          <input type="text" placeholder="Name" value={addName} onChange={changeAddName} style={{ color: color, background: back }} />
          <div className="colorContainer">
            <label>
              Text
              <input value={color} onChange={changeColor} type="color" />
            </label>
            <label>
              Back
              <input type="color" value={back} onChange={changeBack} />
            </label>
          </div>

          <label className="presetSelector">
            Preset
            <select onChange={changeByPreset}>
              <option>-</option>
              {cardStyles && Object.keys(cardStyles).map(key => <option>{key}</option>)}
            </select>
          </label>
          <Button onClick={addSkill} className={addName !== "" ? "" : "inactive"}>
            +
          </Button>
        </div>



      </div>
    )
  } else {
    return null
  }
}

export default APdragdrop