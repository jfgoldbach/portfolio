import React, {useState, useEffect, useContext} from 'react'
import './Carousel.css'
import '../App.css'
import { Link } from 'react-router-dom'
import pageContent from "./pages/subpages/PageContent.json"
import { LangContext } from './context/LangContext'

function Carousel() {
  const [position, setPosition] = useState(0)
  const [activewindow, setActiveWindow] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const [speed, setSpeed] = useState(6000)
  const [video, setVideo] = useState(true)
  const [stop, setStop] = useState(false)
  const {lang, setLang} = useContext(LangContext)

  const links = ["webdev/diced", "webdev/ecommerce", "webdev/divbreaker", "webdev/calculator", "webdev/thissite"]
  const classes = ['img-back img-back-left', 'img-middle img-middle-left', 'img-front', 'img-middle img-middle-right', 'img-back img-back-right']
  const projects = [1, 2, 3, 4, 0]

  //change position every few seconds
  useEffect(() => {
    const interval = setInterval(
      rotateCarousel,
      speed);
    return() => clearInterval(interval)
  })

  //check if tab is active
  useEffect(() => {
    const visChange = document.addEventListener('visibilitychange', () => {
      if(document.hidden){
        setActiveWindow(false)
      } else {
        setActiveWindow(true)
      };
    })

    document.addEventListener('keydown', (e) => {
      switch(e.key){
        case 'ArrowRight':
          setPosition(position + 1);
          break;
        case 'ArrowLeft':
          setPosition(position - 1);
          break;
      };
    });
    
    document.addEventListener('scroll', () => {
      if(window.scrollY > 150 && !scrolled){
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    });

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
    for(let i = 0; i<5; i++){
      let pos = position + i
      pos<5
        ? (document.getElementById(`pic${1+i}`) as HTMLElement).className = classes[pos]
        : (document.getElementById(`pic${1+i}`) as HTMLElement).className = classes[pos-5];
      if(scrolled){
        document.getElementById(`pic${1+i}`)?.classList.add("blackwhite");
      }
    }
  }, [position])

  //change to black and white and pause video if scrolled
  useEffect(() => {
    for(let i= 0; i<5; i++){
      let video = document.getElementById(`vid${i+1}`) as HTMLVideoElement;
      if(scrolled){
        document.getElementById(`pic${i+1}`)?.classList.add("blackwhite");
        if(video){
          video.pause();
        }
      } else {
        document.getElementById(`pic${i+1}`)?.classList.remove("blackwhite");
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
        let vid = document.getElementById(`vid${i+1}`)
        if(vid){
          vid.classList.remove('display-none');
        }
      }
    } else {
      for(let i = 0; i<5; i++){
        let vid = document.getElementById(`vid${i+1}`)
        if(vid){
          vid.classList.add('display-none');
        }
      }
    }
  }, [video])

  //change position if tab is active
  const rotateCarousel = () => {
    if(activewindow && !scrolled && !stop){
      position<4
        ?setPosition(position +1)
        :setPosition(0)
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
    <div className='carousel-container'>      {/*Title*/}
      <div className='introduction'>
        <h1 className='title'>Web {lang === "eng" ? "developer" : "Entwickler"}</h1>
        <h2 className='describtion'>{lang === "eng" ? "I like to create interesting webapps, enjoyable games and more:" : "Ich erstelle interessante webapps, unterhaltsame Spiele und mehr:"}</h2>
      </div>

      {/*Carousel Settings*/}
      <div className='setbtn-container'>
        <form id="carouselSettings" className='settings-form'>
          <label htmlFor='stop'>Stop carousel
            <input id='stop' type="checkbox" onChange={handleStop}/>
          </label>
          <label htmlFor='preview'>Show video preview
            <input type="checkbox" defaultChecked onChange={handleNoVid}/>
          </label>
          <div className='form-slider'>
            <label htmlFor='preview' className='slider-label' title='Click to reset speed' onClick={resetSpeed}>Slide speed:
              <p>{`${speed/1000}s`}</p>
            </label>
            <input type="range" min='1' max='30' value={speed/1000} onChange={handleSlider} />
          </div>
        </form>

        <button className='carouSet-btn' title='Change behaviour of the carousel' onClick={handleSettings} id='setbtn'>
          <i className="fa-solid fa-gear"></i>
        </button>

      </div>
      

    {/*Carousel (could've done it with components, but it works now and there is no other implimantation on the site) */}
      <div className='img-container'>

        <figure className='img-back img-back-left' id='pic1' onClick={() => {setPosition(2)}} data-title={pageContent[projects[0]].title}>
          <img loading='lazy' src={pageContent[projects[0]].thumbnail} alt={pageContent[projects[0]].title} />
          {pageContent[projects[0]].video != "" &&
            <video src={pageContent[projects[0]].video} loop muted playsInline id="vid1"></video>
          }
        </figure>

        <figure className='img-middle img-middle-left' id='pic2' onClick={() => {setPosition(1)}} data-title={pageContent[projects[1]].title}>
          <img loading='lazy' src={pageContent[projects[1]].thumbnail} alt={pageContent[projects[1]].title} />
          {pageContent[projects[1]].video != "" &&
            <video src={pageContent[projects[1]].video} loop muted playsInline id="vid2"></video>
          }
        </figure>

        <figure className='img-front' id='pic3' onClick={() => {setPosition(0)}} data-title={pageContent[projects[2]].title}>
          <img loading='lazy' src={pageContent[projects[2]].thumbnail} alt={pageContent[projects[2]].title} />
          {pageContent[projects[2]].video != "" &&
            <video src={pageContent[projects[2]].video} autoPlay={false} loop muted playsInline id="vid3"></video>
          }
        </figure>

        <figure className='img-middle img-middle-right' id='pic4' onClick={() => {setPosition(4)}} data-title={pageContent[projects[3]].title}>
          <img loading='lazy' src={pageContent[projects[3]].thumbnail} alt={pageContent[projects[3]].title} />
          {pageContent[projects[3]].video != "" &&
            <video src={pageContent[projects[3]].video} loop muted playsInline id="vid4"></video>
          }
        </figure>

        <figure className='img-back img-back-right' id='pic5' onClick={() => {setPosition(3)}} data-title={pageContent[projects[4]].title}>
          <img loading='lazy' src={pageContent[projects[4]].thumbnail} alt={pageContent[projects[4]].title} />
          {pageContent[projects[4]].video != "" &&
            <video src={pageContent[projects[4]].video} loop muted playsInline id="vid5"></video>
          }
        </figure>
        <Link to={links[position]} className="projectLink">
          <i className="fa-regular fa-folder-open" />
        </Link>

      </div>
      
    </div>
  )
}

export default Carousel