
const comprobeActiveAdds = () => {
    const stringToBoolean = (str) => str === "true";
    if(localStorage.getItem("adds")===undefined)
        return false;
    return stringToBoolean(localStorage.getItem("adds"));
}

export default comprobeActiveAdds