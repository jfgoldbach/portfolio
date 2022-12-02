import { useContext, useEffect, useState } from "react"
import SkillCard from "../../SkillCard"
import ZoomImage from "../../ZoomImage"
import Info from './Info.json'
import './Subpages.css'
import axios from "axios"
import ProjectBar from "../../ProjectBar"
import ProjectThumbnail from "../../ProjectThumbnail"
import { LangContext, OverviewContext } from "../../../App"


type pageProps = {
    index: number,
    scroll: number
}

type section = {
  title: string;
  content: string;
  image: string;
}

type langs = "eng" | "ger"

type sects = {
  id: string | number;
  name: string;
  info: string;
  link: string;
  skillcards: {
    name: string,
    type: string
  }[];
  liveLink: string;
  githubLink: string;
  sections: {
    eng: section[],
    ger: section[]
  };
}

type err = {
  message?: string,
  code?: string
}


function Subpage({index, scroll}: pageProps) {

  const [content, setContent] = useState<sects>({} as sects)
  const [error, setError] = useState<err>()
  const {lang} = useContext(LangContext)
  const {overview} = useContext(OverviewContext)

  //let contentsWidth = Math.ceil(content.sections.length/4) //error because sections has to be fetched and is not defined from the start

  useEffect(() => {
    setContent({} as sects)
    setError(undefined)
    axios.get(`http://jfgoldbach.de/api/?type=single&&id=${index}`) //change url for production: jfgoldbach.de/api (dev: localhost:8000)
      .then(response => response.data)
      .then(result => setContent(result))
      .catch(error => setError(error))
  }, [index])


  return (
    <div className="calculator-container">
      <ProjectBar scroll={scroll} type='webdev'>
        {overview.map(project => 
          <ProjectThumbnail link={`/${project.link}`} source={project.thumbnail} name={project.name} />
        )}
        </ProjectBar>
        
        <div className='main-element'>
          {(content.id === undefined && error === undefined) &&
            <div className="dbLoad info-container">
              <img src="/images/loading.png" width={"10px"}></img>
              <p>{lang === "eng"  ? "Loading article from database..." : "Lade Artikel aus Datenbank..."}</p>
            </div>
          }

          {error !== undefined &&
            <div className="info-container mildWarn fetchError">
              <i className="fa-solid fa-triangle-exclamation" />
              <p>{`${error?.message} (code: ${error?.code})`}</p>
            </div>
          }

          {content.name !== undefined &&
          <div className={`header ${content.info === "" ? "noInfo" : ""}`}>
            <h1 className="heading">{content.name}</h1>

            {content.skillcards.length !== 0 && content.sections[lang as langs] !== undefined &&
            <>
              <div style={{width: `${Math.ceil(content.sections[lang as langs].length/4)*200}px`}} className="contents">
                <h1>{lang === "eng" ? "Contents" : "Inhalt"}</h1>
                <div className="contentLinks">
                  {content.sections[lang as langs].map(i => 
                    <a href={
                      `#${i.title.toLowerCase().replaceAll(" ", "_")}`
                    }>{i.title}</a>
                  )}
                </div>
              </div>
            
              <div className="projectInfo">
                <div className='skills'>
                    {
                        content.skillcards.map(item => {
                            return <SkillCard beneath skill={item.name} type={item.type} />
                        })
                    }
                </div>
                <div className='examine'>
                  {content.liveLink !== "" &&
                    <a href={content.liveLink} target='_blank' className='btn'>
                      <p>{lang === "eng" ? "View live" : "Live ansehen"}</p>
                      <p>🔴</p>
                    </a>
                  }
                  {content.githubLink !== "" &&
                    <a href={content.githubLink} target='_blank' className='btn'>
                      {lang === "eng" ? "View on Github" : "Auf Github ansehen"} <i className="fa-brands fa-github"></i>
                    </a>
                  }

                </div>
              </div>
            </>
            }
          </div>
          }
              

          {(content.info !== undefined && content.info !== "") &&
            <div className={`info-container ${Info[0][content.info as keyof typeof Info[0]].css}`}>
              <i className="fa-solid fa-circle-info"></i>
              <p>{Info[0][content.info as keyof typeof Info[0]][lang as langs]}</p>
            </div>
          }

          {content.sections &&
          content.sections[lang as langs].map((section, i) => {
                if(i%2 === 0){
                    return(
                        <div id={section.title.toLowerCase().replaceAll(" ", "_")} className="section-wrapper">
                            <ZoomImage source={section.image} />
                            <div className="text-wrapper">
                                <h1 className="section-title">{section.title}</h1>
                                <div className="content-wrapper">
                                  <p>{section.content}</p>
                                </div>
                            </div>
                        </div>
                    )
                } else {
                    return(
                        <div id={section.title.toLowerCase().replaceAll(" ", "_")} className={`section-wrapper dark`}>
                            <ZoomImage source={section.image} />
                            <div className="text-wrapper">
                                <h1 className="section-title">{section.title}</h1>
                                <div className="content-wrapper">
                                  <p>{section.content}</p>
                                </div>
                            </div>
                        </div>
                    )
                }
                
            })
          }

        </div>
    </div>
  )
}

export default Subpage