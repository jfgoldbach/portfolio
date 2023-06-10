import { useEffect, useRef, useState } from "react"
import { arrEquals } from "../../helperfunctions"
import { indexTrackType } from "../../types/types"

export default function useDragContainer(
    list: any[],
    li: {mapIndex: number, startIndex?: number},
    parent?: any[][] | undefined,
    setParent?: React.Dispatch<React.SetStateAction<any[][] | undefined>>,
    ) {


    const [local, setLocal] = useState<any[]>([...list])
    const [changed, setChanged] = useState(false)
    const changedIndex = useRef<indexTrackType>([null, null]) //old index, new index



    useEffect(() => {
        if (local) {
            changedIndex.current = [null, null]
            const hasChanged = !arrEquals(local, list)
            setChanged(hasChanged)
            if (parent && setParent) {
                //apply changes to parent, so that it knows about changes
                if (hasChanged && li) {
                    let newChanges = [...parent]
                    console.log("new changes", newChanges)
                    newChanges[li.mapIndex] = [...local]
                    console.log("new changes", newChanges)
                    setParent(newChanges)
                }
            }
        }
    }, [local])


    function reset() {
        if (parent && li && setParent) {
            let newChanges = [...parent]
            newChanges[li.mapIndex] = list
            setParent(newChanges)
        }
        setLocal(list)
    }


    function clearSection() {
        if (parent && setParent) {
            
            if (li) {
                let newChanges = [...parent]
                newChanges[li.mapIndex] = []
                setLocal([])
                setParent(newChanges) //apply changes to parent, so that it know about changes
            }
            
        }
    }

    function removeItem(id: number) {
        if (parent && setParent) {
            let newChanges = [...local]
            newChanges.splice(id, 1)
            setLocal(newChanges)

            let parentChanges = [...parent]
            if (li?.mapIndex) {
                parentChanges[li.mapIndex] = newChanges
            } else {
                parentChanges = newChanges
            }
            setParent(parentChanges)
        }
    }


    function addItem(item: any) {
        let changedList = [...local]
        changedList?.push(item)
        setLocal(changedList)
    }


    return [
        local,
        setLocal,
        changed,
        reset,
        clearSection,
        addItem,
        removeItem,
        changedIndex] as
        [
            any[],
            React.Dispatch<React.SetStateAction<any[]>>,
            boolean,
            () => void,
            () => void,
            (item: any) => void,
            (id: number) => void,
            typeof changedIndex]
}