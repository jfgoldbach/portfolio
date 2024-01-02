//import '/styles/css/App.css'
import Carousel from '../Carousel';
import AboutMe from '../AboutMe';
import { createContext, useContext, useEffect, useState } from 'react';
import ParticleCode from '../visuals/ParticleCode';
import $ from "jquery"
import Overview from '../frontpage/Overview';
import useCheckJWT from '../hooks/useCheckJWT';
import instance from '../network/axios';
import { LangContext, ReadyContext } from '../../App';
import { errorType, landingpageType } from '../../types/types';
import Loading from '../helper/Loading';
import { toast } from 'react-toastify';
import ErrorInfo from '../helper/ErrorInfo';

export const homeContext = createContext<landingpageType | null | undefined>({} as landingpageType)
export const introContext = createContext<introType>({} as introType)

type homeProps = {
    appError: errorType[]
}

type introType = {
    finished: boolean
    setFinished: React.Dispatch<React.SetStateAction<boolean>>
}

function Home({ appError }: homeProps) {
    const { ready } = useContext(ReadyContext)
    const { lang } = useContext(LangContext)
    const [content, setContent] = useState<landingpageType | null>()
    const [error, setError] = useState<errorType>({} as errorType)
    const [finished, setFinished] = useState(false)
    const { check } = useCheckJWT()

    function title() {
        document.title = lang === "eng" ? "Home" : "Startseite"
    }


    useEffect(() => {
        const metaIcon: HTMLLinkElement = document.getElementById("icon") as HTMLLinkElement
        if (metaIcon) {
            metaIcon.href = "/images/favicon.ico"
        }
        title()
    }, [])

    useEffect(() => {
        title()
    }, [lang])


    useEffect(() => {
        if (error.msg) toast.warn(`Home.tsx ${error.msg} (${error.msg})`)
    }, [error])

    function getLandingpage() {
        setError({} as errorType)
        check.then(() => {
            console.log("get landingpage content")
            instance.get("?type=landingpage", { headers: { "jwt": sessionStorage.getItem("jwt") } })
                .then(response => response.data)
                .then(result => setContent(result))
                .catch(error => setError({ "msg": error.message, "code": error.code }))
        })
    }

    useEffect(() => {
        console.log("home effect")
        getLandingpage()
    }, [ready])


    return (
        <homeContext.Provider value={content}>
            <div className="homeContainer">
                {/* <BlurredBg /> */}
                {content ?
                    <>
                        <introContext.Provider value={{ finished, setFinished }}>
                            <Carousel />
                            <AboutMe
                                heading={content.aboutme_heading}
                                subheading={content.aboutme_subheading}
                                skillcards={content.skillcard_sections}
                            />
                        </introContext.Provider>
                        {($(window).width() || 0) > 1000 &&
                            <ParticleCode
                                id={1} emitters={3} spawnRate={2000}
                                startPosition={`-150px`}
                                endPosition={"425px"} duration={10000}
                            />
                        }
                        {($(window).width() || 0) < 1000 &&
                            <ParticleCode
                                id={2} emitters={1} spawnRate={2000}
                                width={50}
                                startPosition={"-150px"}
                                endPosition={"100vh"} duration={18000}
                            />
                        }
                        <Overview notepads={content.notepads} />
                    </>
                    : appError.length > 0 ?
                        <ErrorInfo />
                        :
                        <Loading />
                }

            </div>
        </homeContext.Provider>
    );
}

export default Home;