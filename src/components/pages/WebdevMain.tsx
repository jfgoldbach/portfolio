import { useContext, useEffect, useRef } from "react"
import { LangContext, OverviewContext } from "../../App"
import ProjectCards from "./ProjectCards"
import Loading from "../helper/Loading"
import "../../styles/css/WebdevMain.css"
import ErrorInfo from "../helper/ErrorInfo"



function WebdevMain() {
  const { overview, error } = useContext(OverviewContext)
  const containerRef = useRef<HTMLDivElement>(null)

  function calcWidth() {
    const container = containerRef.current
    if (container) {
      const columns = Math.floor((window.innerWidth - 60) / 410) //devided by card width plus gap (almost always one gap too many)
      const style = `${(columns * 350) + ((columns) * 30)}px`
      container.style.width = `${(columns * 350) + ((columns - 1) * 30)}px`
    }
  }

  useEffect(() => {
    calcWidth()
    window.addEventListener('resize', calcWidth)

    return(() => {
      window.removeEventListener('resize', calcWidth)
    })
  }, [])

  return (
    <div
      className="pick-Outer"
    >
      <div
        ref={containerRef}
        className={`pick-container ${overview.length < 5 ? "oneLine" : ""}`}
      >

        {overview.length !== 0 &&
          overview.map(item => {
            let index = overview.findIndex(proj => proj.id === item.id)
            return <ProjectCards key={index} index={index + 1} className="scaleIn" />
          })
        }

        {overview.length === 0 && error.length === 0 &&
          <Loading />
        }
      </div>
      {error.length > 0 &&
        <ErrorInfo />
      }
    </div>
  )
}

export default WebdevMain