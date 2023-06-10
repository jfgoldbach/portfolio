//import '/styles/css/Loading.css'

type loadingProps = {
  light?: boolean
}

function Loading({ light }: loadingProps) {
  return (
    <svg height="50" width="50" viewBox="25 25 50 50" className="loadAnim">
      <circle style={light? {stroke: "rgba(255,255,255, 0.9)"} : {}} cx="50" cy="50" r="20" strokeWidth="7" />
    </svg>
  )
}

export default Loading

{/* <div className="loadingContainer noDivIn">
      <img src="/images/loading.png" width={"10px"} className="loadingWheel"></img>
    </div> */}