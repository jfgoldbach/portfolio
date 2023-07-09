import { useContext } from 'react'
import { LangContext } from '../../App'
import '../styles/css/UnderConstruction.css'

function UnderConstruction() {
  const {lang} = useContext(LangContext)

  return (
    <div className='construction-container'>
        <div className='message'>
            <i className="fa-solid fa-screwdriver-wrench"></i>
            <span>{lang === "eng" ? "Under construction!" : "In Entwicklung!"}</span>
        </div>
    </div>
  )
}

export default UnderConstruction