import { useContext } from "react";
import { viewerContext } from "./ModelViewer";

type meshcardProps = {
    id: number;
    path: string;
    img: string;
    name: string;
    verts?: number;
}

export default function MeshCard({ id, img, name, verts, path }: meshcardProps) {
    const { setActiveModel } = useContext(viewerContext)

    function setModel() {
        setActiveModel(path)
    }

    return (
        <div className="meshCard" style={{ animationDelay: `${id * 0.025}s` }} onClick={setModel}>
            <div className="img-container">
                <img src={img}></img>
                <p>{verts} vertices</p>
            </div>
            <h2>{name}</h2>
        </div>
    )
}