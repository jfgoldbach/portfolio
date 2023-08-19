import { useContext, useEffect, useState } from "react"
import { OverviewContext } from "../../App"
import "../../styles/css/CarouselCard.css"
import { projectType } from "../../types/types"

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
            className={`${classes[index]} ${loaded ? "" : error.length > 0? "error" : "loading"}`}
            id={`pic${index}`}
            onClick={() => { setPosition(5 - index) }}
            data-title={project ? project.name : error.length > 0 ? "Error" : "Loading..."}
        >
            <img
                className="carouselImg"
                src={project ? project.thumbnail : ""}
                alt={project ? project.name : error.length > 0 ? "" : "Loading..."}
                onLoad={imageIsLoaded}
            />
            {project && project.video !== "" &&
                <video src={project.video} loop muted autoPlay playsInline id={`vid${index}`}></video>
            }
        </figure>
    )
}