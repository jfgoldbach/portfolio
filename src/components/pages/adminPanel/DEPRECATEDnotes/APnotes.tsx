import { ChangeEvent, useContext, useEffect, useRef, useState } from "react"
import { LangContext } from "../../../../App"
import { dbNoteType, indexTrackType } from "../../../../types/types"
import useDragContainer from "../../../hooks/useDragContainer"
import useDragObject from "../../../hooks/useDragObject"
import ZoomImage from "../../../ZoomImage"
import Button from "../../../Button"
import { apChanges } from "../APcontent"

type notesType = {
  name: string,
  notes: dbNoteType[],
  id: number
}

type dragobjProps = {
  id: number | string
  index: number
  note: dbNoteType
}




function APnotes({ name, notes, id }: notesType) {
  const { lang } = useContext(LangContext)
  const { setChangesList } = useContext(apChanges)

  const changedIndex = useRef<indexTrackType>([null, null]) //old index, new index
  const containerRef = useRef<HTMLDivElement>(null)
  const localRef = useRef<dbNoteType[]>([])

  const [local, setLocal, changed,
    reset] = useDragContainer(notes, { mapIndex: id })


/*   useEffect(() => {
    console.log('%c Render APnotes.tsx', 'color: orange')
  }, []) */

  useEffect(() => {
    console.log("local changed")
    localRef.current = local
  }, [local])

  useEffect(() => {
    setChangesList(prev => {
      let newState = { ...prev }
      newState[`notes${id}`] = changed
      return newState
    })
    /* if (submitRef.current && local) {
      submitRef.current[name] = { type: "notepads", notes: [...local] }
    } */
  }, [changed])



  function DragObj({ id, index, note }: dragobjProps) {
    const dragRef = useRef<HTMLDivElement>(null)
    const [localNote, setLocalNote] = useState<dbNoteType>({ ...note })
    useDragObject(dragRef, containerRef, changedIndex, local, setLocal, id, index)

    
    useEffect(() => {
      if(localRef.current[index])
      console.log(localRef.current[index].description.ger)
    }, [localNote])

    function changeImage(e: ChangeEvent<HTMLInputElement>) {
      setLocalNote(prev => {
        let newLocal = { ...prev }
        newLocal.img = e.target.value
        return newLocal
      })
    }

    function changeLink(e: ChangeEvent<HTMLInputElement>) {
      setLocalNote(prev => {
        let newLocal = { ...prev }
        newLocal.path = e.target.value
        return newLocal
      })
    }

    function changeHeadGer(e: ChangeEvent<HTMLInputElement>) {
      setLocalNote(prev => {
        let newLocal = { ...prev }
        newLocal.heading.ger = e.target.value
        return newLocal
      })
    }

    function changeHeadEng(e: ChangeEvent<HTMLInputElement>) {
      setLocalNote(prev => {
        let newLocal = { ...prev }
        newLocal.heading.eng = e.target.value
        return newLocal
      })
    }

    function changeDescGer(e: ChangeEvent<HTMLTextAreaElement>) {
      setLocalNote(prev => {
        let newLocal = { ...prev }
        newLocal.description.ger = e.target.value
        return newLocal
      })
    }

    function changeDescEng(e: ChangeEvent<HTMLTextAreaElement>) {
      setLocalNote(prev => {
        let newLocal = { ...prev }
        newLocal.description.eng = e.target.value
        return newLocal
      })
    }



    if (localNote) {
      return (
        <div draggable className="dragobj draggable" ref={dragRef}>
          <h3>{index + 1}</h3>
          <div className="imgContainer">
            <ZoomImage source={`/${localNote.img}`} />
          </div>
          <div className="textContainer">
            <label>
              {lang === "eng" ? "Image source" : "Bildquelle"}
              <input
                className={localNote.img !== local[index].img ? "changed" : ""}
                type="text"
                value={localNote.img}
                onChange={changeImage}
              />
            </label>
            <label>
              <h4><div className="flag_ger" /> Heading</h4>
              <input
                className={localNote.heading.ger !== notes[index].heading.ger ? "changed" : ""}
                type="text"
                value={localNote.heading.ger}
                onChange={changeHeadGer}
              />
            </label>
            <label>
              <h4><div className="flag_eng" /> Heading</h4>
              <input
                className={localNote.heading.eng !== local[index].heading.eng ? "changed" : ""}
                type="text"
                value={localNote.heading.eng}
                onChange={changeHeadEng}
              />
            </label>
          </div>

          <div className="descrContainer">
            <h4>{lang === "eng" ? "Description" : "Beschreibung"}</h4>
            <div className="describtions">
              <label>
                <div className="flag_ger" />
                <textarea
                  className={localNote.description.ger !== local[index].description.ger ? "changed" : ""}
                  value={localNote.description?.ger}
                  onChange={changeDescGer}
                />
              </label>
              <label>
                <div className="flag_eng" />
                <textarea
                  className={localNote.description.eng !== local[index].description.eng ? "changed" : ""}
                  value={localNote.description?.eng}
                  onChange={changeDescEng}
                />
              </label>
            </div>

          </div>

          <label className={localNote.path !== local[index].path ? "changed" : ""} >
            {lang === "eng" ? "Path" : "Pfad"} <i>&#40;optional&#41;</i>
            <input type="text" value={localNote.path} onChange={changeLink} />
          </label>

        </div>

      )
    } else {
      return null
    }
  }


  return (
    <div className="apcSection apcNotes slide-in" style={{ animationDelay: `${id * 0.05}s` }}>
      <h2 className={changed ? "changes" : ""}>
        {changed &&
          <i className="fa-solid fa-pen"></i>
        }
        Notes
        {changed &&
          <Button onClick={reset} className="resetBtn">
            <i className="fa-solid fa-arrow-rotate-right"></i>
          </Button>
        }
      </h2>
      <div className="notesContainer" ref={containerRef} id={`dragCon${id}`}>
        {notes && notes.map((note, index) =>
          <DragObj
            note={note}
            index={index}
            id={id}
          />
        )
        }
      </div>
    </div>
  )
}

export default APnotes