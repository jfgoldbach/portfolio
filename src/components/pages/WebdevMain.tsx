import { useContext, useEffect } from "react"
import { LangContext, OverviewContext } from "../../App"
import ProjectCards from "./ProjectCards"
import Loading from "../helper/Loading"
import ErrorInfo from "../helper/ErrorInfo"
//import "/styles/css/WebdevMain.css"
//import "/styles/css/subpages/Subpages.css"



function WebdevMain() {
  const { overview, error } = useContext(OverviewContext)

  return (
    <div className="webdevPick-Outer">
      <div className="webdevPick-container">
        <div className="blurBackground">
          <div className="object1"></div>
          <div className="object3"></div>
          <div className="object2"></div>
          <div className="blurer"></div>
        </div>
        {overview.length !== 0 &&
          overview.map(item => {
            let index = overview.findIndex(proj => proj.id === item.id)
            return <ProjectCards key={index} index={index + 1} className="scaleIn" />
          })
        }

        {overview.length === 0 && !error.msg &&
          <Loading />
        }
      </div>
      {error.msg &&
        <ErrorInfo />

      }
    </div>
  )
}

export default WebdevMain