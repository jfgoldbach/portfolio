import { useContext, useEffect, useState } from "react"
import { LangContext, skillstyleContext } from "../../../../App"
import { dbSkillcardType } from "../../../../types/types"
import APskillsSection from "./APskillsSection"
import { arrEquals } from "../../../../helperfunctions"
import Button from "../../../Button"
import { apChanges } from "../APcontent"

type skillProps = {
  name: string,
  sections: dbSkillcardType[][],
  hidden: dbSkillcardType[][],
  id: number
}

function APskillcards({ name, sections, hidden, id }: skillProps) {
  const { lang } = useContext(LangContext)
  const [secChanges, setSecChanges] = useState<dbSkillcardType[][]>()
  const [hidChanges, setHidChanges] = useState<dbSkillcardType[][]>()
  const [changed, setChanged] = useState(false)

  const { setChangesList } = useContext(apChanges)


  useEffect(() => {
    if (sections) {
      console.log("initial parent", sections, hidden)
      setSecChanges(sections)
      setHidChanges(hidden)
    }
  }, [])

  useEffect(() => {
    setChangesList(prev => {
      let newState = { ...prev }
      newState[`skills${id}`] = changed
      return newState
    })
  }, [changed])

  useEffect(() => {
    console.log("parent changes", secChanges, hidChanges)
    /* if (submitRef.current && secChanges && hidChanges) {
      submitRef.current[name] = { type: "skillcards", sections: [...secChanges], hidden: [...hidChanges] }
    } */
  }, [secChanges, hidChanges])


  useEffect(() => {
    if (secChanges && hidChanges) {
      setChanged(!arrEquals([...sections, ...hidden], [...secChanges, ...hidChanges]))
    }
  }, [secChanges, hidChanges])


  function addSec() {
    setSecChanges(prev => {
      if (prev) {
        let newPrev = [...prev]
        newPrev.push([])
        return newPrev
      } else {
        return prev
      }
    })
  }

  function addHid() {
    setHidChanges(prev => {
      if (prev) {
        let newPrev = [...prev]
        newPrev.push([])
        return newPrev
      } else {
        return prev
      }
    })
  }


  return (
    <div className="apcSection apcSkills scaleIn" style={{ animationDelay: `${id * 0.05}s` }}>
      <h2 className={changed ? "changes" : ""}>
        {changed &&
          <i className="fa-solid fa-pen"></i>
        }
        {lang === "eng" ? "Skills" : "Fähigkeiten"}
      </h2>
      <div className="skillsContainer">

        {secChanges && secChanges.map((sec, index) => {
          return <APskillsSection
            list={sec}
            li={id}
            id={{ mapIndex: index }}
            setParent={setSecChanges}
            parent={secChanges}
          />

        })}
        <Button onClick={addSec}>
          +
        </Button>

        <>
          <h3>{lang === "eng" ? "Folded:" : "Versteckt:"}</h3>
          {hidChanges && hidChanges.map((sec, index) => {
            return <APskillsSection
              list={sec}
              li={id}
              id={{ mapIndex: index, startIndex: sections.length }}
              setParent={setHidChanges}
              parent={hidChanges}
            />
          })}
          <Button onClick={addHid}>
            +
          </Button>
        </>

      </div>
    </div>
  )
}

export default APskillcards