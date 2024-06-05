import defaultImageProfile from "../../assets/user-icon-on-transparent-background-free-png.png"

const getUserImage = (user) => {
  return (user.photo!=null)?"https://apisociablesphere-production.up.railway.app/images/"+user.photo:defaultImageProfile;
}

export default getUserImage