import React, {useState, useEffect, useContext} from 'react'
import './Carousel.css'
import '../App.css'
import './pages/subpages/Subpages.css'
import { Link } from 'react-router-dom'
import { LangContext, OverviewContext, overviewType } from '../App'



function Carousel() {
  const [position, setPosition] = useState(0)
  const [activewindow, setActiveWindow] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const [speed, setSpeed] = useState(6000)
  const [video, setVideo] = useState(true)
  const [stop, setStop] = useState(false)

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
    document.addEventListener('click', e => {
      const target = e.target as Node
      if(!document.getElementById('carouselSettings')?.contains(target) && !document.getElementById('setbtn')?.contains(target)){
        if(document.getElementById('carouselSettings')?.classList.contains('showSettings')){
          document.getElementById('carouselSettings')?.classList.remove('showSettings');
          document.getElementById('setbtn')?.classList.remove('settings-active');
        }
      }
    })
  }, [])


  //change classes when "position" has changed
  useEffect(() => {
    console.log(position)
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
    if(document.getElementById('carouselSettings')?.classList.contains('showSettings')){
      document.getElementById('carouselSettings')?.classList.remove('showSettings');
      document.getElementById('setbtn')?.classList.remove('settings-active');
    } else {
      document.getElementById('carouselSettings')?.classList.add('showSettings');
      document.getElementById('setbtn')?.classList.add('settings-active');
    }
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
        <h1 className='title'>Web {lang === "eng" ? "developer" : "Entwickler"}</h1>
        <h2 className='describtion'>{lang === "eng" ? "I like to create interesting webapps, enjoyable games and more:" : "Ich erstelle interessante webapps, unterhaltsame Spiele und mehr:"}</h2>
      </div>


      <div className='setbtn-container'>

        {overview.length === 0 && !error.msg &&
          <div className="greeting-container">
            <div className='greeting'>
              <p>{lang === "eng" ? "Welcome!" : "Willkommen!"}</p>
            </div>
          </div>
        }
        {error.msg &&
          <div className='greeting-container'>
            <div className="info-container mildWarn fetchError">
              <i className="fa-solid fa-triangle-exclamation" />
              <p>{`${lang === "eng" ? "Couldn't load data for Carousel:" : "Konnte Daten für das Karussell nicht laden:"} ${error.msg} (${error.code})`}</p>
            </div>
          </div>
        }


        <form id="carouselSettings" className='settings-form'>
          <label htmlFor='stop'>{lang === "eng" ? "Stop Carousel" : "Karussell stoppen"}
            <input id='stop' type="checkbox" onChange={handleStop}/>
          </label>
          <label htmlFor='preview'>{lang === "eng" ? "Show video preview" : "Video Vorschau anzeigen"}
            <input id="preview" type="checkbox" defaultChecked onChange={handleNoVid}/>
          </label>
          <div className='form-slider'>
            <label htmlFor='preview' className='slider-label' title='Click to reset speed' onClick={resetSpeed}>{lang === "eng" ? "Slide speed:" : "Wechsel-Dauer:"}
              <p>{`${speed/1000}s`}</p>
            </label>
            <input type="range" min='1' max='30' value={speed/1000} onChange={handleSlider} />
          </div>
        </form>

        {overview.length !== 0 &&
          <button className='carouSet-btn' title='Change behaviour of the carousel' onClick={handleSettings} id='setbtn'>
            <i className="fa-solid fa-gear"></i>
          </button>
        }

      </div>
      

        {/*Carousel FOR THE FUTURE: Should reflect the right order based on priority*/}
      <div className='img-container'>
      
      {(projects.length > 0 && projects[0] !== undefined ) &&
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
      }
    
        
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