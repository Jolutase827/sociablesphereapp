
const comprobeIntegerLessThan100 = (people) => {
    if (people !== null && !isNaN(parseInt(people)) && String(people).split(".").length===1 && people > 0 && people < 100) {
        return false;
    }
    return true;
};
export default comprobeIntegerLessThan100;