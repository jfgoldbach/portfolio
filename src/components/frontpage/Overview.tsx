import { useContext, useEffect } from "react"
import { OverviewContext } from "../../App"
import Button from "../Button"
import ZoomImage from "../ZoomImage"
import { StickyNote } from "./StickyNote"
//import "/styles/css/Overview.css"

function Overview() {
    const {overview, error} = useContext(OverviewContext)

  return (
    <>
    {overview.length !== 0 && !error.msg &&
    <div className="overviewWrapper">
        <div className="spikyDivider">
            <img src="images/spiky-wave.svg" />
        </div>
        <StickyNote 
            title="Web development" 
            source="images/web_development.jpg" 
            path="/webdev" 
            text="Websites, applications that are accesiable through your browser and everything inbetween" 
        />

        <StickyNote
            mirrored
            title="Game development" 
            source="images/ue4.jpg" 
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
        />
    </div>
    }
    </>
  )
}

export default Overview