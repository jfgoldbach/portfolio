import { useEffect, useMemo, useState } from "react"

export default function useIntersectionObserver (targetRef: React.MutableRefObject<any>, threshold: number = 0.3, rootMargin: string = "0px") {
    const [inArea, setInArea] = useState(false)

    const opts = useMemo(() => { //only change when options has different values
        return {
            root: null, // = viewport
            rootMargin: rootMargin,
            threshold: threshold
        }
    }, [rootMargin, threshold])

    const callback = (entries: IntersectionObserverEntry[]) => {
        setInArea(entries[0].isIntersecting) //only 1 entry passed in
    }

    useEffect(() => {
        const observer = new IntersectionObserver(callback, opts)
        const target = targetRef.current
        if(target){
            observer.observe(target)
        }

        return () => { //cleanup
            if(target){
                observer.unobserve(target)
            }
        }
    }, [opts, targetRef]) //only run when option or target changes

    
    //finally return the result
    return inArea 
}