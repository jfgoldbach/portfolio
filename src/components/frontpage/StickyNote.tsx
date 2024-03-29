import { useEffect, useMemo, useRef, useState } from "react";
import Button from "../Button";
import ZoomImage from "../ZoomImage";

type noteProps = {
    source: string,
    title: string,
    path?: string,
    text?: string,
    mirrored?: boolean
    dontRotate?: boolean
}

export function StickyNote ({source, path, text, title, mirrored, dontRotate}: noteProps) {
    const noteRef = useRef<HTMLElement>(null)
    const [visible, setVisible] = useState(false)
    const [rotation, setRotation] = useState([0, 0])

    const checkInViewport = (entries: IntersectionObserverEntry[]) => {
        if(entries[0].isIntersecting) setVisible(true)
    }

    const intersectionOptions = useMemo (() => {
        return {
            root: null,
            rootMargin: "0px",
            threshold: 0.75
        }   
    }, [])

    useEffect(() => {
        const observer = new IntersectionObserver(checkInViewport, intersectionOptions)
        const note = noteRef.current
        if(note){
            observer.observe(note)
        }
        if(!dontRotate){
        setRotation([Math.random()*4.5 -2.25, Math.random()*4.5 -2.25]) //random rotation betwen -2.25° and 2.25°
        }

        return (() => {
            if(note) observer.unobserve(note)
        })
    }, [])

    return (
        <section ref={noteRef} className={`noteContainer ${mirrored? "mirrored" : ""} ${visible? "onScreen" : ""}`}>
            <div className="note" style={{rotate: `${rotation[0]}deg`}}>
                <ZoomImage source={source} />
            </div>
            <div className="overviewSecContent note"  style={{rotate: `${rotation[1]}deg`}}>
                <div className="overviewSecTitle">
                    <img src="images/markerStroke.svg"></img>
                    <h1>{title}</h1>
                    {path &&
                        <Button path={path} >&gt;&gt;</Button>
                    }
                </div>
                {text &&
                    <p>{text}</p> 
                }
            </div>
        </section>
    )
}