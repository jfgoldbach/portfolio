import { useState, useEffect, useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
//import '/styles/css/NavBar.css'
import Button from './Button'
import Datenschutz from './Datenschutz'
import { LangContext } from '../App'
import ProjectBar from './ProjectBar'


type navProps = {
    contact: boolean
    setContact: React.Dispatch<React.SetStateAction<boolean>>
    daten: boolean
    setDaten: React.Dispatch<React.SetStateAction<boolean>>
    scroll: number
}

function NavBar(props: navProps) {
    const [click, setClick] = useState(false)
    const [button, setButton] = useState(true)
    const [totop, setTotop] = useState(false)
    const [flag, setFlag] = useState(true)
    const location = useLocation()
    const {lang, setLang} = useContext(LangContext)

    const path = useLocation()
    const pathMatches = path.pathname.match("\/webdev\/..*")


    useEffect(() => {
        window.addEventListener('resize', checkResize)
        document.addEventListener("click", clickedOnNav)

        function clickedOnNav(e: MouseEvent) {
            const target = e.target as Node
            const menu = document.getElementById("navMenu")
            const toggler = document.getElementById("menuToggle")
            if(target !== menu && target !== toggler && target.parentNode?.parentNode !== menu){
                setClick(false)
            }
        }

        return(() => {
            window.removeEventListener('resize', checkResize)
        })
    }, [])

    useEffect(() => {
      window.scrollTo(0,0)
    },[location])

    useEffect(() => {
        setTotop(props.scroll > 150)
    }, [props.scroll])

    const handleClick = () => {
        setClick(!click)
    }

    const navigationButtonPressed = () => {
        setClick(false)
    }

    const checkResize = () => {
        if(window.innerWidth <= 960){
            setButton(false);
        } else {
            setButton(true);
        }
    }
    

    const zoomClickHandler = () => {
        document.getElementById('zoomcontain')?.classList.remove('showFlex');
    }

    const contactHandler = () => {
        props.setContact(false)
    }

    const datenHandler = () => {
        props.setDaten(false)
    }

    const langHandler = () => {
        setFlag(!flag)
        setLang(lang === "eng" ? "ger" : "eng")
    }


  return (
    <>      
        <nav className='navbar'>
            <div className='navbar-container'>
                <Link to='/' className='navbar-logo' onClick={() => {navigationButtonPressed()}}>
                    <div className='logo-main'>
                        <img src="/images/jglogo.png" />
                        <div className='flex-col'>
                            <p style={{opacity: "0.85"}}>Julian</p>
                            <p style={{opacity: "0.65"}}>Goldbach</p>
                        </div>
                    </div>
                    <div className='logo-house'>
                        <i className='fa-solid fa-house'></i>
                    </div>
                </Link>

                <div className='menu-icon' onClick={handleClick} id="menuToggle">
                    <i className={click? 'fas fa-times' : 'fas fa-bars'} />
                </div>


                <ul className={click? 'nav-menu active' : 'nav-menu'} id="navMenu">
                    <li className='nav-item'>
                        <Link to='/webdev' className='nav-links' onClick={() => {navigationButtonPressed()}} id='link1'>
                            WebDev
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link to='/gamedev' className='nav-links' onClick={() => {navigationButtonPressed()}} id='link2'>
                            GameDev
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Button buttonStyle='btn--primary' path='/contact' onClick={() => {navigationButtonPressed()}}>{lang === "eng" ? "Contact" : "Kontakt"}</Button>
                    </li>
                    <li className='nav-item'>
                        <select className={`langSelect ${flag? "eng" : "ger"}`} onChange={langHandler}>
                            <option value="eng">🇬🇧</option>
                            <option value="ger">🇩🇪</option>
                        </select>
                    </li>
                </ul>
            </div>

            {/*This part is for the zoom-in images*/}
            <div id='zoomcontain' className='zoomimage-container' onClick={zoomClickHandler}>
                <div className='img-contain'>
                    <img id='zoomimage' className='zoomed-image' src='../images/DivBreakerDocs/levels.jpg'></img>
                    <i className="fa-solid fa-magnifying-glass-minus"></i>
                </div>
                <Button onClick={zoomClickHandler}>
                    <p>&times;</p>
                </Button>
            </div>
            
            {pathMatches && pathMatches.length > 0 &&
                <ProjectBar type="webdev" />
            }
            
            {/*Impressum & Datenschutzerklärung*/}
            <div className='contact-snap'>
            {(props.contact || props.daten) &&
                <div id='contact' className='impressum-container'>
                    {props.contact &&
                    <div className='info contact'>
                        <div className='contact-header'>
                            <h1>Impressum</h1>
                            <Button buttonStyle='btn--primary' onClick={contactHandler}>
                                <p>&times;</p>
                            </Button>
                        </div>
                        <div className="contact-info">
                            <h2>Angaben gemäß § 5 TMG</h2>
                            <p>Julian Goldbach</p>
                            <p>Residenzstraße 133a</p>
                            <p>13409 Berlin</p>
                        </div>
                        <div className="contact-info">
                            <h2>Kontakt</h2>
                            <p>E-Mail: kontakt@jfgoldbach.de </p>
                            <p>Telefon: +49 159 03789428</p>
                        </div>
                    </div>}
                    {props.daten &&
                        <div className='info datenschutz'>
                            <div className='contact-header'>
                                <h1>Datenschutzerklärung</h1>
                                <Button buttonStyle='btn--primary' onClick={datenHandler}>
                                    <p>&times;</p>
                                </Button>
                            </div>
                            <Datenschutz />
                        </div>
                    }
                </div>
                }

            </div>
        </nav>

        

        

        <a href='#' id="totop">
            <i className={`fa-solid fa-caret-up ${totop? "active" : ""}`}></i>
        </a>
    </>
  )
}

export default NavBar