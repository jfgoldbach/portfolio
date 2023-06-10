import { createContext, useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { errorType } from "../../../App"
import instance from "../../network/axios"
import APdualang from "./APdualang"
import APinfo from "./APinfo"
import APnotes from "./notes/APnotes"
import APskillcards from "./skills/APskillcards"
import Loading from "../../helper/Loading"
import ErrorBoundary from "../../helper/ErrorBoundary"
import Button from "../../Button"
import { jwtPayload } from "../../../types/types"

type changesType = {
  [index: string]: boolean
}

type changesContextType = {
  changesList: changesType,
  setChangesList: React.Dispatch<React.SetStateAction<changesType>>,
  submitRef: React.MutableRefObject<{[index: string]: {}}>
}

export const apChanges = createContext<changesContextType>({} as changesContextType)

function APcontent() {
  const { content_id } = useParams()
  const [error, setError] = useState({} as errorType)
  const [content, setContent] = useState<{ [key: string]: any } | null>(null)
  const [display, setDisplay] = useState<any[] | null>(null)
  const [changesList, setChangesList] = useState<changesType>({} as changesType)
  const [diff, setDiff] = useState(false)
  const [admin, setAdmin] = useState(false)

  const submitRef = useRef<{[index: string]: {}}>({}) //this ref is solely for submitting the changes


  useEffect(() => {
    const token = sessionStorage.getItem("jwt")
    if (token) {
      const payload: jwtPayload = JSON.parse(atob(token.split(".")[1]))
      if (payload.admin) {
        setAdmin(payload.admin)
      } else {
        console.error("Send access token doesn't have the admin property in its payload.")
      }
    }
  }, [])


  useEffect(() => {
    setError({} as errorType)
    setContent(null)
    setDiff(false)
    instance.get(`?type=ap_content&page=${content_id}`, { headers: { "jwt": sessionStorage.getItem("jwt") } })
      .then(response => response.data)
      .then(result => setContent(result))
      .catch(error => setError({ "msg": error.message, "code": error.code }))
  }, [content_id])


  useEffect(() => {
    if (content) {
      let iterable = []
      for (let key in content) {
        iterable.push({ ...content[key], "name": key }) //converts to array for easier use
      }
      setDisplay(iterable)
      submitRef.current = content
    } else {
      setDisplay(null)
    }
  }, [content])


  useEffect(() => {
    console.log("effect")
    if (changesList) {
      const keys = Object.keys(changesList)
      //check if an section object is marked as true (= changed)
      for (let i = 0; i < keys.length; i++) {
        if (changesList[keys[i]]) {
          console.log("set true")
          setDiff(true)
          break
        }
        if (i >= keys.length - 1) {
          console.log("set false")
          setDiff(false)
        }
      }
    }
  }, [changesList])


  function getChangesAmount() {
    const keys = Object.keys(changesList)
    let result = 0
    for(let i = 0; i < keys.length; i++){
      if(changesList[keys[i]]){
        result++
      }
    }
    return result
  }

  function submitChanges() {
    instance.post(`?type=ap_update&row=${content_id}`, { headers: { "jwt": sessionStorage.getItem("jwt"), "content": submitRef.current } })
      .then(response => response.data)
      .then(result => window.alert(result))
      .catch(error => window.alert(error))
  }



  return (
    <>
      <ErrorBoundary>
        <apChanges.Provider value={{ changesList, setChangesList, submitRef }}>
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
                      return <APskillcards name={item.name} sections={item.sections} hidden={item.hidden} id={index} />

                    case "notepads":
                      return <APnotes name={item.name} notes={item.notes} id={index} />
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
      </ErrorBoundary>


      <div className={`apSubmitContainer ${diff ? "active" : ""}`}>
        <div className={`apSubmitBox ${diff ? "active" : ""}`}>
          <Button>
            Reset all
            <i className="fa-solid fa-rotate"></i>
          </Button>
          <Button className={`submitBtn ${admin ? "" : "forbidden"}`} onClick={submitChanges}>
            Submit &#40;{getChangesAmount()}&#41;
            {admin ?
              <i className="fa-solid fa-database"></i>
              :
              <i className="fa-solid fa-ban"></i>
            }

          </Button>
        </div>
      </div>

    </>
  )
}

export default APcontent