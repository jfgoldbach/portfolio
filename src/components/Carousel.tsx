import React, { useState, useEffect, useContext, useRef } from 'react'
import '../styles/css/Carousel.css'
//import '/styles/css/App.css'
//import '/styles/css/Subpages.css'
import { Link } from 'react-router-dom'
import { LangContext, OverviewContext, overviewType } from '../App'
import { CarouselCard } from './frontpage/CarouselCard'
import Button from './Button'
import { homeContext, introContext } from './pages/Home'



function Carousel() {
  const [position, setPosition] = useState(0)
  const [activewindow, setActiveWindow] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const [speed, setSpeed] = useState(8000)
  const [video, setVideo] = useState(true)
  const [stop, setStop] = useState(false)
  const [pause, setPause] = useState(false)
  const [settings, setSettings] = useState(false)
  const [hint, setHint] = useState(false)
  const [hand, setHand] = useState(true)
  const circleRef = useRef<SVGCircleElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const [projects, setProjects] = useState<overviewType>([])

  const progressRef = useRef<SVGSVGElement>(null)
  const progrStartRef = useRef<number | null>(null)
  const timeLeftRef = useRef<number>(8000)

  const { lang } = useContext(LangContext)
  const { overview, error } = useContext(OverviewContext)
  const homeContent = useContext(homeContext)
  const { finished, setFinished } = useContext(introContext)

  const classes = ['img-front', 'img-middle img-middle-left', 'img-back img-back-left', 'img-back img-back-right', 'img-middle img-middle-right']

  useEffect(() => {
    setProjects(overview.slice(0, 5))
  }, [overview])


  useEffect(() => {
    //read values from local storage
    const carouSpeed = localStorage.getItem("carouSpeed")
    const carouVideo = localStorage.getItem("carouVideo")
    const carouStop = localStorage.getItem("carouStop")
    if (carouSpeed) setSpeed(Number(carouSpeed))
    if (carouVideo) setVideo(carouVideo === "true")
    if (carouStop) setStop(carouStop === "true")

    //intro timeout
    setTimeout(() => {
      setFinished(true)
      if (!carouStop) {
        carouTimeout()
      }
    }, 3700)

    //check if tab is active
    const visChange = document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        setActiveWindow(false)
      } else {
        setActiveWindow(true)
      };
    })

    //change scrolled state when scolled too far down
    const scrollCheck = document.addEventListener('scroll', () => {
      setScrolled(window.scrollY > 150 && !scrolled)
      setHint(prev => {
        if (prev) return !(window.scrollY > 50)
        else return prev
      })
      if (hintCheck && window.scrollY > 50) {
        clearTimeout(hintCheck)
        hintCheck = undefined
      }
    })

    //closes settings when clicked anywhere else
    document.addEventListener('click', outsideClick)

    let hintCheck: NodeJS.Timeout | undefined
    const showHint = sessionStorage.getItem("scrollHint")
    if (!showHint || (showHint && showHint === "true")) {
      hintCheck = setTimeout(() => {
        setHint(true)
      }, 20000)
    }

    function outsideClick(e: MouseEvent) {
      const target = e.target as Node
      const form = document.getElementById('carouselSettings')

      if (target !== form && target !== document.getElementById('setbtn') && target.nodeName !== "INPUT" && target.nodeName !== "LABEL") {
        setSettings(false)
      }
    }

    return (() => {
      document.removeEventListener("click", outsideClick)
    })
  }, [])


  useEffect(() => {
    console.log("speed", speed)
    //if (speed !== 8000) localStorage.setItem("carouSpeed", Number.prototype.toString(speed))
    carouTimeout() //resets carousel timeout and adds one with new speed value
    if (circleRef.current) {
      circleRef.current.style.animationDuration = `${speed / 1000}s`
    }
  }, [speed])


  useEffect(() => {
    localStorage.setItem("carouStop", stop ? "true" : "false")
    const progress = circleRef.current
    if (progress) {
      if (stop) {
        progress.classList.remove("anim")
      } else {
        progress.classList.add("anim")
      }
    }
    if (stop) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    } else {
      carouTimeout()
    }
  }, [stop])


  useEffect(() => {
    console.log("timeoutRef", timeoutRef.current)
    const progress = circleRef.current

    if (pause) {
      if (progress) {
        //set style to current computed state
        const progressStyle = window.getComputedStyle(progress)
        progress.style.strokeDasharray = progressStyle.getPropertyValue("stroke-dasharray")
        progress.style.strokeDashoffset = progressStyle.getPropertyValue("stroke-dashoffset")
        progress.classList.remove("anim")
        
        if(progrStartRef.current) { //calculate remaining time
          const remaining = speed - (Date.now() - progrStartRef.current)
          timeLeftRef.current = remaining
          console.log("remaining time:", remaining)
          progress.style.animationDuration = `${remaining / 1000}s`
        }
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = undefined
      }

    } else {
      if (progress) {
        progress.classList.add("anim")
      }
      carouTimeout(timeLeftRef.current)
      progrStartRef.current = Date.now() - (speed - timeLeftRef.current) //re-adjust starting time for proper calculations
    }
  }, [pause])




  useEffect(() => {
    //change classes when "position" has changed
    const progress = circleRef.current
    if (progress) {
      //reset to original style
      progress.classList.remove("anim")
      progress.style.animationDuration = `${speed / 1000}s`
      progress.style.strokeDasharray = "1px, 200px"
      progress.style.strokeDashoffset = "-60px"
    }

    carouTimeout()
    console.log("position:", position)
    if (projects.length !== 0) {
      for (let i = 0; i < 5; i++) {
        const pos = position + i
        pos < 5
          ? pos >= 0
            ? (document.getElementById(`pic${i}`) as HTMLElement).className = classes[pos]
            : (document.getElementById(`pic${i}`) as HTMLElement).className = classes[pos + 5]
          : (document.getElementById(`pic${i}`) as HTMLElement).className = classes[pos - 5];
        if (scrolled) {
          document.getElementById(`pic${i}`)?.classList.add("blackwhite");
        }
      }
    }

    setTimeout(() => {
      if (progress) progress.classList.add("anim")
    }, 5);

  }, [position])

  //change to black and white and pause video if scrolled
  useEffect(() => {
    for (let i = 0; i < 5; i++) {
      let video = document.getElementById(`vid${i}`) as HTMLVideoElement;
      if (scrolled) {
        setPause(true)
        document.getElementById(`pic${i}`)?.classList.add("blackwhite");
        if (video) {
          video.pause();
        }
      } else {
        setPause(false)
        document.getElementById(`pic${i}`)?.classList.remove("blackwhite");
        if (video) {
          video.play();
        }
      }
    }
  }, [scrolled])

  //change if videos should be visible
  useEffect(() => {
    localStorage.setItem("carouVideo", video ? "true" : "false")
    if (video) {
      for (let i = 0; i < 5; i++) {
        let vid = document.getElementById(`vid${i}`)
        if (vid) {
          vid.classList.remove('display-none');
        }
      }
    } else {
      for (let i = 0; i < 5; i++) {
        let vid = document.getElementById(`vid${i}`)
        if (vid) {
          vid.classList.add('display-none');
        }
      }
    }
  }, [video])


  function carouTimeout(value?: number) {
    console.log("carouTimeout")
    const TO_Val = timeoutRef.current
    if (TO_Val) {
      clearTimeout(TO_Val) //clears timeout once a speed is passed in, so that a new timeout wont overlap
    }
    progrStartRef.current = Date.now() //writes down time to be used for pausing (maybe implement this function as a class??)
    timeoutRef.current = setTimeout(() => {
      if (circleRef.current) {
        circleRef.current.classList.remove("anim")
        circleRef.current.style.animationDuration = `${speed / 1000}s`
      }
      rotateCarousel()
    }, value ?? speed)
  }


  //change position if tab is active
  function rotateCarousel() {
    console.log("rotate carousel")
    if (activewindow && !scrolled && !stop) {
      console.log("position for rotateCarousel:", position)
      position > 0
        ? setPosition(position - 1)
        : setPosition(4)
    }
  }

  const handleSettings = () => {
    setSettings(prev => !prev)
  }

  const handleSlider = (e: any) => {
    setSpeed(e.target.value * 1000)
  }

  const handleNoVid = () => {
    setVideo(!video);
  }

  const handleStop = () => {
    setStop(!stop);
  }

  const resetSpeed = () => {
    setSpeed(8000);
  }

  const clickWave = () => {
    setHand(prev => !prev)
  }

  const removeHint = () => {
    setHint(false)
    sessionStorage.setItem("scrollHint", "false")
  }



  return (
    <div className='carousel-container'>
      <div className={`introduction ${finished ? "active" : ""}`} />

      <div className={`hero-main ${!finished ? "intro" : ""}`}>
        <div className="presentation" onClick={() => setFinished(true)}>

          {homeContent &&
            <div className="presText">
              <h1>
                {homeContent?.heading[lang]}
                <div
                  className={`friendlyWave ${hand ? "active" : ""}`}
                  onClick={clickWave}
                  title={lang === "eng" ? hand ? "Remove it please!" : "I want the waving hand back!" : hand ? "Bitte entferne es!" : "Ich möchte die winkende Hand zurück!"}
                >
                  <img src="/images/hand.png" className="hand" />
                  {!hand &&
                    <img src="/images/thumb.png" className="thumb" />
                  }
                </div>
              </h1>
              <h2 className="title" data-title={homeContent?.subheading[lang]}>{homeContent?.subheading[lang]}</h2>
              <div className="presBtns">
                <Button buttonSize='btn--large' path="/webdev">Web Projekte</Button>
                <Button buttonSize='btn--large' path="/gamedev" buttonStyle='btn--outline'>Game Projekte</Button>
              </div>
            </div>
          }
          {/* <div className={`scrollHint ${hint ? "active" : ""}`}>
            <div
              className="scrollHint-Wrapper"
              title={lang === "eng" ? `Got it!\nRemove this hint!` : `Ok!\nEntferne diesen Hinweis!`}
              onClick={removeHint}
            >
              <i className="fa-solid fa-computer-mouse"></i>
              <i className="fa-solid fa-arrow-down"></i>
            </div>
          </div> */}
        </div>

        <div className="project-previews">
          <div className='setbtn-container'>
            {error.msg &&
              <div className='greeting-container'>
                <div className="info-container mildWarn fetchError">
                  <i className="fa-solid fa-triangle-exclamation" />
                  <p>{`${lang === "eng" ? "Couldn't load data for Carousel:" : "Konnte Daten für das Karussell nicht laden: "} ${error.msg} (${error.code})`}</p>
                  <Button title="Reload page" onClick={() => window.location.reload()}>
                    <i className="fa-solid fa-rotate"></i>
                  </Button>
                </div>
              </div>
            }

            <form id="carouselSettings" className={`settings-form ${settings ? "showSettings" : ""}`}>
              <label htmlFor='stop'>{lang === "eng" ? "Stop Carousel" : "Karussell stoppen"}
                <input id='stop' checked={stop} type="checkbox" onChange={handleStop} />
              </label>
              <label htmlFor='preview'>{lang === "eng" ? "Show video preview" : "Video Vorschau anzeigen"}
                <input id="preview" type="checkbox" checked={video} defaultChecked onChange={handleNoVid} />
              </label>
              <div className='form-slider'>
                <label
                  htmlFor='range'
                  className='slider-label'
                  title='Click to reset speed'
                  onClick={resetSpeed}
                >
                  {lang === "eng" ? "Slide speed:" : "Wechsel-Dauer:"}
                  <p>{`${speed / 1000}s`}</p>
                </label>
                <input id="range" type="range" min='1' max='30' value={speed / 1000} onChange={handleSlider} />
              </div>
            </form>

            <div className={`progress-container ${(stop && finished) ? "" : "active"}`}>
              <svg ref={progressRef} height="26" width="26" viewBox="12 12 26 30" className={`progressAnim ${stop ? "" : "active"}`}>
                <circle
                  className="track"
                  cx="26"
                  cy="26"
                  r="10"
                  strokeWidth="6"
                />
                <circle
                  className="progress"
                  ref={circleRef}
                  style={{ animationDuration: `${speed / 1000}s` }}
                  cx="26"
                  cy="26"
                  r="10"
                  strokeWidth="7"
                />
              </svg>
            </div>

            <i className={`fa-solid fa-video-slash vidIco ${video ? "" : "active"}`} />
            <i className={`fa-solid fa-stop vidIco ${stop ? "active" : ""}`} />

            {overview.length !== 0 &&
              <button
                className={`carouSet-btn ${settings ? "settings-active" : ""}`}
                title='Change behaviour of the carousel'
                onClick={handleSettings}
                id='setbtn'
              >
                <i className="fa-solid fa-gear"></i>
              </button>
            }
          </div>

          {/*Carousel cards*/}
          <div className='img-container noDivIn'>

            {/* (projects.length > 0 && projects[0] !== undefined ) &&
        projects.map((project, index) =>
            <figure
              className={classes[index]}
              id={`pic${index}`}
              onClick={() => { setPosition(5 - index) }}
              data-title={project.name}
            >
              <img src={project.thumbnail} alt={project.name} />
              {project.video !== "" &&
                <video src={project.video} loop muted autoPlay playsInline id={`vid${index}`}></video>
              }
            </figure>
            )
            */}

            {[0, 0, 0, 0, 0].map((i, index) =>
              <CarouselCard project={projects[index]} index={index} setPosition={setPosition} />
            )}

            {projects.length !== 0 &&
              <Link
                to={projects[position === 0 ? 0 : 5 - position].link}
                className="projectLink"
                onMouseEnter={() => setPause(true)}
                onMouseLeave={() => setPause(false)}
              >
                <i className="fa-regular fa-folder-open" />
              </Link>
            }

          </div>
        </div>
      </div>




    </div>

  )
}

export default Carousel