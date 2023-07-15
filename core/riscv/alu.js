const { decimalToBinary, binaryToDecimal, toUnsigned32 } = require('../utils/utils')
const Operations = require('../utils/constants/aluOperation')

module.exports = class ALU {
  constructor() {
  }

  executeALU(aluControl, inputA, inputB) {
    let aluZero = false
    let aluResult = 0
    switch (aluControl) {
    case Operations.ADD:
      aluResult = inputA + inputB
      break
    case Operations.SUB:
      aluResult = inputA - inputB
      break
    case Operations.AND:
      aluResult = inputA & inputB
      break
    case Operations.OR:
      aluResult = inputA | inputB
      break
    case Operations.XOR:
      aluResult = inputA ^ inputB
      break
    case Operations.SLL:
      let sllRes = inputA
      sllRes <<= inputB
      aluResult = sllRes
      break
    case Operations.SRL:
      let srlRes = inputA
      srlRes >>>= inputB
      aluResult = srlRes
      break
      case Operations.SRA:
      aluResult = inputA >> inputB
      break
    case Operations.SLT:
      aluResult = inputA < inputB
      break
    case Operations.SLTU:
      aluResult = toUnsigned32(inputA) | toUnsigned32(inputB)
      break
    }
    aluZero = this.#checkIsZero(aluResult)
    return { aluResult, aluZero }
  }

  #checkIsZero(value){
    return value === 0
  }

}

