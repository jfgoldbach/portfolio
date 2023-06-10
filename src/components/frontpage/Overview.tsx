import { useContext, useEffect } from "react"
import { LangContext, OverviewContext } from "../../App"
import { dbNotepadsType } from "../../types/types"
import { StickyNote } from "./StickyNote"
//import "/styles/css/Overview.css"

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
                    {/* <StickyNote
                        title="Web development"
                        source="images/web_development.jpg"
                        path="/webdev"
                        text="Websites, applications that are accesiable through your browser and everything inbetween"
                    />

                    <StickyNote
                        mirrored
                        title="Game development"
                        source="images/ue4.jpg"
                        path="/gamedev"
                        text="Making games and creating their gameplay, but also the technical side of it. Subpage is in construction."
                    />

                    <StickyNote
                        title="Photography"
                        source="images/photography.jpg"
                        text="Taking photos. Coming soon."
                    />

                    <StickyNote
                        mirrored
                        title="CGI"
                        source="images/cgi.jpg"
                        text="Computer generated imagery: rendered pictures of 3D models or environments. Coming soon."
                    /> */}
                </div>
            }
        </>
    )
}

export default Overview