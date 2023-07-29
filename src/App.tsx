import './styles/css/Combined.css'

import 'react-toastify/dist/ReactToastify.css';

import NavBar from './components/NavBar/NavBar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/pages/Home'
import Contact from './components/pages/Contact'
import WebDev from './components/pages/WebDev'
import Footer from './components/Footer';
import NotFound from './components/NotFound';
import Subpage from './components/pages/subpages/Subpage';
import { createContext, useEffect, useState } from 'react';
import WebdevMain from './components/pages/WebdevMain';
import GamedevMain from './components/pages/GamedevMain';
import GameDev from './components/pages/GameDev';
import ModelViewer from './components/3d/ModelViewer';
import ChangerLogin from './components/pages/ChangerLogin';
import Changer from './components/pages/subpages/Changer';
import useCheckJWT from './components/hooks/useCheckJWT';
import instance from './components/network/axios';
import APcontent from './components/pages/adminPanel/APcontent';
import { ToastContainer, toast } from 'react-toastify';


type langProps = {
  lang: string,
  setLang: React.Dispatch<React.SetStateAction<string>>
}

export type projectType = {
  id: number,
  name: string,
  info: string,
  link: string,
  thumbnail: string,
  video: string,
  skillcards: {
    name: string,
    type: string
  }[],
  description: {
    eng: string,
    ger: string
  },
  priority: number
}

export type overviewType = {
  id: number,
  name: string,
  info: string,
  link: string,
  thumbnail: string,
  video: string,
  skillcards: {
    name: string,
    type: string
  }[],
  description: {
    eng: string,
    ger: string
  },
  priority: number
}[]

export type cardStyleType = {
  [index: string]: {
    class?: string,
    color?: string,
    back?: string
  }
}

export type errorType = {
  msg: string,
  code: string
}

type overviewProps = {
  overview: overviewType,
  gameOverview: overviewType,
  error: errorType
}

type readyProps = {
  ready: boolean,
  setReady: React.Dispatch<React.SetStateAction<boolean>>
}


export const LangContext = createContext<langProps>({} as langProps)
export const OverviewContext = createContext<overviewProps>({} as overviewProps)
export const ReadyContext = createContext<readyProps>({} as readyProps)
export const skillstyleContext = createContext<cardStyleType>({})

function App() {
  //console.log(instance)
  console.log("render app")
  const [contact, setContact] = useState(false)
  const [daten, setDaten] = useState(false)
  const [scroll, setScroll] = useState(0) //remove

  const [lang, setLang] = useState("eng")
  const [overview, setOverview] = useState<overviewType>([])
  const [gameOverview, setGameOverview] = useState<overviewType>([])
  const [cardStyle, setCardStyle] = useState<cardStyleType>({})
  const [error, setError] = useState<errorType>({} as errorType)
  const [ready, setReady] = useState(false)

  const { check } = useCheckJWT()


  useEffect(() => {
    /* async function testCall() {
      const response = await fetch("http://192.168.178.101:8000/api/?type=test")
      console.log(response)
    }

    testCall() */

    document.documentElement.style.setProperty("--initialHeight", `${window.innerHeight}px`)

    window.addEventListener("resize", updateVPsize)
    function updateVPsize() {
      document.documentElement.style.setProperty("--viewportHeight", `${window.innerHeight}px`)
    }

    updateVPsize() //initialize

    //set or read language
    const language = localStorage.getItem("language")
    if (language) {
      setLang(language === "ger" ? "ger" : "eng")
    } else {
      switch (navigator.language) {
        case "de":
          setLang("ger")
          localStorage.setItem("language", "ger")
          toast.info("Sprache auf Deutsch gesetzt", {
            autoClose: 3500
          })
          break;
        default:
          setLang("eng")
          localStorage.setItem("language", "eng")
          toast.info(`Initially set the language to english (your browser: ${navigator.language})`, {
            autoClose: 3500
          })
      }
    }


    check //check for non expired jwt or request a new one
      .then(() => {
        setReady(true) //intial set of jwt, so that other components know about it

      })
      .catch(error => {
        console.error(error)
        setError({ "msg": error, "code": "" })
      })

    return (() => {
      window.removeEventListener("resize", updateVPsize)
      //sessionStorage.removeItem("jwt")
    })
  }, [])

  useEffect(() => {
    //console.log("ready", ready)
    if (ready) {
      instance.get("?type=style&name=skillcards", { headers: { "jwt": sessionStorage.getItem("jwt") } })
        .then(response => response.data)
        .then(result => setCardStyle(result))
        .catch(error => setError({ "msg": error.message, "code": error.code })) //not really ideal!!!

      instance.get("?type=all_overview", { headers: { "jwt": sessionStorage.getItem("jwt") } })
        .then(response => response.data)
        .then(result => setOverview(result))
        .catch(error => setError({ "msg": error.message, "code": error.code }))

      instance.get("?type=game_overview", { headers: { "jwt": sessionStorage.getItem("jwt") } })
        .then(response => response.data)
        .then(result => setGameOverview(result))
        .catch(error => setError({ "msg": error.message, "code": error.code })) //not really ideal!!!
    }
  }, [ready])


  useEffect(() => {
    if (error.msg) toast.warn(`${error.msg}`)
    console.warn(error)
  }, [error])


  return (
    <Router>
      <LangContext.Provider value={{ lang, setLang }}>
        <OverviewContext.Provider value={{ overview, error, gameOverview }}>
          <ReadyContext.Provider value={{ ready, setReady }}>
            <skillstyleContext.Provider value={cardStyle} >
              <NavBar scroll={scroll} contact={contact} setContact={setContact} daten={daten} setDaten={setDaten} />
              <Routes>
                <Route path='/' element={<Home appError={error} />} />
                <Route path='/contact' element={<Contact />} />

                <Route path='/webdev' element={<WebDev scroll={scroll} />}>
                  <Route index element={<WebdevMain />}></Route>
                  {overview &&
                    <>
                      {overview.map(project => <Route path={project.link.replaceAll("webdev/", "")} element={<Subpage index={project.id} />} />)}
                    </>
                  }
                </Route>

                <Route path='/gamedev' element={<GameDev />}>
                  <Route index element={<GamedevMain />}></Route>
                  {gameOverview &&
                    <>
                      {gameOverview.map(project => <Route path={project.link.replaceAll("gamedev/", "")} element={<Subpage index={project.id} />} />)}
                    </>
                  }
                </Route>

                <Route path="/modelviewer" element={<ModelViewer />}></Route>

                <Route path="/changer">
                  <Route index element={<ChangerLogin />}></Route>
                  <Route path="loggedin" element={<Changer />}>
                    <Route path=":content_id" element={<APcontent />} />
                  </Route>
                </Route>

                <Route path='*' element={<NotFound />}></Route>
              </Routes>
              <Footer setContact={setContact} setDaten={setDaten} />
            </skillstyleContext.Provider>
          </ReadyContext.Provider>
        </OverviewContext.Provider>
      </LangContext.Provider>
      <ToastContainer position='top-right' />
    </Router>
  );
}

export default App;
