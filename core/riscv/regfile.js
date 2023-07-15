const { binaryToDecimal, decimalToBinary } = require('../utils/utils')
module.exports = class RegFile {
  constructor(regFile) {
    this.registers = regFile
  }

  writeRegister(index, value) {
    this.registers[index] = value
  }

  readRegister(index) {
    return this.registers[index]
  }

  read(rd) {
    return this.readRegister('x' + binaryToDecimal(rd))
  }

  write(regWrite, writeRg, data){
    if (regWrite){
      this.writeRegister('x' + binaryToDecimal(writeRg), data)
    }
  }
}





