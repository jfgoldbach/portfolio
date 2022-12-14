import { useState } from 'react'
//import 'styles/css/ZoomImage.css'

type imageProps = {
  source: string
  imageWidth?: string
}

function ZoomImage(props: imageProps) {
  const [loaded, setLoaded] = useState(false)

  const handleClick = () => {
    if (loaded) {
      document.getElementById('zoomcontain')?.classList.add('showFlex');
      (document.getElementById('zoomimage') as HTMLImageElement).src = props.source
    }
  }

  return (
    <div className={`zooom-container ${loaded ? "" : "loading"}`}>
      <img
        className={`zoomimage ${loaded ? "" : "loading"}`}
        src={props.source} width={props.imageWidth}
        onClick={handleClick}
        onLoad={() => setLoaded(true)}
      />

      {/*!loaded &&
          <Loading />
        */}
      {loaded &&
        <i className="fa-solid fa-magnifying-glass-plus"></i>
      }

    </div>
  )
}

export default ZoomImage