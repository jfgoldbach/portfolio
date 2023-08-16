import { useEffect, useState } from "react"
import instance from "../network/axios"
import Loading from "../helper/Loading"

type imprintElement = {
    "type": "header" | "paragraph"
    "text": string
}

type imprintContent = imprintElement[][]


function Imprint() {
    const [content, setContent] = useState<imprintContent | null>(null)

    useEffect(() => {
        instance.get("?type=imprint", { headers: { "jwt": sessionStorage.getItem("jwt") } })
            .then(response => response.data)
            .then(result => { setContent(result.content); console.log(result.content) })
            .catch(error => console.warn(error))
    }, [])



    return (
        <>
            {content ?
                <>
                    {content.map(section => {
                        return (
                            <div className="contact-info">
                                {section.map(elem => {
                                    switch (elem.type) {
                                        case "header":
                                            return <h2>{elem.text}</h2>
                                        case "paragraph":
                                            return <p>{elem.text}</p>
                                    }
                                })}
                            </div>
                        )
                    })}
                </>
                :
                <Loading />
            }
        </>
    )
}

export default Imprint