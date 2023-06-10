import { useEffect } from "react"
import { indexTrackType } from "../../types/types"

type closestType = { 
    offset: [number, number], 
    element?: Element, 
    index?: number 
}



export default function useDragObject(
    objRef: React.RefObject<HTMLDivElement>,
    containerRef: React.RefObject<HTMLDivElement>,
    changedIndex: React.MutableRefObject<indexTrackType>,
    local: any[],
    setLocal: React.Dispatch<React.SetStateAction<any[]>>,
    listID: number | string,
    index: number) {



    //get the next following element: also saves the new index of the moved element (which has the same index as the current closest)
    function getNextElem(x: number, y: number) {
        const container = containerRef.current
        const nodes = container?.querySelectorAll(`#dragCon${listID} > .draggable`)
        let elements: Element[] | null = null
        let closest: closestType = { offset: [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY] }
        if (nodes) {
            elements = Array.from(nodes)
            closest = elements?.reduce((closest, child, index) => {
                const box = child.getBoundingClientRect()
                const offsetX = x - box.left - (box.width / 2)
                const offsetY = y - box.top - (box.height / 2)
                if ((offsetY < 0 && offsetY > closest.offset[1]) || (offsetX < 0 && offsetX > closest.offset[0])) {
                    return { offset: [offsetX, offsetY], element: child, index: index }
                } else {
                    return closest
                }
            }, { offset: [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY] })
            //console.log(closest.offset, (closest.element as HTMLElement)?.innerText)
        }
        if (closest) {
            if (closest.element) {
                changedIndex.current[1] = closest.index ?? null //save new index
                return closest.element
            }
        }
        return null
    }


    //reorders current list with given data & returns result
    function reorder(prev: typeof local) {
        //console.log("reorder")
        const movedIndex = changedIndex.current[0]
        const newIndex = changedIndex.current[1]
        if (local != null && movedIndex != null) {
            let changedOrder = [...local]
            const elemMoved = changedOrder[movedIndex]
            //console.log("indexes", changedIndex)
            changedOrder.splice(movedIndex, 1)
            if(newIndex === null){
                changedOrder.push(elemMoved)
                //console.log("elem moved", elemMoved)
            } else {
                changedOrder.splice(newIndex, 0, elemMoved)
                //console.log("elem moved", elemMoved)
            }
            //console.log(local, changedOrder)
            return changedOrder
        } else {
            //console.error("Invalidly indexed", changedIndex)
            return prev
        }
    }


    //what happens when an element is dragged over this element (the container)
    function onDragOver(e: DragEvent) {
        const container = containerRef.current
        e.preventDefault()
        const next = getNextElem(e.clientX, e.clientY)
        const drag = objRef.current
        if (drag) {
            if (next === null) {
                container?.appendChild(drag)
            } else {
                container?.insertBefore(drag, next)
            }
        }
    }


    //adds event listeners to drag object, whenever its ref changes
    useEffect(() => {
        const container = containerRef.current
        const obj = objRef.current
        if (obj) {
            obj.addEventListener("dragstart", () => {
                //console.log("dragging")
                obj.classList.add("dragging")
                const currIndex = local?.findIndex(elem => elem.name === (obj as HTMLElement).innerText)
                //console.log(local[currIndex].name, obj.innerText)
                changedIndex.current[0] = index ?? null /* currIndex ?? null */ //save index of dragging element
                if (container) {
                    //console.log("add listener")
                    container.addEventListener("dragover", onDragOver)
                } else {
                    //console.error("Container ref is undefined")
                }
            })
            obj.addEventListener("dragend", () => {
                obj.classList.remove("dragging")
                container?.removeEventListener("dragover", onDragOver)
                setLocal(prev => reorder(prev))
            })
        }
    }, [objRef])
}
