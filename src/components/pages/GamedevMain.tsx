import { useContext } from "react"
import { OverviewContext, LangContext } from "../../App"
import ProjectCards from "./ProjectCards"
import Loading from "../helper/Loading"
import ErrorInfo from "../helper/ErrorInfo"

export default function GamedevMain() {
    const { gameOverview, error } = useContext(OverviewContext)
    const { lang } = useContext(LangContext)

    console.log(gameOverview.length)

    return (
        <div className="pick-Outer">
            <div className={`pick-container ${gameOverview.length < 5 ? "oneLine" : ""}`}>
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