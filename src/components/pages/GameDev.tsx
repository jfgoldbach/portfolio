import { Outlet } from "react-router-dom";
import PolygonBackground from "../3d/PolygonBackground";
import { useEffect } from "react";

export default function GameDev() {
    useEffect(() => {
        const metaIcon: HTMLLinkElement = document.getElementById("icon") as HTMLLinkElement
        if(metaIcon){
            metaIcon.href = "/images/favicon_gamedev.ico"
        }
        document.title = "Julian Goldbach - GameDev"
    }, [])
    
    return (
        <div className='gamedev-container'>
            <div className="wire-container">
                <PolygonBackground />
            </div>
            
            <Outlet />
        </div>
    )
}