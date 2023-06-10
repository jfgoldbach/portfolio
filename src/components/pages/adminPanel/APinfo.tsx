import { useContext } from "react"
import { LangContext } from "../../../App"
import Button from "../../Button"

type infoProps = {
  index: number,
  path: string,
  ger: string,
  eng: string
}

function APinfo({ index, path, ger, eng }: infoProps) {
  const { lang } = useContext(LangContext)
  return (
    <div className="apcSection apcInfo slide-in" style={{ animationDelay: `${index * 0.05}s` }}>
      <i className="fa-solid fa-circle-info"></i>
      <p>{lang === "eng" ? eng : ger}</p>
      <Button path={path} title={path}>
        <i className="fa-solid fa-arrow-right"></i>
      </Button>
    </div>
  )
}

export default APinfo