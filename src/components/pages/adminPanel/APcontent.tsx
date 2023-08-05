import { createContext, useContext, useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { LangContext, errorType } from "../../../App"
import instance from "../../network/axios"
import APdualang from "./APdualang"
import APinfo from "./APinfo"
import APnotes from "./DEPRECATEDnotes/APnotes"
import Loading from "../../helper/Loading"
import ErrorBoundary from "../../helper/ErrorBoundary"
import Button from "../../Button"
import { jwtPayload } from "../../../types/types"
import APskills from "./skillcards/APskills"
import APnoteCategories from "./APnoteCategories"
import { toast } from "react-toastify"
import { entriesToJson } from "../../../helperfunctions"

export type changesType = {
  [index: string]: {}
}

type changesContextType = {
  resetAll: boolean
  changesList: changesType
  setChangesList: React.Dispatch<React.SetStateAction<changesType>>
}

export const apChanges = createContext<changesContextType>({} as changesContextType)



function APcontent() {
  const { lang } = useContext(LangContext)
  const { content_id } = useParams()
  const [error, setError] = useState({} as errorType)
  const [content, setContent] = useState<{ [key: string]: any } | null>(null)
  const [display, setDisplay] = useState<any[] | null>(null)
  const [changesList, setChangesList] = useState<changesType>({} as changesType)
  const [diff, setDiff] = useState(0)
  const [resetAll, setResetAll] = useState(false)
  const [reloadActive, setReloadActive] = useState(false)
  const [admin, setAdmin] = useState(false)

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)


  useEffect(() => {
    const token = sessionStorage.getItem("jwt")
    if (token) {
      const payload: jwtPayload = JSON.parse(atob(token.split(".")[1]))
      if (payload.admin) {
        setAdmin(payload.admin)
      } else {
        console.error("Sent access token doesn't have the admin property in its payload.")
      }
    }
  }, [])


  useEffect(() => {
    setError({} as errorType)
    setContent(null)
    setReloadActive(false)
    getContent()
    if (timeoutRef.current) timeoutRef.current = null
  }, [content_id])


  useEffect(() => {
    if (content) {
      let iterable = []
      for (let key in content) {
        iterable.push({ ...content[key], "name": key }) //converts to array for easier use
      }
      setDisplay(iterable)
    } else {
      setDisplay(null)
    }
  }, [content])


  useEffect(() => {
    if (changesList) {
      const entries = Object.entries(changesList)
      let result = 0
      entries.forEach(entry => {
        result += Object.keys(entry[1]).length
      })
      setDiff(result)
    }
  }, [changesList])

  useEffect(() => {
    setResetAll(false)
  }, [resetAll])

  function getContent() {
    if (!timeoutRef.current) { //only load if we are not waiting for a timeout
      console.log("getContent")
      setContent(null)
      setError({} as errorType)
      instance.get(`?type=ap_content&page=${content_id}`, { headers: { "jwt": sessionStorage.getItem("jwt") } })
        .then(response => response.data)
        .then(result => {
          setContent(result)
          reloadTimeout()
        })
        .catch(error => {
          setError({ "msg": error.message, "code": error.code })
          reloadTimeout(1000)
        })
    }
  }

  function reloadTimeout(delay?: number) {
    const timeout = timeoutRef.current
    if (timeout) {
      clearTimeout(timeout)
    }
    setReloadActive(false)
    timeoutRef.current = setTimeout(() => {
      setReloadActive(true)
      timeoutRef.current = null
    }, delay ?? 5000)
  }


  function submitChanges() {
    if (admin) {
      instance.post(`?type=ap_update&row=${content_id}`, {
        headers:
        {
          jwt: sessionStorage.getItem("jwt"),
          changes: entriesToJson(Object.entries(changesList))
        }
      })
        .then(response => response.data)
        .then(result => toast.info(result))
        .catch(error => toast.error(error))
    }
  }

  function reset() {
    setResetAll(true) //impulse
  }

  function reload() {
    if (window.confirm(lang === "eng"
      ? `⚠ There ${diff > 1 ? "are" : "is"} ${diff} unsaved change${diff > 1 ? "s" : ""}.\nDo you want to continue?`
      : `⚠ ${diff} Änderung${diff > 1 ? "en" : ""} wurde${diff > 1 ? "n" : ""} noch nicht gespeichert.\nSoll neu geladen werden?`)) {
      getContent()
    }
  }


  return (
    <ErrorBoundary>
      <apChanges.Provider value={{ changesList, setChangesList, resetAll }}>
        <div className="apContent">
          {display ?
            <>
              {display.map((item, index) => {
                switch (item.type) {
                  case "dualang":
                    return <APdualang index={index} name={item.name} ger={item.ger} eng={item.eng} />

                  case "info_link":
                    return <APinfo index={index} path={item.path} ger={item.ger} eng={item.eng} />

                  case "skillcards":
                    return <APskills name={item.name} sections={item.sections} hidden={item.hidden} id={index} />

                  case "notepads":
                    return <APnoteCategories name={item.name} />
                }
              })}
            </>
            :
            !error.msg && <Loading />
          }
          {error.msg &&
            <div className="info-container mildWarn fetchError scaleIn">
              <i className="fa-solid fa-triangle-exclamation" />
              <p>{`${error.msg}: ${error.code}`}</p>
            </div>
          }
        </div>
      </apChanges.Provider>


      <div className={`apSubmitContainer`}>
        <div className={`apSubmitBox ${diff ? "active" : ""}`}>

          <Button
            className={`submitBtn ${admin ? "" : "forbidden"} ${diff > 0 ? "" : "inactive"}`}
            onClick={submitChanges}
            title={lang === "eng"
              ? (admin ? "Save changes to database" : "Cant save changes without admin privileges")
              : (admin ? "Änderungen in der Datenbank speichern" : "Für das speichern sind Adminprivilegien notwendig")}
          >
            {lang === "eng" ? "Save" : "Speichern"}
            {admin ?
              <i className="fa-solid fa-floppy-disk"></i>
              :
              <i className="fa-solid fa-ban"></i>
            }
            <div className={`submitCounter ${diff === 0 ? "inactiveInvis" : ""}`}>
              <p>{diff}</p>
            </div>
          </Button>

          <Button
            className={`${diff ? "" : "inactive"}`}
            onClick={reset}
          >
            {lang === "eng" ? "Reset all" : "Alles zurücksetzen"}
            <i className="fa-solid fa-arrow-rotate-left"></i>
          </Button>

          <Button
            className={`${reloadActive ? "" : "inactive"}`}
            onClick={reload}
          >
            {lang === "eng" ? "Reload" : "Neu laden"}
            <i className="fa-solid fa-rotate" />
          </Button>
        </div>
      </div>

    </ErrorBoundary>
  )
}

export default APcontent