import { useContext, useEffect, useRef } from "react"
import { OverviewContext, LangContext } from "../../App"
import ProjectCards from "./ProjectCards"
import Loading from "../helper/Loading"
import ErrorInfo from "../helper/ErrorInfo"

export default function GamedevMain() {
    const { gameOverview, error } = useContext(OverviewContext)
    const containerRef = useRef<HTMLDivElement>(null)

    function calcWidth() {
        const container = containerRef.current
        if (container) {
            const columns = Math.floor((window.innerWidth - 60) / 410)
            const style = `${(columns * 350) + ((columns) * 30)}px`
            container.style.width = `${(columns * 350) + ((columns - 1) * 30)}px`
        }
    }

    useEffect(() => {
        calcWidth()
        window.addEventListener('resize', calcWidth)

        return (() => {
            window.removeEventListener('resize', calcWidth)
        })
    }, [])

    return (
        <div className="pick-Outer">
            <div 
                ref={containerRef}
                className={`pick-container ${gameOverview.length < 5 ? "oneLine" : ""}`}
            >
                {gameOverview.length !== 0 &&
                    gameOverview.map(item => {
                        let index = gameOverview.findIndex(proj => proj.id === item.id)
                        return <ProjectCards key={index} index={index + 1} type={1} />
                    })
                }

                {gameOverview.length === 0 && error.length === 0 &&
                    <Loading light />
                }
            </div>
            {error.length > 0 &&
                <ErrorInfo />
            }
        </div>
    )
}