import '../../styles/css/Loading.css'

type loadingProps = {
  light?: boolean
  small?: boolean
  background?: boolean
}



function Loading({ light, small, background }: loadingProps) {
  return (
    <svg height="50" width="50" viewBox="25 25 50 50" className={`loadAnim ${background ? "bg" : ""}`} style={{ scale: small ? "0.65" : "1"}}>
      <defs>
        <linearGradient id="loadGradient">
          <stop offset="0%" stop-color="#252525" />
          <stop offset="100%" stop-color="#121212" />
        </linearGradient>
        <linearGradient id="loadGradient2">
          <stop offset="0%" stop-color="#f900d0" />
          <stop offset="100%" stop-color="#00ddff" />
        </linearGradient>
      </defs>

      <circle
        style={light ? { stroke: "url(#loadGradient2)" } : {}}
        cx="50"
        cy="50"
        r="20"
        strokeWidth="7"
      />
    </svg>
  )
}

export default Loading