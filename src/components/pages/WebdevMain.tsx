import { useContext, useEffect } from "react"
import { LangContext, OverviewContext } from "../../App"
import ProjectCards from "./ProjectCards"
import "./WebdevMain.css"
import "./subpages/Subpages.css"



function WebdevMain() {
  const {overview, error} = useContext(OverviewContext)
  const {lang} = useContext(LangContext)

  return (
    <div className="webdevPick-Outer">
        <div className="webdevPick-container">
          {overview.length !== 0 &&
            overview.map(item => {
              return <ProjectCards index={item.id} />
            })
          }
          {overview.length === 0 && !error.msg  &&
            <div className="dbLoad info-container">
              <img src="/images/loading.png" alt="loading" width={"10px"}></img>
              <p>{lang === "eng"  ? "Loading info from database..." : "Lade Informationen aus Datenbank..."}</p>
            </div>
          }
          { error.msg &&
            <div className="info-container mildWarn fetchError">
              <i className="fa-solid fa-triangle-exclamation" />
              <p>{`${lang === "eng" ? "Couldn't load data:" : "Konnte Daten nicht laden:"} ${error.msg} (${error.code})`}</p>
            </div>
          }
        </div>
    </div>
  )
}

export default WebdevMain