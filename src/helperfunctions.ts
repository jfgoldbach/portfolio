export function arrEquals(array1: any[], array2: any[]) {
    if(array1 === undefined || array2 === undefined) return false

    if (array1.length !== array2.length) return false

    try {
        for (let i = 0; i < array1.length; i++) {
            if (JSON.stringify(array1[i]).replaceAll(" ", "") !== JSON.stringify(array2[i]).replaceAll(" ", "")) {
                return false
            }
        }
        return true
    } catch (error) {
        console.log(error)
    }

}


export function entriesToJson(array: [string, any][]){
    let result: {[index: string]: any} = new Object
    array.forEach(entry => {
        result[entry[0]] = entry[1]
    })
    return JSON.stringify(result)
}