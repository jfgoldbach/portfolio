import { Outlet, useLocation } from 'react-router-dom'
//import '/styles/css/App.css'
//import "/styles/css/WebDev.css"
import ParticleCode from '../visuals/ParticleCode'
import $ from "jquery"
import { useContext, useEffect } from 'react'
import { LangContext } from '../../App'


type webProps = {
  scroll: number
}


function WebDev(props: webProps) {
  const location = useLocation()
  const {lang} = useContext(LangContext)
  const title = lang === "eng" ? "Web projects | Julian Goldbach" : "Web Projekte | Julian Goldbach"

  useEffect(() => {
    const metaIcon: HTMLLinkElement = document.getElementById("icon") as HTMLLinkElement
    if (metaIcon) {
      metaIcon.href = "/images/favicon_webdev.ico"
    }
    document.title = title
  }, [])

  useEffect(() => {
    document.title = title
  }, [location])

  return (
    <div className='webdev-container'>
      <Outlet />

      {(location.pathname !== "/webdev" && ($(window).width() || 0) > 1000) &&
        <ParticleCode
          id={3} startPosition={"-100px"} endPosition={"80vh"}
          duration={20000} emitters={2} spawnRate={4000}
          fixed
        />
      }
      {(location.pathname !== "/webdev" && ($(window).width() || 0) < 1000) &&
        <ParticleCode
          id={4} startPosition={"-75px"} endPosition={"70vh"}
          duration={20000} emitters={1} spawnRate={4000}
          width={50} fixed
        />
      }

    </div>
  )
}

export default WebDev