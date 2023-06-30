import { useEffect, useRef, useState } from 'react'
import useIntersectionObserver from './hooks/useIntersectionObserver'
//import 'styles/css/ZoomImage.css'

type imageProps = {
  source: string
  imageWidth?: string
}

function ZoomImage(props: imageProps) {
  const [loaded, setLoaded] = useState(false)
  const imgRef = useRef(null)
  const visible = useIntersectionObserver(imgRef, 0)

  const handleClick = () => {
    if (loaded) {
      document.getElementById('zoomcontain')?.classList.add('showFlex');
      (document.getElementById('zoomimage') as HTMLImageElement).src = props.source
    }
  }



  return (
    <div ref={imgRef} className={`zooom-container ${loaded ? "" : "loading"}`}>
      <img
        className={`zoomimage ${loaded ? "" : "loading"}`}
        src={props.source} width={props.imageWidth}
        onClick={handleClick}
        onLoad={() => setLoaded(true)}
        loading='lazy'
      />

      {loaded &&
        <i className="fa-solid fa-magnifying-glass-plus"></i>
      }

    </div>
  )
}

export default ZoomImage