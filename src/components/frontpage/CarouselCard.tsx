import { useContext, useEffect, useState } from "react"
import { errorType, OverviewContext, projectType } from "../../App"
//import "/styles/css/CarouselCard.css"

type carouselCardProps = {
    project: projectType | undefined,
    index: number,
    setPosition: React.Dispatch<React.SetStateAction<number>>
}


export function CarouselCard({ project, index, setPosition }: carouselCardProps) {
    const [loaded, setLaoded] = useState(false)
    const { error } = useContext(OverviewContext)

    const classes = [
        'img-front',
        'img-middle img-middle-left',
        'img-back img-back-left',
        'img-back img-back-right',
        'img-middle img-middle-right'
    ]

    const imageIsLoaded = () => {
        setLaoded(true)
    }

    useEffect(() => {
        console.log(error)
    }, [error])

    return (
        <figure
            className={`${classes[index]} ${loaded ? "" : error.code? "error" : "loading"}`}
            id={`pic${index}`}
            onClick={() => { setPosition(5 - index) }}
            data-title={project ? project.name : error.code ? "Error" : "Loading..."}
        >
            <img
                className="carouselImg"
                src={project ? project.thumbnail : ""}
                alt={project ? project.name : error.code ? "" : "Loading..."}
                onLoad={imageIsLoaded}
            />
            {project && project.video !== "" &&
                <video src={project.video} loop muted autoPlay playsInline id={`vid${index}`}></video>
            }
        </figure>
    )
}