import { useState, useEffect, useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Button from '../Button'
import Datenschutz from '../Datenschutz'
import { LangContext } from '../../App'
import ProjectBar from '../ProjectBar'
import LangChange from './LangChange'
import '../../styles/css/NavBar.css'
import Imprint from './Imprint'


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
    const location = useLocation()
    const { lang } = useContext(LangContext)

    const path = useLocation()
    const pathMatches = path.pathname.match("\/webdev\/..*")


    useEffect(() => {
        window.addEventListener('resize', checkResize)
        document.addEventListener("click", clickedOnNav)

        function clickedOnNav(e: MouseEvent) {
            const target = e.target as Node
            const menu = document.getElementById("navMenu")
            const toggler = document.getElementById("menuToggle")
            if (target !== menu && target !== toggler && target.parentNode?.parentNode !== menu) {
                setClick(false)
            }
        }

        return (() => {
            window.removeEventListener('resize', checkResize)
        })
    }, [])

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [location])

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
        if (window.innerWidth <= 960) {
            setButton(false);
        } else {
            setButton(true);
        }
    }


    const zoomClickHandler = () => {
        const container = document.getElementById('zoomcontain')
        const img = document.getElementById("zoomimage")
        if (container && img) {
            img.classList.add("fadeOut")
            container.classList.add("fadeOut")
            setTimeout(() => {
                container.classList.remove('showFlex')
                img.classList.remove("fadeOut")
                container.classList.remove("fadeOut")
            }, 150);
        }
    }

    function closeWindow() {
        props.setDaten(false)
        props.setContact(false)
    }


    return (
        <>
            <nav 
                className={`
                    navbar 
                    ${location.pathname.match(/\/changer/) ? "loginChange" : ""} 
                    ${location.pathname.match(/\/loggedin/) ? "adminPanel" : ""}
                    ${click? "clicked" : ""}
                `}
            >
                
                <div className={`navbar-container loginChange`}>
                    <Link to='/' className='navbar-logo' onClick={() => { navigationButtonPressed() }}>
                        <div className='logo-main'>
                            <img src="/images/jglogo.png" />
                        </div>
                        <div className='logo-house'>
                            <i className='fa-solid fa-house'></i>
                        </div>
                    </Link>

                    <div className='menu-icon' onClick={handleClick} id="menuToggle">
                        <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
                    </div>


                    <ul className={click ? 'nav-menu active' : 'nav-menu'} id="navMenu">
                        <li className='nav-item'>
                            <Link
                                to='/webdev'
                                className={`nav-links ${location.pathname === "/webdev" ? "active" : ""}`}
                                onClick={() => { navigationButtonPressed() }}
                                id='link1'
                            >
                                <p>Web</p>
                            </Link>
                        </li>
                        <li className='nav-item'>
                            <Link
                                to='/gamedev'
                                className={`nav-links ${location.pathname === "/gamedev" ? "active" : ""}`}
                                onClick={() => { navigationButtonPressed() }}
                                id='link2'
                            >
                                <p>Gaming</p>
                            </Link>
                        </li>
                        <li className='nav-item' id="contactBtn">
                            <Link
                                to='/contact'
                                className={`nav-links ${location.pathname === "/contact" ? "active" : ""}`}
                                onClick={() => { navigationButtonPressed() }}
                                title={lang === "eng" ? "Contact" : "Kontakt"}
                            >
                                <p>{lang === "eng" ? "Contact" : "Kontakt"}</p>
                            </Link>
                        </li>
                        <li className='nav-item' id="langSelect">
                            <LangChange />
                        </li>
                    </ul>
                </div>

                {/*This part is for the zoom-in images*/}
                <div id='zoomcontain' className='zoomimage-container' onClick={zoomClickHandler}>
                    <div className='img-contain'>
                        <img 
                            id='zoomimage' 
                            className='zoomed-image' 
                            src='../images/DivBreakerDocs/levels.jpg' 
                        />
                        <i className="fa-solid fa-magnifying-glass-minus"></i>
                    </div>
                </div>

                {pathMatches && pathMatches.length > 0 &&
                    <ProjectBar type="webdev" />
                }

                {/*Impressum & Datenschutzerklärung*/}
                <div className='contact-snap'>
                    {(props.contact || props.daten) &&
                        <div id='contact' className='impressum-container'>
                            <div className='info'>
                                <div className='contact-header'>
                                    <h1>{props.contact? "Impressum" : "Datenschutzerklärung"}</h1>
                                    <Button buttonStyle='btn--primary' onClick={closeWindow}>
                                        <p>&times;</p>
                                    </Button>
                                </div>
                                {props.contact ?
                                    <Imprint />
                                    :
                                    <Datenschutz />
                                }
                            </div>
                        </div>
                    }

                </div>

                <div className="navExtra">
                    <Button path='/changer' title="Login">
                        <i className="fa-solid fa-right-to-bracket" />
                    </Button>
                </div>
            </nav>
        </>
    )
}

export default NavBar