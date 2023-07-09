import { useContext, useEffect, useRef, useState } from "react"
import SkillCard from "../../SkillCard"
import ZoomImage from "../../ZoomImage"
import Info from './Info.json'
import { LangContext, OverviewContext } from "../../../App"
import instance from "../../network/axios"
import Loading from "../../helper/Loading"
import Button from "../../Button"
import ErrorInfo from "../../helper/ErrorInfo"
import BlurredBg from "../../visuals/BlurredBg"
import '../../../styles/css/Subpages.css'


type pageProps = {
  index: number
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
  preview: {
    desktop: string,
    mobile: string
  }
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


function Subpage({ index }: pageProps) {

  const [content, setContent] = useState<sects>({} as sects)
  const [error, setError] = useState<err | undefined>()
  const { lang } = useContext(LangContext)
  const { overview } = useContext(OverviewContext)
  const contentsRef = useRef<HTMLDivElement>(null)
  //const contentsVisible = useIntersectionObserver(contentsRef, 0)
  const [sideCont, SetSideCont] = useState(false)

  //let contentsWidth = Math.ceil(content.sections.length/4) //error because sections has to be fetched and is not defined from the start

  function getContent() {
    setContent({} as sects)
    setError(undefined)
    instance.get(`?type=single&id=${index}`, { headers: { "jwt": sessionStorage.getItem("jwt") } })
      .then(response => response.data)
      .then(result => setContent(result))
      .catch(error => setError(error))
  }

  //useEffect(() => {
  //  console.log("contentsVisible", contentsVisible)
  //}, [contentsVisible])

  useEffect(() => {
    console.log("sideCont", sideCont)
  }, [sideCont])

  useEffect(() => {
    getContent()
  }, [index])

  useEffect(() => {
    getContent()
    const metaIcon: HTMLLinkElement = document.getElementById("icon") as HTMLLinkElement
    if (metaIcon) {
      metaIcon.href = "/images/favicon_webdev.ico"
    }
    document.title = `${lang === "eng" ? "Loading..." : "Lädt..."} | Julian Goldbach`

    const scrollCont = () => { SetSideCont(window.scrollY > 100) }
    window.addEventListener("scroll", scrollCont)

    return (() => {
      window.removeEventListener("scroll", scrollCont)
    })
  }, [])

  useEffect(() => {
    if (typeof content !== "object") {
      setError({ message: "Data received from server is unusable.", code: "500" })
    }
    if (content.name) {
      document.title = `${content.name} | Julian Goldbach`
    } else {
      document.title = `${lang === "eng" ? "Loading..." : "Lädt..."} | Julian Goldbach`
    }
  }, [content])

  useEffect(() => {
    if (error?.message) {
      document.title = `${lang === "eng" ? "Error" : "Fehler"} | Julian Goldbach`
    }
  }, [error])

  return (
    <div className="calculator-container">
      <BlurredBg />

      {content.name !== undefined && content.sections[lang as langs] !== undefined && content.sections[lang as langs].length > 2 &&
        < div className={`contents-side ${sideCont ? "active" : ""}`}>
          <h1>{lang === "eng" ? "Contents" : "Inhalt"}</h1>
          <div className="contentLinks">
            {content.sections[lang as langs].map(i =>
              <a href={`#${i.title.toLowerCase().replaceAll(" ", "_")}`} title={i.title}>
                {i.title}
              </a>
            )
            }
          </div>
        </div>
      }

      <div className='main-element'>
        {(content.id === undefined && error === undefined) &&
          <Loading />
        }

        {error !== undefined &&
          <ErrorInfo />
        }

        {(content.info !== undefined && content.info !== "") &&
          <div className={`info-container scaleIn ${Info[0][content.info as keyof typeof Info[0]].css}`}>
            <i className="fa-solid fa-circle-info"></i>
            <p>{Info[0][content.info as keyof typeof Info[0]][lang as langs]}</p>
          </div>
        }

        {content.name !== undefined &&
          <div className={`header scaleIn ${content.info === "" ? "noInfo" : ""}`}>
            <h1 className="heading">{content.name}</h1>

            {content.skillcards.length !== 0 && content.sections[lang as langs] !== undefined &&
              <>
                {content.sections[lang as langs].length > 2 &&
                  <div ref={contentsRef} style={{ width: `${Math.ceil(content.sections[lang as langs].length / 4) * 200}px` }} className="contents">
                    <h1>{lang === "eng" ? "Contents" : "Inhalt"}</h1>
                    <div className="contentLinks">
                      {content.sections[lang as langs].map(i =>
                        <a href={`#${i.title.toLowerCase().replaceAll(" ", "_")}`} title={i.title} className="lineClamp">
                          {i.title}
                        </a>
                      )
                      }
                    </div>
                  </div>
                }

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
                      <Button buttonStyle="btn--dark" path={content.liveLink} outsidePath>
                        <p>{lang === "eng" ? "View live" : "Live ansehen"}</p>
                        <p>🔴</p>
                      </Button>
                    }
                    {content.githubLink !== "" &&
                      <Button buttonStyle="btn--dark" buttonSize="btn--medium" path={content.githubLink} outsidePath>
                        {lang === "eng" ? "View on Github" : "Repository"} 
                        <i className="fa-brands fa-github"></i>
                      </Button>
                    }

                  </div>
                </div>
              </>
            }
          </div>
        }

        {content.preview &&
          <div className={`preview scaleIn ${content.info === "" ? "" : "preview-lessMargin"}`}>
            <div className="preview-desktop loading">
              <img src={content.preview.desktop}></img>
            </div>
            <div className="preview-mobileWrapper">
              <img className="preview-mobileBackground loading" src={content.preview.mobile}></img>
              <img className="preview-mobileFrame" src="/images/mobile/smartphone2.svg"></img>
            </div>
          </div>
        }

        {content.sections &&
          <div className="information-wrapper scaleIn">
            {content.sections &&
              content.sections[lang as langs].map((section, i) => {
                if (i % 2 === 0) {
                  return (
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
                  return (
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
        }
      </div>
    </div >
  )
}

export default Subpage