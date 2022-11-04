import '../../App.css'
import Carousel from '../Carousel';
import AboutMe from '../AboutMe';
import { Suspense } from 'react';
import ParticleCode from '../visuals/ParticleCode';
import $ from "jquery"

function Home(){
    return(
        <Suspense fallback={<img src="/images/loading.png" className='loading'></img>}>
            <Carousel />
            <AboutMe />
            {($(window).width() || 0) > 1000 &&
            <ParticleCode 
                id={1} emitters={3} spawnRate={2000} 
                startPosition={`-50px`} 
                endPosition={"425px"} duration={10000} 
            />
            }
            {($(window).width() || 0) < 1000 &&
            <ParticleCode 
                id={2} emitters={1} spawnRate={2000} 
                width={50}
                startPosition={`-50px`} 
                endPosition={"100vh"} duration={18000} 
            />
            }
            
        </Suspense>
    );
}

export default Home;