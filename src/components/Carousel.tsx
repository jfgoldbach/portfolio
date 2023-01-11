import React, {useState, useEffect, useContext} from 'react'
//import '/styles/css/Carousel.css'
//import '/styles/css/App.css'
//import '/styles/css/Subpages.css'
import { Link } from 'react-router-dom'
import { LangContext, OverviewContext, overviewType } from '../App'
import { CarouselCard } from './frontpage/CarouselCard'
import Button from './Button'



function Carousel() {
  const [position, setPosition] = useState(0)
  const [activewindow, setActiveWindow] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const [speed, setSpeed] = useState(6000)
  const [video, setVideo] = useState(true)
  const [stop, setStop] = useState(false)
  const [settings, setSettings] = useState(false)

  const [projects, setProjects] = useState<overviewType>([])
  

  const {lang} = useContext(LangContext)
  const {overview, error} = useContext(OverviewContext)

  //const classes2 = ['img-back img-back-left', 'img-middle img-middle-left', 'img-front', 'img-middle img-middle-right', 'img-back img-back-right']
  const classes = ['img-front', 'img-middle img-middle-left', 'img-back img-back-left', 'img-back img-back-right', 'img-middle img-middle-right']

  useEffect(() => {
    setProjects(overview.slice(0,5))
  }, [overview])

  //change position every few seconds
  useEffect(() => {
    const interval = setInterval(
      rotateCarousel,
      speed);
    return() => clearInterval(interval)
  })


  useEffect(() => {
    //check if tab is active
    const visChange = document.addEventListener('visibilitychange', () => {
      if(document.hidden){
        setActiveWindow(false)
      } else {
        setActiveWindow(true)
      };
    })

    //change scrolled state when scolled too far down
    const scrollCheck = document.addEventListener('scroll', () => {
      setScrolled(window.scrollY > 150 && !scrolled)
    })

    //closes settings when clicked anywhere else
    document.addEventListener('click', outsideClick)

    function outsideClick (e: MouseEvent) {
      const target = e.target as Node
      const form = document.getElementById('carouselSettings')
    
      if(target !== form  && target !== document.getElementById('setbtn') && target.nodeName !== "INPUT" && target.nodeName !== "LABEL"){
        setSettings(false)
      }
    }

    return(() => {
      document.removeEventListener("click", outsideClick)
    })
  }, [])


  //change classes when "position" has changed
  useEffect(() => {
    //console.log(position)
    if(projects.length !== 0){
      for(let i = 0; i<5; i++){
        const pos = position + i
        pos<5
          ? pos >= 0
            ? (document.getElementById(`pic${i}`) as HTMLElement).className = classes[pos]
            : (document.getElementById(`pic${i}`) as HTMLElement).className = classes[pos+5]
          : (document.getElementById(`pic${i}`) as HTMLElement).className = classes[pos-5];
        if(scrolled){
          document.getElementById(`pic${i}`)?.classList.add("blackwhite");
        }
      }
    }
  }, [position])

  //change to black and white and pause video if scrolled
  useEffect(() => {
    for(let i= 0; i<5; i++){
      let video = document.getElementById(`vid${i}`) as HTMLVideoElement;
      if(scrolled){
        document.getElementById(`pic${i}`)?.classList.add("blackwhite");
        if(video){
          video.pause();
        }
      } else {
        document.getElementById(`pic${i}`)?.classList.remove("blackwhite");
        if(video){
          video.play();
        }
      }
    }
  }, [scrolled])

  //change if videos should be visible
  useEffect(() => {
    if(video){
      for(let i = 0; i<5; i++){
        let vid = document.getElementById(`vid${i}`)
        if(vid){
          vid.classList.remove('display-none');
        }
      }
    } else {
      for(let i = 0; i<5; i++){
        let vid = document.getElementById(`vid${i}`)
        if(vid){
          vid.classList.add('display-none');
        }
      }
    }
  }, [video])

  //change position if tab is active
  const rotateCarousel = () => {
    if(activewindow && !scrolled && !stop){
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
    setSpeed(6000);
  }



  return (
    <div className='carousel-container'>      
      <div className='introduction'>
        <h1 className='title' data-title={`Web ${lang === "eng" ? "developer" : "Entwickler"}`}>
          Web {lang === "eng" ? "developer" : "Entwickler"}
        </h1>
        <h2 className='describtion' data-shadow={lang === "eng" ?  "I like to create webapps and games" : "Ich erstelle webapps und Spiele"}>
          {lang === "eng" ? "I like to create webapps and games" : "Ich erstelle webapps und Spiele"}
        </h2>
      </div>


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

        <form id="carouselSettings" className={`settings-form ${settings? "showSettings" : ""}`}>
          <label htmlFor='stop'>{lang === "eng" ? "Stop Carousel" : "Karussell stoppen"}
            <input id='stop' type="checkbox" onChange={handleStop}/>
          </label>
          <label htmlFor='preview'>{lang === "eng" ? "Show video preview" : "Video Vorschau anzeigen"}
            <input id="preview" type="checkbox" defaultChecked onChange={handleNoVid}/>
          </label>
          <div className='form-slider'>
            <label htmlFor='range' className='slider-label' title='Click to reset speed' onClick={resetSpeed}>{lang === "eng" ? "Slide speed:" : "Wechsel-Dauer:"}
              <p>{`${speed/1000}s`}</p>
            </label>
            <input id="range" type="range" min='1' max='30' value={speed/1000} onChange={handleSlider} />
          </div>
        </form>

        {overview.length !== 0 &&
          <button 
            className={`carouSet-btn ${settings? "settings-active" : ""}`} 
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
      
      {/*(projects.length > 0 && projects[0] !== undefined ) &&
        projects.map((project, index) =>
          <figure
            className={classes[index]}
            id={`pic${index}`} 
            onClick={() => {setPosition(5 - index)} } 
            data-title={project.name}
            >
            <img src={project.thumbnail} alt={project.name} />
            {project.video !== "" &&
              <video src={project.video} loop muted autoPlay playsInline id={`vid${index}`}></video>
            }
          </figure>
        )
      */}
    
      {[0,0,0,0,0].map((i, index) => 
        <CarouselCard project={projects[index]} index={index} setPosition={setPosition} />
      )}
        
      {projects.length !== 0 &&
        <Link to={projects[position === 0 ? 0 : 5 - position].link} className="projectLink">
          <i className="fa-regular fa-folder-open" />
        </Link>
      }

      </div>

    </div>
    
  )
}

export default Carousel