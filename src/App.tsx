import './App.css';
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
  const [sorted, setSorted] = useState<overviewType>([])
  const [error, setError] = useState<errorType>({} as errorType)

  

  useEffect(() => {
    document.addEventListener("scroll", () => {
      setScroll(window.scrollY)
    })

    axios.get("http://jfgoldbach.de/api/?type=all_overview") //change url for production: jfgoldbach.de/api (dev: localhost:8000)
      .then(response => response.data)
      .then(result => setOverview(result))
      .catch(error => setError({"msg": error.message, "code": error.code}))
  }, [])


  //order projects by priority higher -> lower
  const sortResult = (result: overviewType) => {
    console.log(result)
      let order: overviewType = []
      let overCopy = result //copy result so that projects cant appear multiple times
      let prios = overCopy.map(project => project.priority) //all project priorities, unordered, duplicates possible
      for(let i = 0; i<result.length; i++){
        const highest = Math.max(...prios)
        const nextItem = overCopy.filter(project => project.priority === highest)[0] //getting only one project that has the highest priority still available
        overCopy.splice(prios.findIndex(e => e === highest), 1)
        order.push(nextItem)
        prios.splice(prios.findIndex(e => e === highest),1)
      }
      return(order)
  }

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
            <Route path='calculator' element={<Subpage index={1} scroll={scroll} />}></Route>
            <Route path='divbreaker' element={<Subpage index={2} scroll={scroll} />}></Route>
            <Route path='ecommerce' element={<Subpage index={3} scroll={scroll} />}></Route>
            <Route path='diced' element={<Subpage index={4} scroll={scroll} />}></Route>
            <Route path='thissite' element={<Subpage index={5} scroll={scroll} />}></Route>
            <Route path='apartment' element={<Subpage index={6} scroll={scroll} />}></Route>
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
