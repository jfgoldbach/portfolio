import axios from "axios";
import { ChangeEvent, ChangeEventHandler, FormEvent, useContext, useEffect, useRef, useState } from "react"
import { Link, Navigate } from "react-router-dom";
import { LangContext } from "../../App";
import request from '../../request.json'
import useCheckJWT from "../hooks/useCheckJWT";
import instance from "../network/axios";
import BlurredBg from "../visuals/BlurredBg";



export default function ChangerLogin() {
    const [fails, setFails] = useState(0)
    const [timeLeft, setTimeLeft] = useState(5)
    const [pwVisible, setPwVisible] = useState(false)
    const [pw, setPw] = useState("")
    const [user, setUser] = useState("")
    const [success, setSuccess] = useState(false)
    const [navigate, setNavigate] = useState(false)
    const [jwt, setJWT] = useState("")
    const { lang } = useContext(LangContext)
    const submitRef = useRef<HTMLButtonElement>(null)

    const { check } = useCheckJWT()


    function decrementTime() {
        setTimeout(() => {
            setTimeLeft(prev => prev - 1)
        }, 1000);
    }

    async function submit(e: FormEvent) {
        e.preventDefault()

        let valid = false
        let axiosError: string | null = null

        await instance.get(`?type=login&user=${user}&password=${pw}`,{headers: {"jwt": sessionStorage.getItem("jwt")}})
            .then(response => response.data)
            .then(result => { setSuccess(result !== false); sessionStorage.setItem("jwt", result); valid = (result !== false) })
            .catch(error => {
                if (error.response.status !== 404) {
                    alert(error)
                    //axiosError = error 
                }
            })

        if (!valid && !axiosError) { //invalid attempt
            setUser("")
            setPw("")
            setFails(prev => prev + 1)
            const button = submitRef.current
            if (button) {
                button.classList.add("wrong")
                setTimeout(() => {
                    button.classList.remove("wrong") //not ideal!!!
                }, 330);
            }

            if (fails > 1) {
                decrementTime()
            }
        }
    }

    function getDemoAccess() {
        check.then(() => setNavigate(true))
    }

    useEffect(() => {
        //check
        const metaIcon: HTMLLinkElement = document.getElementById("icon") as HTMLLinkElement
        if(metaIcon){
            metaIcon.href = "/images/favicon.ico"
        }
        document.title = "Julian Goldbach - Login"
    }, [])

    useEffect(() => {
        if (timeLeft < 5 && timeLeft > 0) {
            decrementTime()
        } else if (timeLeft <= 0) {
            window.location.pathname = ""
        }
    }, [timeLeft])

    useEffect(() => {
        if (success) {
            setTimeout(() => {
                setNavigate(true)
            }, 750);
        }
    }, [success])

    function toggleVisible() {
        setPwVisible(prev => !prev)
    }

    function changeUser(e: ChangeEvent<HTMLInputElement>) {
        setUser(e.target.value)
    }

    function changePw(e: ChangeEvent<HTMLInputElement>) {
        setPw(e.target.value)
    }

    return (
        <div className={`login ${fails > 2 ? "failed" : ""}`}>
            <BlurredBg />
            {navigate &&
                <Navigate to="/changer/loggedin" />
            }
            <form className="window" onSubmit={submit}>
                {fails > 2 ?
                    <>
                        <h2>You are not permitted to login.</h2>
                        <p>Redirecting you to the landing page...</p>
                        <p>{timeLeft}</p>
                    </>
                    :
                    <>
                        <h1>{lang === "eng" ? "Login" : "Anmeldung"}</h1>
                        <div className="input-container">
                            <input
                                autoFocus
                                required
                                type="text"
                                value={user}
                                onChange={changeUser}
                            />
                            <label>Username</label> {/* has to be place underneath input */}
                        </div>
                        <div className="input-container" id="password">
                            <input
                                required
                                type={pwVisible ? "text" : "password"}
                                value={pw}
                                onChange={changePw}
                            />
                            <label>Password</label>
                            <button
                                title={lang === "eng" ? `The password is currently ${pwVisible ? "visible" : "hidden"}.\nClick to make the password ${pwVisible ? "hidden" : "visible"}.` :
                                    `Das Passwort ist gerade ${pwVisible ? "sichtbar" : "versteckt"}.\nDurch Klicken wird das Passwort ${pwVisible ? "versteckt" : "sichtbar"}.`}
                                type="button"
                                onClick={toggleVisible}
                            >
                                {pwVisible ?
                                    <i className="fa-solid fa-eye-slash"></i>
                                    :
                                    <i className="fa-solid fa-eye"></i>
                                }
                            </button>
                        </div>
                        {fails > 0 && fails < 3 &&
                            <p className="warning-message">
                                <i className="fa-solid fa-triangle-exclamation"></i>
                                {3 - fails} {lang === "eng" ? "attempts left" : "Versuche übrig"}
                            </p>
                        }
                        {success &&
                            <div className="check-container">
                                <i className="fa-solid fa-check"></i>
                            </div>
                        }
                        <button ref={submitRef} type="submit">{lang === "eng" ? "Sign in" : "Anmelden"}</button>
                        <Link to="/changer" onClick={getDemoAccess}>{lang === "eng" ? "Use demonstration access" : "Demonstrationszugang benutzen"}</Link>
                    </>
                }
            </form>
        </div>
    )
}