//import "/styles/css/ProjectCards.css"
//import "/styles/css/SkillCard.css"
import { Link } from "react-router-dom"
import { MouseEventHandler, useContext, useEffect, useState } from "react"
import { LangContext, OverviewContext } from "../../App"
import $ from 'jquery'
import '../../styles/css/ProjectCards.css'

type cardsprops = {
  index: number,
  type?: number,
  className?: string
}


//remark: there may be some performance optimisations possible, like not using jQuery
function ProjectCards({ index, type, className }: cardsprops) {
  const { overview, gameOverview } = useContext(OverviewContext)
  const { lang } = useContext(LangContext)
  const project = type && type === 1 ? gameOverview[index - 1] : overview[index - 1] //temporary solution
  const [loaded, setLoaded] = useState(false)
  const [over, setOver] = useState(false)

  let pos: [number, number], dims: [number, number]

  useEffect(() => {
    console.log(over)
    if (over) {
      //initialization of position and dimensions (jQuery is too slow to make it work on every mousemove event)
      updateSizePosition()
      //console.log("add listeners")
      document.addEventListener('mousemove', applyRotation)
      window.addEventListener('resize', updateSizePosition) //update vars on window size change
      document.addEventListener('scroll', offsetY) //adjust captured position based on vertical scroll
    } else {
      removeListeners()
      const card = $(`#card${index}`)
      card.css("transform", "unset")
      card.css("filter", "unset")
    }

    function applyRotation(e: MouseEvent) {
      const card = $(`#card${index}`)

      const strength = 40
      if (card && dims && pos &&
        e.clientX > pos[0] &&
        e.clientX < pos[0] + dims[0] &&
        e.clientY > pos[1] &&
        e.clientY < pos[1] + dims[1]) {
        card.css("transform", `
          perspective(1500px) 
          translateZ(75px) rotateY(${((e.clientX - pos[0] - dims[0] / 2) / dims[0]) * strength}deg) 
          rotateX(${((e.clientY - pos[1] - dims[1] / 2) / dims[1]) * -strength}deg)
        `)
        card.css("filter", `brightness(${1.25 - (((e.clientY - pos[1]) / dims[1]) * 0.5)})`)
      }
    }

    function updateSizePosition() {
      console.log("updateSizePosition")
      const card = $(`#card${index}`)
      if (card) {
        const posObj = card.offset()
        if (posObj) {
          pos = [posObj.left, posObj.top]
        }
        const width = card.width()
        const height = card.height()
        if (width && height) {
          dims = [width, height]
        }
      }
      offsetY() //recalculate y value on the spot (only updates if scrolled)
    }

    function offsetY() {
      console.log("offsetY")
      const scrollY = window.scrollY
      if (scrollY !== 0) {
        const card = $(`#card${index}`)
        const offset = card.offset()
        if (card && offset) {
          const posY = offset.top - window.scrollY
          pos = [pos[0], posY]
        }
      }
    }

    function removeListeners() {
      document.removeEventListener('mousemove', applyRotation)
      document.removeEventListener('scroll', offsetY)
      window.removeEventListener('resize', updateSizePosition)
    }


    return (() => {
      removeListeners()
    })
  }, [over])

  function overOut(e: React.MouseEvent) { //above listeners will only be created/triggered when mouse is over
    setOver(e.type === "mouseover")
  }



  return (
    <Link
      to={`/${project.link}`}
      className={`projectCard scaleIn ${className && ""}`}
      id={`card${index}`}
      onMouseOver={overOut}
      onMouseOut={overOut}
    >
      <div className="imgContainer">
        <img className={`
          projectImg
          ${project.info === "inConstruction" ? "greyscale" : ""} 
          ${loaded ? "" : "loading"}`
        }
          onLoad={() => setLoaded(true)}
          src={project.thumbnail} /*project.thumbnail*/
          alt={loaded ? project.name : ""}
        />
        {project.info === "inConstruction" &&
          <>
            <i className="fa-solid fa-wrench"></i>
            <div className="bannerContainer">
              <div className="constructionBanner">
                {lang === "eng"
                  ? "Work in progress Work in progress Work in progress"
                  : "In Arbeit In Arbeit In Arbeit In Arbeit In Arbeit In Arbeit"
                }
              </div>
            </div>
          </>
        }
      </div>
      <h1>{project.name}</h1>
      <hr />
      <div className="skillcards">
        {project.skillcards.map(
          item => <p className={item.type}>{item.name}</p>
        )}
      </div>
      <p>{project.description[lang as "eng" || "ger"]}</p>
    </Link>
  )
}

export default ProjectCards