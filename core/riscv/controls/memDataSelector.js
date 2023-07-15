
module.exports = (memRead,loadUpImm, jump, dataMemData, instImm, pcPlusFour ,aluResult) => {
  let result

  switch (true) {
  case memRead:
    result = dataMemData
    break
  case loadUpImm:
    result = instImm
    break
  case jump:
    result = pcPlusFour
    break
  default:
    result = aluResult
    break
  }
  return result
}