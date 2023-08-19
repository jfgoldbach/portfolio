import { useContext, useEffect } from "react"
import { LangContext, OverviewContext } from "../../App"
import ProjectCards from "./ProjectCards"
import Loading from "../helper/Loading"
import BlurredBg from "../visuals/BlurredBg"
import "../../styles/css/WebdevMain.css"
import ErrorInfo from "../helper/ErrorInfo"



function WebdevMain() {
  const { overview, error } = useContext(OverviewContext)

  return (
    <div className="pick-Outer">
      <BlurredBg />
      <div className={`pick-container ${overview.length < 5 ? "oneLine" : ""}`}>
        
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