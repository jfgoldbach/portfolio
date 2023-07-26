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
    <div className="apcSection apcInfo scaleIn" style={{ animationDelay: `${index * 0.05}s` }}>
      <div className="content">
        <i className="fa-solid fa-circle-info"></i>
        <p>{lang === "eng" ? eng : ger}</p>
        <Button path={path} title={path}>
          <i className="fa-solid fa-arrow-right"></i>
        </Button>
      </div>
    </div>
  )
}

export default APinfo