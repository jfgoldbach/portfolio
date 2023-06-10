import { useContext } from "react"
import { OverviewContext, LangContext } from "../../App"
import ProjectCards from "./ProjectCards"
import Loading from "../helper/Loading"
import ErrorInfo from "../helper/ErrorInfo"

export default function GamedevMain() {
    const { gameOverview, error } = useContext(OverviewContext)
    const { lang } = useContext(LangContext)

    return (
        <div className="webdevPick-Outer">
            <div className="webdevPick-container">
                {gameOverview.length !== 0 &&
                    gameOverview.map(item => {
                        let index = gameOverview.findIndex(proj => proj.id === item.id)
                        return <ProjectCards key={index} index={index + 1} type={1} />
                    })
                }

                {gameOverview.length === 0 && !error.msg &&
                    <Loading light />
                }
            </div>
            {error.msg &&
                <ErrorInfo msg={error.msg} />
            }
        </div>
    )
}