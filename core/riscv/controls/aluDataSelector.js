module.exports = (auipc, jump, jalr, aluSrcImm, pc, instImm, rgData1, rgData2) => {
  let aluInput1 = 0
  let aluInput2 = 0

  if (auipc || (jump && !jalr)){
    aluInput1 = pc
  } else {
    aluInput1 = rgData1
  }
  if (aluSrcImm){
    aluInput2 = instImm
  } else {
    aluInput2 = rgData2
  }


  return { aluInput1, aluInput2 }
}