import { useEffect, useState } from "react"
import SkillCard from "../../SkillCard"
import ZoomImage from "../../ZoomImage"
import Content from "./PageContent.json"
import Info from './Info.json'
import './Subpages.css'
import axios from "axios"
import { useLocation } from "react-router-dom"


type pageProps = {
    index: number
}

type sects = {
  id: string | number;
  name: string;
  info: string;
  link: string;
  skillcards: string;
  liveLink: string;
  githubLink: string;
  sections: {
    title: string;
    content: string;
    image: string;
  }[]
}

type err = {
  message?: string,
  code?: string
}


function Subpage({index}: pageProps) {

  const [content, setContent] = useState<sects>({} as sects)
  const [error, setError] = useState<err>()
  const location = useLocation()

  //let contentsWidth = Math.ceil(content.sections.length/4) //error because sections has to be fetched and is not defined from the start

  useEffect(() => {
    setContent({} as sects)
    setError(undefined)
    axios.get(`http://localhost:8000/?id=${index}&col=sections`) //change url for production
      .then(response => response.data)
      .then(result => setContent(result))
      .catch(error => setError(error))
  }, [location])


  return (
    <div className="calculator-container">
        <div className='main-element'>

          {(content.sections === undefined && error === undefined) &&
            <div className="dbLoad info-container">
              <img src="/images/loading.png" width={"10px"}></img>
              <p>Loading article from database...</p>
            </div>
          }

          {error !== undefined &&
            <div className="info-container mildWarn fetchError">
              <i className="fa-solid fa-triangle-exclamation" />
              <p>{`${error?.message} (code: ${error?.code})`}</p>
            </div>
          }

          {content.sections !== undefined &&
          <div className={`header ${Content[index].info === "" ? "noInfo" : ""}`}>
            <h1 className="heading">{content.name}</h1>

            {content.skillcards.length !== 0 &&
            <>
              <div style={{minWidth: `${Math.ceil(content.sections.length/4)*200}px`}} className="contents">
                <h1>Contents</h1>
                <div className="contentLinks">
                  {content.sections.map(i => 
                    <a href={
                      `#${i.title.toLowerCase().replaceAll(" ", "_")}`
                    }>{i.title}</a>
                  )}
                </div>
              </div>
            
              <div className="projectInfo">
                <div className='skills'>
                    {
                        Content[index].skillcards.map(item => {
                            return <SkillCard beneath skill={item.name} type={item.type} />
                        })
                    }
                </div>
                <div className='examine'>
                  {Content[index].buttons.live !== "" &&
                    <a href={content.liveLink} target='_blank' className='btn'>View live 🔴</a>
                  }
                  {Content[index].buttons.github !== "" &&
                    <a href={content.githubLink} target='_blank' className='btn'>
                      View on GitHub <i className="fa-brands fa-github"></i>
                    </a>
                  }

                </div>
              </div>
            </>
            }
          </div>
          }
              

          {(content.info !== undefined && content.info !== "") &&
            <div className={`info-container ${content.info === "inConstruction" ? "mildWarn" : ""}`}>
              <i className="fa-solid fa-circle-info"></i>
              <p>{Info[0][content.info as keyof typeof Info[0]]}</p>
            </div>
          }

          {content.sections &&
          content.sections.map((section, i) => {
                if(i%2 === 0){
                    return(
                        <div id={section.title.toLowerCase().replaceAll(" ", "_")} className="section-wrapper">
                            <ZoomImage source={section.image} />
                            <div className="text-wrapper">
                                <h1 className="section-title">{section.title}</h1>
                                <div className="line" />
                                <div className="content-wrapper">
                                  <p>{section.content}</p>
                                </div>
                            </div>
                        </div>
                    )
                } else {
                    return(
                        <div id={section.title.toLowerCase().replaceAll(" ", "_")} className={`section-wrapper dark`}>
                            <div className="text-wrapper">
                                <h1 className="section-title">{section.title}</h1>
                                <div className="line" />
                                <div className="content-wrapper">
                                  <p>{section.content}</p>
                                </div>
                            </div>
                            <ZoomImage source={section.image} />
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