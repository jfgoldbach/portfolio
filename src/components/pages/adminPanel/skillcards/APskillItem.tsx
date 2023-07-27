import SkillCard from "../../../SkillCard"
import { useSortable } from '@dnd-kit/sortable'
import {CSS} from "@dnd-kit/utilities"


type skillitemProps = {
    id: number
    skill: string
    type?: string
}


function APskillItem({ id, skill, type }: skillitemProps) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <SkillCard draggable noHover skill={skill} type={type} />
        </div>
    )
}

export default APskillItem