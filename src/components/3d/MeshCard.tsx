import { useContext, useEffect, useRef } from "react";
import { viewerContext } from "./ModelViewer";
import { LangContext } from "../../App";

type meshcardProps = {
    id: number;
    path: string;
    img: string;
    name: string;
    verts?: number;
    anim?: number
}

export default function MeshCard({ id, img, name, verts, path, anim }: meshcardProps) {
    const { setActiveModel, activeModel } = useContext(viewerContext)
    const { lang } = useContext(LangContext)
    const containerRef = useRef<HTMLDivElement>(null)
    const titleRef = useRef<HTMLHeadingElement>(null)

    function setModel() {
        setActiveModel(path)
    }

    function checkScroll() {
        setTimeout(() => { //this is necesarry because it needs some time to register the new size after maximazing
            console.log("checkScroll")
            const container = containerRef.current
            const title = titleRef.current
            title?.getAnimations().map(anim => anim.cancel()) //remove all animations
            if (container && title) {
                if (container.scrollWidth > container.clientWidth) {
                    console.log(title.innerHTML, container.clientWidth)
                    title.classList.add("scrolling")
                    const transform = title.clientWidth - container.clientWidth
                    title.style.animation = "none"
                    title.animate(
                        [
                            { transform: "translateX(6px)" },
                            { transform: "translateX(6px)", offset: 0.2 },
                            { transform: `translateX(-${transform + 6}px)`, offset: 0.8 },
                            { transform: `translateX(-${transform + 6}px)` }
                        ],
                        {
                            delay: 1000,
                            duration: 3000,
                            iterations: Infinity,
                            direction: "alternate",
                            easing: "linear"
                        }
                    )
                }
            }
        }, 180);

    }

    useEffect(() => {
        console.log(name, anim)
        window.addEventListener("resize", checkScroll)
        return (() => {
            window.removeEventListener("resize", checkScroll)
        })
    }, [])

    useEffect(() => {
        checkScroll()

        return (() => {
            const title = titleRef.current
            title?.getAnimations().map(anim => anim.cancel())
        })
    }, [containerRef, titleRef])



    return (
        <div
            className={`meshCard ${activeModel === path ? "active" : ""}`}
            style={{ animationDelay: `${id * 0.025}s` }}
            onClick={setModel}
        >
            <div className="img-container">
                <img src={img}></img>
                <p>{verts} vertices</p>
                {anim &&
                    <i className="fa-solid fa-person-running"
                        title={lang === "eng" ? "Model has animations" : "Modell hat Animationen"}
                    />
                }
            </div>
            <div ref={containerRef} className="title-container">
                <h2 ref={titleRef}>
                    {name}
                </h2>
            </div>
        </div>
    )
}