import { useContext } from "react"
import { OverviewContext } from "../../App"
import Button from "../Button"
import ZoomImage from "../ZoomImage"
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
        <section>
            <ZoomImage source={overview[1].thumbnail} />
            <div className="overviewSecContent">
                <div className="overviewSecTitle">
                    <h1>Web development</h1>
                    <Button path="/webdev" >&gt;&gt;</Button>
                </div>
                
                <p>Websites, applications that are accesiable through your browser and everything inbetween</p>
            </div>
        </section>

        <section className="mirrored">
            <ZoomImage source="images/ue4.jpg" />
            <div className="overviewSecContent">
                <div className="overviewSecTitle">
                    <h1>Game development</h1>
                    <Button path="/gamedev" >&gt;&gt;</Button>
                </div>
                <p>
                    <span style={{color: "grey"}}>&#40;In construction&#41;</span>
                    <br/>
                    Making games and creating their gameplay, but also the technical side of it. 
                </p>
            </div>
        </section>

        <section>
            <ZoomImage source="images/photography.jpg" />
            <div className="overviewSecContent">
                <div className="overviewSecTitle">
                    <h1>Photography</h1>
                </div>
                <p>
                    Taking photos 
                    <br/> 
                    <span style={{color: "grey"}}>&#40;Coming son&#41;</span>
                </p>
            </div>
        </section>

        <section className="mirrored">
            <ZoomImage source="images/cgi.jpg" />
            <div className="overviewSecContent">
                <div className="overviewSecTitle">
                    <h1>CGI</h1>
                </div>
                <p>
                    Computer generated imagery: rendered pictures of 3D models or environments 
                    <br/> 
                    <span style={{color: "grey"}}>&#40;Coming son&#41;</span>
                </p>
            </div>
        </section>
    </div>
    }
    </>
  )
}

export default Overview