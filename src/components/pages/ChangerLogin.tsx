import { ChangeEvent, FormEvent, useContext, useEffect, useRef, useState } from "react"
import { Link, Navigate } from "react-router-dom";
import { LangContext, cookieContext } from "../../App";
import useCheckJWT from "../hooks/useCheckJWT";
import instance from "../network/axios";
import { toast } from "react-toastify";
import Loading from "../helper/Loading";
import ErrorInfo from "../helper/ErrorInfo";
import { captchaVerify, errorType } from "../../types/types";
import FriendlyCaptcha from "../helper/FriendlyCaptcha";
import CookieMsg from "../Info/CookieMsg";



export default function ChangerLogin() {
    const [fails, setFails] = useState<number | null>(null)
    const [timeLeft, setTimeLeft] = useState(5)
    const [pwVisible, setPwVisible] = useState(false)
    const [pw, setPw] = useState("")
    const [user, setUser] = useState("")
    const [success, setSuccess] = useState(false)
    const [navigate, setNavigate] = useState(false)
    const { lang } = useContext(LangContext)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<errorType>({} as errorType)
    const [valid, setValid] = useState<captchaVerify>("verify")
    const [width, setWidth] = useState<number>(500)

    const submitRef = useRef<HTMLButtonElement>(null)
    const nameRef = useRef<HTMLInputElement>(null)
    const windowRef = useRef<HTMLDivElement>(null)

    const { cookie } = useContext(cookieContext)

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
            setFails(prev => {
                if (prev != null) {
                    return prev + 1
                }
                return prev
            })
            const button = submitRef.current

            if (fails && fails > 1) {
                decrementTime()
            }
        }
    }

    function getDemoAccess() {
        check.then(() => {
            setNavigate(true)
        })
    }

    function getAttempts() {
        setError({} as errorType)
        instance.get(`?type=attempts`, { headers: { "jwt": sessionStorage.getItem("jwt") } })
            .then(response => response.data)
            .then(result => {
                console.log("attempts, ip:", result)
                setFails(result[0])
            })
            .catch(error => setError({ "msg": error, "code": "" }))
    }

    useEffect(() => {
        const metaIcon: HTMLLinkElement = document.getElementById("icon") as HTMLLinkElement
        if (metaIcon) {
            metaIcon.href = "/images/favicon.ico"
        }
        setTitle()
    }, [])

    useEffect(() => {
        if (valid === "valid") {
            getAttempts()
        }
    }, [valid])


    useEffect(() => {
        console.log("fails", fails)
        const firstField = nameRef.current
        //focus/unfocus name field depending on availability
        if (fails && fails < 3 && firstField) {
            firstField.focus()
        } else if (firstField) {
            firstField.blur()
        }
    }, [fails])

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

    function getWidth() {
        const window = windowRef.current
        if(window) {
            const windowWidth = window.clientWidth
            if(windowWidth > 300){
                setWidth(window.clientWidth * 0.9)
            } else {
                setWidth(window.clientWidth)
            }
        }
    }

    useEffect(() => {
        getWidth()
    }, [])

    return (
        <div className={`login scaleIn`}>
            {(success || navigate) &&
                <Navigate to="/changer/loggedin" />
            }

            <CookieMsg width={width} />

            <div ref={windowRef} className={`window ${cookie ? "" : "unavailBlur"}`}>
                <h1>{lang === "eng" ? "Login" : "Anmeldung"}</h1>

                {(fails != null && fails > 2) &&
                    <p className="tooMany">
                        <i className="fa-solid fa-triangle-exclamation" />
                        <p>
                            {lang === "eng" ?
                                "You have tried to log in as admin too many times."
                                :
                                "Es wurde zu oft versucht, sich als Admin anzumelden."
                            }
                        </p>
                    </p>
                }

                <form
                    onSubmit={submit}
                    className={`
                    ${(fails && fails > 2) || valid === "invalid" || valid === "verify" ? "inactive" : ""} 
                    ${fails == null ? "fetching" : ""}
                    `}
                >
                    {(fails == null && error.msg === undefined) &&
                        <Loading light />
                    }
                    {error.msg !== undefined &&
                        <ErrorInfo msg={error.msg} request={getAttempts} dark />
                    }
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
                            title={lang === "eng" ?
                                `The password is currently ${pwVisible ? "visible" : "hidden"}.\nClick to make the password ${pwVisible ? "hidden" : "visible"}.`
                                :
                                `Das Passwort ist gerade ${pwVisible ? "sichtbar" : "versteckt"}.\nDurch Klicken wird das Passwort ${pwVisible ? "versteckt" : "sichtbar"}.`
                            }
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
                    {(fails != null && fails > 0 && fails < 3) &&
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


                <Link to="/changer" onClick={getDemoAccess} className={valid === "verify" || valid === "invalid" ? "inactive" : ""}>
                    {lang === "eng" ? "Use demonstration access" : "Demonstrationszugang benutzen"}
                </Link>


            </div>

            {cookie && <FriendlyCaptcha setValid={setValid} />}
        </div>
    )
}