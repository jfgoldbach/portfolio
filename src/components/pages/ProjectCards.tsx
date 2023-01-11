//import "/styles/css/ProjectCards.css"
//import "/styles/css/SkillCard.css"
import { Link } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import { LangContext, OverviewContext } from "../../App"
import $ from 'jquery'

type cardsprops = {
  index: number
}

function ProjectCards({ index }: cardsprops) {
  const { overview } = useContext(OverviewContext)
  const { lang } = useContext(LangContext)
  const project = overview[index - 1]
  const [loaded, setLoaded] = useState(false)

  let pos: [number, number], dims: [number, number]

  useEffect(() => {
    //initialization of position and dimensions (jQuery is too slow to make it work on every mousemove event)
    updateSizePosition()

    document.addEventListener('mousemove', e => applyRotation(e))
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
      } else {
        card.css("transform", "unset")
        card.css("filter", "unset")
      }
    }

    window.addEventListener('resize', updateSizePosition) //update vars on window size change

    function updateSizePosition() {
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
    }

    document.addEventListener('scroll', scrollOffset) //adjust captured position based on vertical scroll

    function scrollOffset() {
      console.log("scroll")
      const card = $(`#card${index}`)
      const offs = card.offset()
      if (card && offs) {
        const offset = offs.top - window.scrollY
        pos = [pos[0], offset]
        console.log("scroll offset")
      }
    }

    return (() => {
      document.removeEventListener('mousemove', applyRotation)
      document.removeEventListener('scroll', scrollOffset)
      window.removeEventListener('resize', updateSizePosition)
    })
  }, [])



  return (
    <Link to={`/${project.link}`} className="projectCard" id={`card${index}`}>
      <div className="imgContainer">
        <img className={`
          projectImg
          ${project.info === "inConstruction" ? "greyscale" : ""} 
          ${loaded? "" : "loading"}`
        }
          onLoad={() => setLoaded(true)}
          src={project.thumbnail} /*project.thumbnail*/
          alt={loaded? project.name : ""} 
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