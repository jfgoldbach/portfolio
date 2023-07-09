import Button from './Button'
import '../styles/css/MainSection.css'


function MainSection() {
 return (
    <div className='hero-container'>
        {/*<video src='/videos/UE_vid.mp4' autoPlay loop muted />*/}
        <h1>WANNA KNOW MORE ABOUT WHAT I DO?</h1>
        <p>Have a look down below</p>
        <div className='hero-btns'>
            <Button className='btns' buttonStyle='btn--outline' buttonSize='btn--large' path='/contact'>Contact me</Button>
            <Button className='btns' buttonStyle='btn--primary' buttonSize='btn--large' path='/'>RANDOM PROJECT</Button>
        </div>
    </div>
  )
}

export default MainSection