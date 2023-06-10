import { useEffect, useState } from "react"
import { Navigate, Outlet, useLocation, useParams } from "react-router-dom"
import Button from "../../Button"
import request from '../../../request.json'
import axios from "axios"
import useCheckJWT from "../../hooks/useCheckJWT"
import LangChange from "../../NavBar/LangChange"
import instance from "../../network/axios"
import Loading from "../../helper/Loading"
import { jwtPayload } from "../../../types/types"


type apNavigation = {
    "navigation": {
        "ger": string,
        "eng": string,
        "fa_icon": string,
        "items": {
            "ger": string,
            "eng": string,
            "path": string
            "admin_only": boolean
        }[]
    }[]
}


export default function Changer() {
    const { content_id } = useParams()
    const [apContent, setAPcontent] = useState<apNavigation>()
    const [error, setError] = useState<string>()
    const [timeLeft, setTimeLeft] = useState<number | null>(null)
    const [admin, setAdmin] = useState(false) //could also be set in a hook (for the future)

    const { check, genNew } = useCheckJWT()


    useEffect(() => {
        const token = sessionStorage.getItem("jwt")
        if (token) {
            const payload: jwtPayload = JSON.parse(atob(token.split(".")[1]))
            if (payload.admin) {
                setAdmin(payload.admin)
            } else {
                console.error("Send access token doesn't have the admin property in its payload.")
            }

            instance.get("?type=adminPanel",{headers: {"jwt": sessionStorage.getItem("jwt")}})
                .then(response => response.data)
                .then(result => setAPcontent(result))
                .catch(error => setError(error))
        } else {
            console.error("No token found.")
            setError("No token found.")
        }

        document.title = "Julian Goldbach - Admin panel"

        return (() => {
            genNew() //always generate new key when unmounting
        })
    }, [])

    useEffect(() => {
        const metaIcon: HTMLLinkElement = document.getElementById("icon") as HTMLLinkElement
        if(metaIcon){
            metaIcon.href = admin? "/images/favicon_ap_admin.ico" : "/images/favicon_ap_guest.ico"
        }
        document.title = `Admin panel as ${admin? "Admin" : "Guest"}`
    }, [admin])


    useEffect(() => {
        if (apContent && apContent.navigation) {
            setTimeLeft(getTimeleft())
        }
    }, [apContent])


    useEffect(() => {
        let timeout: NodeJS.Timeout
        if (timeLeft) {
            if (timeLeft > 300) {
                timeout = setTimeout(() => {
                    setTimeLeft(getTimeleft())
                }, 60000);
            } else if (timeLeft <= 300) {
                timeout = setTimeout(() => {
                    setTimeLeft(prev => prev! - 1)
                }, 1000);
            }
        }

        return (() => {
            clearTimeout(timeout)
        })
    }, [timeLeft])


    function getTimeleft() {
        console.log("check time left")
        const jwt = sessionStorage.getItem("jwt")
        if (jwt) {
            const expires = JSON.parse(atob(jwt.split(".")[1])).exp //change atob
            const now = Math.floor(new Date().getTime() / 1000)
            return expires - now
        } else {
            return 0
        }
    }


    useEffect(() => {
        console.log(error)
    }, [error])


    function logout() {
        sessionStorage.removeItem("jwt")
        genNew().then(() => setTimeLeft(-1))
    }



    function getTimer(time: number | null) {
        if (timeLeft && time && time > 180) {
            return <p className="countdown">{Math.ceil(timeLeft / 60)} Min</p>
        } else if (timeLeft && time && time <= 180) {
            const minutes = Math.floor(timeLeft / 60)
            const seconds = time - (minutes * 60)
            if (seconds < 10) {
                return <p className="countdown warn">{minutes}:0{seconds} Min</p>
            } else {
                return <p className="countdown warn">{minutes}:{seconds} Min</p>
            }

        }
    }

    return (
        <div className="changer-container">
            {(error || (timeLeft != null && timeLeft <= 0)) &&
                <Navigate to="/changer" />
            }
            <div className="changer-sidebar">
                <div className="home-bg"></div>
                {apContent && apContent.navigation ?
                    <>
                        {apContent.navigation.map((section, index) => {
                            return <>
                                <h2 key={`${index}.1`}>
                                    <i className={section.fa_icon} />
                                    {section.ger}
                                </h2>
                                <ul key={`${index}.2`}>
                                    {section.items.map((category, li) =>
                                        <li className={`${!admin && category.admin_only ? "forbidden" : ""} ${content_id === category.path ? "active" : ""}`} key={`${index}.2.${li}`}>
                                            <Button path={category.path}>
                                                {category.ger}
                                                {!admin && category.admin_only &&
                                                    <i className="fa-solid fa-ban"></i>
                                                }
                                            </Button>
                                        </li>
                                    )}
                                </ul>
                            </>
                        })}
                    </>
                    :
                    <Loading />
                }

                <div className="changer-navigationBottom">
                    <Button onClick={logout} title="Logout">
                        <i className="fa-solid fa-arrow-right-from-bracket"></i>
                    </Button>
                    {getTimer(timeLeft)}
                    <LangChange ></LangChange>
                </div>
            </div>


            <div className="changer-main">
                <Outlet />
            </div>
        </div>
    )
}