import { useContext } from 'react'
import { LangContext } from '../App'
import './DemandPick.css'

function DemandPick() {
  const {lang} = useContext(LangContext)

  return (
    <div className='demand-click-container'>
        <div className='sign'>
            <span>{lang === "eng" ? "Choose a project" : "Wähle ein Projekt aus"}</span>
            <i className="fa-solid fa-arrow-turn-up"></i>
        </div>
    </div>
  )
}

export default DemandPick