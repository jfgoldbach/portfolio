import { useContext } from 'react'
import { LangContext } from '../App'
import './NotFound.css'

function NotFound() {
  const {lang} = useContext(LangContext)

  return (
    <div className='notfound-container'>
        <div className='message'>
            <i className="fa-solid fa-file-circle-question"></i>
            <span>{lang === "eng" ? "Page not found!" : "Seite nicht gefunden!"}</span>
        </div>
    </div>
  )
}

export default NotFound