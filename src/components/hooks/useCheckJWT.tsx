import instance from "../network/axios"



export default function useCheckJWT() {

    const check = new Promise((resolve, reject) => {
        //console.log("check")
        const jwt = sessionStorage.getItem("jwt")
        if (jwt) {
            //console.log("jwt found")
            const expires = JSON.parse(atob(jwt.split(".")[1])).exp
            const now = Math.floor(new Date().getTime() / 1000)
            if ((expires - 30) <= now) {
                //console.log("jwt expires soon!")
                return instance.get("?type=guestToken")
                    .then(response => response.data)
                    .then(result => {
                        //console.log("set new jwt")
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
            //console.log("no jwt")
            return instance.get("?type=guestToken")
                .then(response => response.data)
                .then(result => {
                    //console.log("set new jwt")
                    //resolving only properly works (so that session storage is set) when wrapping this in a Promise
                    return new Promise((resol, rej) => { 
                        sessionStorage.setItem("jwt", result)
                        if(sessionStorage.getItem("jwt")){
                            //console.log("resolve")
                            resol("Successfully set jwt.")
                            resolve("Successfully set jwt.")
                        } else {
                            //console.log("reject")
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
                //console.log("set new jwt")
                sessionStorage.setItem("jwt", result)
            })
            .catch(error => {
                //console.error(error)
            })
    }

    return { check, genNew }
}