import { useContext, useEffect } from "react"
import { LangContext, OverviewContext } from "../../App"
import { dbNotepadsType } from "../../types/types"
import { StickyNote } from "./StickyNote"
import '../../styles/css/Overview.css'

type overviewProps = {
    notepads: dbNotepadsType
}


function Overview({ notepads }: overviewProps) {
    const { overview, error } = useContext(OverviewContext)
    const { lang } = useContext(LangContext)

    return (
        <>
            {overview.length !== 0 && !error.msg &&
                <div className="overviewWrapper">
                    <div className="spikyDivider">
                        <img src="images/spiky-wave.svg" />
                    </div>
                    {
                        notepads.notes.map((note, index) =>
                            <StickyNote
                                mirrored={(index % 2) === 0}
                                title={lang === "eng" ? note.heading.eng : note.heading.ger}
                                source={note.img}
                                path={note.path}
                                text={lang === "eng" ? note.description.eng : note.description.ger}
                            />
                        )
                    }
                </div>
            }
        </>
    )
}

export default Overview