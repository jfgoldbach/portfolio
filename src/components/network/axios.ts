import axios from "axios"

const instance = axios.create({
    baseURL: "http://192.168.178.46:8000", //https://jfgoldbach.de/api
    timeout: 5000,
    headers:
        { 
            jwt: sessionStorage.getItem("jwt"),
            changes: "none"
        }
})

export default instance


//todo:

//Error handling, wenn server nicht erreicht wird