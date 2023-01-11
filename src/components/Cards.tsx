import CardItem from './CardItem'
//import '/styles/css/Cards.css'

function Cards() {
  return (
    <div className='cards'>
        <h1>Check out my projects:</h1>
        <div className='cards__container'>
            <div className='cards__wrapper'>
                <ul className='cards__items'>
                    <CardItem 
                    src="images/Final.png"
                    text="Deformable car showcase with usage of the ProceduralMeshComponent"
                    label="Unreal Engine"
                    path="/gamedev"
                    type="unrealengine"
                    />
                    <CardItem 
                    src="images/calculator.jpg"
                    text="Calculator with the most important operations"
                    label="JavaScript"
                    path="/webdev"
                    type="javascript"
                    />
                </ul>
                <ul className='cards__items'>
                <CardItem 
                    src="images/divbreaker.jpg"
                    text="Arcanoid style game where you destroy one div after the other. There are infitite levels with increasing difficulty"
                    label="JavaScript"
                    path="/webdev"
                    type="javascript"
                    />
                    <CardItem 
                    src="images/threetest.jpg"
                    text="Testing 3D in webrowsers"
                    label="three.js"
                    path="/webdev"
                    type="threejs"
                    />
                    <CardItem 
                    src="images/photos.jpg"
                    text="Some photos i took"
                    label="Photos"
                    path="/"
                    type="photos"
                    />
                </ul>
            </div>
        </div>
    </div>
  )
}

export default Cards