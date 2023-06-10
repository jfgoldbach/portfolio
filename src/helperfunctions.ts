export function arrEquals(array1: any[], array2: any[]) {
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