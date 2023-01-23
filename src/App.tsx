import './styles/css/Combined.css';
import './styles/css/AboutMe.css'
import './styles/css/Button.css'
import './styles/css/Cards.css'
import './styles/css/Carousel.css'
import './styles/css/CarouselCard.css'
import './styles/css/Contact.css'
import './styles/css/Datenschutz.css'
import './styles/css/DemandPick.css'
import './styles/css/Footer.css'
import './styles/css/Loading.css'
import './styles/css/MainSection.css'
import './styles/css/NavBar.css'
import './styles/css/NotFound.css'
import './styles/css/Overview.css'
import './styles/css/ParticleCode.css'
import './styles/css/ProjectBar.css'
import './styles/css/ProjectCards.css'
import './styles/css/ProjectThumbnail.css'
import './styles/css/SkillCard.css'
import './styles/css/Subpages.css'
import './styles/css/Tooltip.css'
import './styles/css/UnderConstruction.css'
import './styles/css/WebDev.css'
import './styles/css/WebdevMain.css'
import './styles/css/ZoomImage.css'

import NavBar from './components/NavBar';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './components/pages/Home'
import Contact from './components/pages/Contact'
import WebDev from './components/pages/WebDev'
import Footer from './components/Footer';
import DemandPick from './components/DemandPick';
import NotFound from './components/NotFound';
import UnderConstruction from './components/pages/UnderConstruction';
import Subpage from './components/pages/subpages/Subpage';
import { createContext, useEffect, useState } from 'react';
import WebdevMain from './components/pages/WebdevMain';
import axios from 'axios';


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

type errorType = {
  msg: string,
  code: string
}

type overviewProps = {
  overview: overviewType,
  error: errorType
}


export const LangContext = createContext<langProps>({} as langProps)
export const OverviewContext = createContext<overviewProps>({} as overviewProps)

function App() {
  const [contact, setContact] = useState(false)
  const [daten, setDaten] = useState(false)
  const [scroll, setScroll] = useState(0)

  const [lang, setLang] = useState("eng")
  const [overview, setOverview] = useState<overviewType>([])
  const [error, setError] = useState<errorType>({} as errorType)

  

  useEffect(() => {
    document.documentElement.style.setProperty("--initialHeight", `${window.innerHeight}px`)

    document.addEventListener("scroll", updateScroll)
    function updateScroll () {
      setScroll(window.scrollY)
    }

    window.addEventListener("resize", updateVPsize)
    function updateVPsize() {
      document.documentElement.style.setProperty("--viewportHeight", `${window.innerHeight}px`)
    }

    updateVPsize() //initialize

    axios.get("http://192.168.178.101:8000/?type=all_overview") //change url for production: jfgoldbach.de/api (dev: 192.168.178.101:8000)
      .then(response => response.data)
      .then(result => setOverview(result))
      .catch(error => setError({"msg": error.message, "code": error.code}))

    return(() => {
      document.removeEventListener("scroll", updateScroll)
      window.removeEventListener("resize", updateVPsize)
    })
  }, [])


  return (
    <Router>
      <LangContext.Provider value={{lang, setLang}}>
      <OverviewContext.Provider value={{overview, error}}>
        <NavBar scroll={scroll} contact={contact} setContact={setContact} daten={daten} setDaten={setDaten} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/contact' element={<Contact />} />

          <Route path='/webdev' element={<WebDev scroll={scroll} />}>
            <Route index element={<WebdevMain />}></Route>
            {overview &&
            <>
              {overview.map(project => <Route path={project.link.replaceAll("webdev/", "")} element={<Subpage index={project.id} scroll={scroll} />} />)}
            </>
            }
          </Route>

          <Route path='/gamedev' element={<UnderConstruction />}>
            <Route index element={<DemandPick />}></Route>
          </Route>

          <Route path='*' element={<NotFound />}></Route>
        </Routes>
        <Footer setContact={setContact} setDaten={setDaten} />
      </OverviewContext.Provider>
      </LangContext.Provider>
    </Router>
  );
}

export default App;
