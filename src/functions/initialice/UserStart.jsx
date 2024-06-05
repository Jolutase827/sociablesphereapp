
const userStart = () => {
    if(sessionStorage.getItem('user')!==null)
        return JSON.parse(sessionStorage.getItem('user'));
    if(localStorage.getItem('user')!==null)
        return JSON.parse(localStorage.getItem('user'));

    return null;

}

export default userStart