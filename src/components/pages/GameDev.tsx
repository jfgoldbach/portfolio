import { Outlet } from "react-router-dom";
import PolygonBackground from "../3d/PolygonBackground";
import { useContext, useEffect } from "react";
import { LangContext } from "../../App";

export default function GameDev() {
    useEffect(() => {
        const metaIcon: HTMLLinkElement = document.getElementById("icon") as HTMLLinkElement
        if(metaIcon){
            metaIcon.href = "/images/favicon_gamedev.ico"
        }
        document.title = "GameDev"
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