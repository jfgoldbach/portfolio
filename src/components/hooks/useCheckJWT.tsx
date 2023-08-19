import instance from "../network/axios"



export default function useCheckJWT() {

    const check = new Promise((resolve, reject) => {
        const jwt = sessionStorage.getItem("jwt")
        if (jwt) {
            const expires = JSON.parse(atob(jwt.split(".")[1])).exp
            const now = Math.floor(new Date().getTime() / 1000)
            if ((expires - 30) <= now) {
                return instance.get("?type=guestToken")
                    .then(response => response.data)
                    .then(result => {
                        return new Promise((resol, rej) => {
                            sessionStorage.setItem("jwt", result)
                            if(sessionStorage.getItem("jwt")){
                                resol("Successfully set jwt.")
                                resolve("Successfully set jwt.")
                            } else {
                                rej("Couldn't set jwt.")
                                reject("Couldn't set jwt.")
                            }
                        })
                        
                    })
                    .catch(error => reject(error))

            } else {
                resolve("JWT is up to date")
            }
        } else {
            return instance.get("?type=guestToken")
                .then(response => response.data)
                .then(result => {
                    //resolving only properly works (so that session storage is set) when wrapping this in a Promise
                    return new Promise((resol, rej) => { 
                        sessionStorage.setItem("jwt", result)
                        if(sessionStorage.getItem("jwt")){
                            resol("Successfully set jwt.")
                            resolve("Successfully set jwt.")
                        } else {
                            rej("Couldn't set jwt.")
                            reject("Couldn't set jwt.")
                        }})
                })
                .catch(error => reject(error))
        }
        reject("error reading jwt")
    })

    async function genNew() {
        await instance.get("?type=guestToken")
            .then(response => response.data)
            .then(result => {
                sessionStorage.setItem("jwt", result)
            })
            .catch(error => {
                console.error(error)
            })
    }

    return { check, genNew }
}