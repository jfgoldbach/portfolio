import { useContext, useEffect, useState } from "react"
import { Navigate, Outlet, useParams } from "react-router-dom"
import Button from "../../Button"
import useCheckJWT from "../../hooks/useCheckJWT"
import LangChange from "../../NavBar/LangChange"
import instance from "../../network/axios"
import Loading from "../../helper/Loading"
import { jwtPayload } from "../../../types/types"
import '../../../styles/css/Changer.css'
import { toast } from "react-toastify"
import { LangContext } from "../../../App"
import BlurredBg from "../../visuals/BlurredBg"


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
    const { lang } = useContext(LangContext)
    const { content_id } = useParams()
    const [apContent, setAPcontent] = useState<apNavigation>()
    const [error, setError] = useState<string>()
    const [showLogout, SetShowLogout] = useState(false)
    const [timeLeft, setTimeLeft] = useState<number | null>(null)
    const [admin, setAdmin] = useState(false) //could also be set in a hook (for the future)

    const { check, genNew } = useCheckJWT()


    useEffect(() => {
        setError("not allowed at this moment")
        toast.error(lang === "eng" ? "Not allowed at this moment" : "Zugang noch nicht erlaubt")

        const token = sessionStorage.getItem("jwt")
        if (token) {
            console.log(token)
            const payload: jwtPayload = JSON.parse(atob(token.split(".")[1]))
            if (payload.admin) {
                setAdmin(payload.admin)
            } else {
                console.error("Send access token doesn't have the admin property in its payload.")
            }

            instance.get("?type=adminPanel", { headers: { "jwt": sessionStorage.getItem("jwt") } })
                .then(response => response.data)
                .then(result => setAPcontent(result))
                .catch(error => setError(error))
        } else {
            console.error("No token found.")
            setError("No token found.")
            toast.error(lang === "eng" ? "Cant access without valid token" : "Zugang ohne gültigen Token nicht gestatet")
        }

        document.title = "Julian Goldbach - Admin panel"

        return (() => {
            genNew() //always generate new key when unmounting
        })
    }, [])

    useEffect(() => {
        const metaIcon: HTMLLinkElement = document.getElementById("icon") as HTMLLinkElement
        if (metaIcon) {
            metaIcon.href = admin ? "/images/favicon_ap_admin.ico" : "/images/favicon_ap_guest.ico"
        }
        document.title = `Admin panel as ${admin ? "Admin" : "Guest"}`
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

            if (timeLeft === 60) {
                toast.warn(lang === "eng" ? "Automatic logout in 60 seconds" : "Automatischer Logout in 60 Sekunden", {
                    pauseOnFocusLoss: false
                })
            }

            if (timeLeft === 10) {
                toast.warn(lang === "eng" ? "Automatic logout in 10 seconds" : "Automatischer Logout in 10 Sekunden", {
                    pauseOnFocusLoss: false
                })
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
        SetShowLogout(true)
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
            {/* <BlurredBg adminPanel /> */}
            {(error || (timeLeft != null && timeLeft <= 0)) &&
                <Navigate to="/changer" />
            }

            <div className="changer-vertbar">
                <div className="changer-navigationBottom">
                    <div className="nameContainer">
                        <h3 className={admin ? "admin" : "guest"}>
                            {admin ?
                                "Admin"
                                :
                                lang === "eng" ? "Guest" : "Gast"
                            }
                        </h3>
                        <p>
                            {getTimer(timeLeft)}
                        </p>
                    </div>
                    <Button buttonStyle="btn--light" onClick={logout} title="Logout">
                        <i className="fa-solid fa-arrow-right-from-bracket"></i>
                    </Button>
                </div>
                <LangChange />
            </div>

            <div className="changer-sidebar">
                {apContent && apContent.navigation ?
                    <>
                        {apContent.navigation.map((section, index) => {
                            return <>
                                <h2 key={`${index}.1`}>
                                    <i className={section.fa_icon} />
                                    {lang === "eng" ? section.eng : section.ger}
                                </h2>
                                <ul key={`${index}.2`}>
                                    {section.items.map((category, li) =>
                                        <li className={`${!admin && category.admin_only ? "forbidden" : ""} ${content_id === category.path ? "active" : ""}`} key={`${index}.2.${li}`}>
                                            <Button path={category.path} title={category.ger}>
                                                {!admin && category.admin_only &&
                                                    <i className="fa-solid fa-ban"></i>
                                                }
                                                {lang === "eng" ? category.eng : category.ger}
                                            </Button>
                                        </li>
                                    )}
                                </ul>
                            </>
                        })}
                    </>
                    :
                    <Loading light />
                }

            </div>


            <div className="changer-main">
                <Outlet />
            </div>

            {showLogout &&
                <div className="logoutInfo">
                    <p>{lang === "eng" ? "Logging out" : "Logge aus"}</p>
                    <Loading light />
                </div>
            }
        </div>
    )
}