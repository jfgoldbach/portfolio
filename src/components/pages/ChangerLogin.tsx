import { ChangeEvent, FormEvent, useContext, useEffect, useRef, useState } from "react"
import { Link, Navigate } from "react-router-dom";
import { LangContext } from "../../App";
import useCheckJWT from "../hooks/useCheckJWT";
import instance from "../network/axios";
import BlurredBg from "../visuals/BlurredBg";
import { toast } from "react-toastify";
import Loading from "../helper/Loading";
//styles in Changer.sass


export default function ChangerLogin() {
    const [fails, setFails] = useState(0)
    const [timeLeft, setTimeLeft] = useState(5)
    const [pwVisible, setPwVisible] = useState(false)
    const [pw, setPw] = useState("")
    const [user, setUser] = useState("")
    const [success, setSuccess] = useState(false)
    const [navigate, setNavigate] = useState(false)
    const { lang } = useContext(LangContext)
    const [loading, setLoading] = useState(false)
    const submitRef = useRef<HTMLButtonElement>(null)
    const nameRef = useRef<HTMLInputElement>(null)

    const { check } = useCheckJWT()


    function decrementTime() {
        setTimeout(() => {
            setTimeLeft(prev => prev - 1)
        }, 1000);
    }

    async function submit(e: FormEvent) {
        e.preventDefault()
        setLoading(true)

        let valid = false
        let axiosError: string | null = null

        await instance.get(`?type=login&user=${user}&password=${pw}`, { headers: { "jwt": sessionStorage.getItem("jwt") } })
            .then(response => response.data)
            .then(result => {
                console.log("result:", result)
                setSuccess(result ?? false);
                sessionStorage.setItem("jwt", result);
                valid = (result !== false)
            })
            .catch(error => {
                toast.warn(error)
                if (error.response.status !== 404) {
                    toast.warn(error)
                }
            })

        setLoading(false)

        if (!valid && !axiosError) { //invalid attempt
            toast.warn(lang === "eng" ? "Wrong credentials" : "Falsche Anmeldedaten")
            setUser("")
            setPw("")
            nameRef.current?.focus()
            setFails(prev => prev + 1)
            const button = submitRef.current

            if (fails > 1) {
                decrementTime()
            }
        }
    }

    function getDemoAccess() {
        check.then(() => {
            setNavigate(true)
        })
    }

    useEffect(() => {
        nameRef.current?.focus()
        instance.get(`?type=attempts&user=${user}&password=${pw}`, { headers: { "jwt": sessionStorage.getItem("jwt") } })
            .then(response => response.data)
            .then(result => {
                console.log("attempts on this ip:", result)
                setFails(result)
            })
        //check
        const metaIcon: HTMLLinkElement = document.getElementById("icon") as HTMLLinkElement
        if (metaIcon) {
            metaIcon.href = "/images/favicon.ico"
        }
        setTitle()
    }, [])

    useEffect(() => {
        setTitle()
    }, [lang])

    function setTitle() {
        document.title = `${lang === "eng" ? "Julian Goldbach - Login" : "Julian Goldbach - Anmeldung"}`
    }

    useEffect(() => {
        if (timeLeft < 5 && timeLeft > 0) {
            decrementTime()
        } else if (timeLeft <= 0) {
            window.location.pathname = ""
        }
    }, [timeLeft])

    useEffect(() => {
        if (success) {
            setNavigate(true)
            console.log("success")
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
            {(success || navigate) &&
                <Navigate to="/changer/loggedin" />
            }

            <div className="window">
                <h1>{lang === "eng" ? "Login" : "Anmeldung"}</h1>

                <form onSubmit={submit} className="">
                    <div className="input-container">
                        <input
                            ref={nameRef}
                            autoFocus
                            required
                            type="text"
                            value={user}
                            onChange={changeUser}
                        />
                        <label>{lang === "eng" ? "Username" : "Benutzername"}</label> {/* has to be placed underneath input */}
                    </div>
                    <div className="input-container" id="password">
                        <input
                            required
                            type={pwVisible ? "text" : "password"}
                            value={pw}
                            onChange={changePw}
                        />
                        <label>{lang === "eng" ? "Password" : "Passwort"}</label>
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
                            <i className="fa-solid fa-triangle-exclamation" />
                            {3 - fails} {lang === "eng" ? `attempt${fails === 2 ? "" : "s"} left` : `Versuch${fails === 2 ? "" : "e"} übrig`}
                        </p>
                    }
                    <button ref={submitRef} type="submit" className={`submitLogin ${user.length > 2 && pw.length > 7 ? "" : "inactive"} ${loading ? "loading" : ""}`}>
                        {loading ?
                            <Loading light small />
                            :
                            lang === "eng" ? "Sign in" : "Anmelden"
                        }
                    </button>
                </form>


                <Link to="/changer" onClick={getDemoAccess}>
                    {lang === "eng" ? "Use demonstration access" : "Demonstrationszugang benutzen"}
                </Link>
            </div>
        </div>
    )
}