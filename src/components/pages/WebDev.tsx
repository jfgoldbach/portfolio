import { Outlet, useLocation } from 'react-router-dom'
import '../../App.css'
import ProjectBar from '../ProjectBar'
import ProjectThumbnail from '../ProjectThumbnail'
import ParticleCode from '../visuals/ParticleCode'
import $ from "jquery"

type webProps = {
  scroll: number
}

function WebDev(props: webProps) {
  const location = useLocation()

  return (
    <div className='webdev-container'>
        <ProjectBar scroll={props.scroll} type='webdev'>
            <ProjectThumbnail link='diced' source='/images/diced.jpg' name="Diced" />
            <ProjectThumbnail link='thissite' source='/images/thisSite.jpg' name="This site" />
            <ProjectThumbnail link='ecommerce' source='/images/store.jpg' name="E-Commerce" />
            <ProjectThumbnail link='divbreaker' source='/images/divbreaker.jpg' name="Divbreaker" />
            <ProjectThumbnail link='calculator' source='/images/calculator.jpg' name="Calculator" />
            <ProjectThumbnail link='apartment' source='/images/apartment.jpg' name="Apartment" />
        </ProjectBar>
        <Outlet />

        {(location.pathname !== "/webdev" && ($(window).width() || 0) > 1000) &&
          <ParticleCode 
            id={3} startPosition={"-100px"} endPosition={"80vh"} 
            duration={20000} emitters={2} spawnRate={4000} 
            fixed 
          />
        }
        {(location.pathname !== "/webdev" && ($(window).width() || 0) < 1000) &&
          <ParticleCode 
            id={4} startPosition={"-75px"} endPosition={"70vh"} 
            duration={20000} emitters={1} spawnRate={4000} 
            width={50} fixed 
          />
        }
        
    </div>
  )
}

export default WebDev