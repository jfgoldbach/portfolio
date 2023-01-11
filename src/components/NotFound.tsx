import { useContext } from 'react'
import { LangContext, OverviewContext } from '../App'
import Loading from './helper/Loading'
//import '/styles/css/NotFound.css'

function NotFound() {
  const {lang} = useContext(LangContext)
  const {overview} = useContext(OverviewContext)

  const no = true

  return (
    <div className='notfound-container'>
    {overview.length === 0 ?
      <Loading />
      :
      <div className='message'>
          <i className="fa-solid fa-file-circle-question"></i>
          <span>{lang === "eng" ? "Page not found!" : "Seite nicht gefunden!"}</span>
      </div>
    }
    </div>
  )
}

export default NotFound