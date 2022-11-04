import DemandPick from '../DemandPick'
import ProjectBar from '../ProjectBar'
import ProjectThumbnail from '../ProjectThumbnail'

type gameProps = {
  scroll: number
}

function GameDev(props: gameProps) {
  return (
    <div className='gamedev-container'>
        <ProjectBar scroll={props.scroll} type='gamedev'>
            <ProjectThumbnail link='/' source='images\Final.png' name="Car deform" />
            <ProjectThumbnail link='/' source='images\Final.png' name="Building generator" />
            <ProjectThumbnail link='/' source='images\Final.png' name="Water shader" />
        </ProjectBar>

        <DemandPick />
    </div>
  )
}

export default GameDev