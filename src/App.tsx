import './App.css';
import NavBar from './components/NavBar';
import {BrowserRouter as Router, Routes, Route, useLocation} from 'react-router-dom';
import Home from './components/pages/Home'
import Contact from './components/pages/Contact'
import WebDev from './components/pages/WebDev'
import GameDev from './components/pages/GameDev'
import Footer from './components/Footer';
import DemandPick from './components/DemandPick';
import NotFound from './components/NotFound';
import UnderConstruction from './components/pages/UnderConstruction';
import Subpage from './components/pages/subpages/Subpage';
import { Suspense, useEffect, useState } from 'react';
import { LangContext } from './components/context/LangContext';



function App() {
  const [contact, setContact] = useState(false)
  const [daten, setDaten] = useState(false)
  const [scroll, setScroll] = useState(0)
  const [lang, setLang] = useState("eng")

  useEffect(() => {
    document.addEventListener("scroll", () => {
      setScroll(window.scrollY)
    })
  })

  return (
    <Router>
      <LangContext.Provider value={{lang, setLang}}>
        <NavBar scroll={scroll} contact={contact} setContact={setContact} daten={daten} setDaten={setDaten} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/contact' element={<Contact />} />

          <Route path='/webdev' element={<WebDev scroll={scroll} />}>
            <Route index element={<DemandPick />}></Route>
            <Route path='calculator' element={<Subpage index={1} />}></Route>
            <Route path='divbreaker' element={<Subpage index={2} />}></Route>
            <Route path='ecommerce' element={<Subpage index={3} />}></Route>
            <Route path='diced' element={<Subpage index={4} />}></Route>
            <Route path='thissite' element={<Subpage index={5} />}></Route>
            <Route path='apartment' element={<Subpage index={6} />}></Route>
          </Route>

          <Route path='/gamedev' element={<UnderConstruction />}>
            <Route index element={<DemandPick />}></Route>
          </Route>

          <Route path='*' element={<NotFound />}></Route>
        </Routes>
        <Footer setContact={setContact} setDaten={setDaten} />
      </LangContext.Provider>
    </Router>
  );
}

export default App;
