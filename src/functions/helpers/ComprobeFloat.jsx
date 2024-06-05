

const comprobeFloat = (cost) => {
  let costAux = String(cost).replace(",",".");
  let costInNumber = parseFloat(costAux);
  if(String(costInNumber).split(".").length>1){
    if(costAux.split(".")[1].length>2){
      return true;
    }
  }
  return !(!isNaN(costInNumber) && costInNumber > 0);
}

export default comprobeFloat