import '../styles/css/Datenschutz.css'
import { useEffect, useRef, useState } from "react"
import instance from './network/axios'
import Loading from './helper/Loading'



function Datenschutz() {
  const [lr, setLr] = useState("")
  const [content, setContent] = useState<string | null>(null)
  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    instance.get("?type=privacy_policy", { headers: { "jwt": sessionStorage.getItem("jwt") } })
      .then(response => response.data)
      .then(result => { setContent(result.content)})
      .catch(error => console.warn(error))

    const container = document.getElementById("datenschutzContainer")

    const changeLr = () => {
      let classes = []
      if (container && container.scrollTop > 15) {
        classes.push('top')
      }
      if (container && container.scrollHeight - container.scrollTop - container.clientHeight > 15) {
        classes.push('bottom')
      }
      setLr(classes.toString().replace(",", " "))
    }

    if (container) {
      container.addEventListener("scroll", changeLr)
    }

    return (() => {
      const container = document.getElementById("datenschutzContainer")
      if (container) {
        container.removeEventListener("scroll", changeLr)
      }
    })
  }, [])

  useEffect(() => {
    const div = divRef.current
    if(content && div) {
      div.innerHTML = content
      setLr("bottom")
    }
  }, [content])



  return (
    <div className={`datenschutz-lr ${lr}`}>
      <div ref={divRef} className="datenschutz-content" id="datenschutzContainer">
        {!content && <Loading />}
      </div>
    </div>
  )
}

export default Datenschutz