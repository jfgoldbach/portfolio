import '../styles/css/Datenschutz.css'
import { useEffect, useRef, useState } from "react"
import instance from './network/axios'
import Loading from './helper/Loading'
import { errorType } from '../types/types'
import ErrorInfo from './helper/ErrorInfo'



function Datenschutz() {
  const [lr, setLr] = useState("")
  const [content, setContent] = useState<string | null>(null)
  const [error, setError] = useState<errorType>({} as errorType)
  const divRef = useRef<HTMLDivElement>(null)


  function getData() {
    setError({} as errorType)
    instance.get("?type=privacy_policy", { headers: { "jwt": sessionStorage.getItem("jwt") } }) //privacy_policy
      .then(response => response.data)
      .then(result => { setContent(result.content) })
      .catch(error => { console.warn(error); setError({ msg: error, code: "" }) })
  }

  useEffect(() => {
    getData()

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
    if (content && div) {
      div.innerHTML = content
      setLr("bottom")
    }
  }, [content])



  return (
    <div className={`datenschutz-lr ${lr}`}>
      <div ref={divRef} className="datenschutz-content" id="datenschutzContainer">
        {!content &&
          error.msg ?
          <ErrorInfo request={getData} autoRetry dark />
          :
          <Loading />
        }
      </div>
    </div>
  )
}

export default Datenschutz