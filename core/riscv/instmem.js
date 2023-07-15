const { INST_MEM_INIT } = require('../utils/constants/memConfig')
module.exports = class InstMem {
  constructor(instMem, text) {
    this.memory = this.#setTextToInstMem(instMem, text)
  }
  #setTextToInstMem(instMem, text) {
    const instMemInit = INST_MEM_INIT
    const totalOfInstruction = text.basic.length
    for (let i = 0; i < totalOfInstruction; i++) {
      instMem[instMemInit + i*4].basic = text.basic[i]
      instMem[instMemInit + i*4].code = text.code[i]
      instMem[instMemInit + i*4].source = text.source[i]
    }
    return instMem
  }

  readInstruction(address) {
    return this.memory[address]
  }

}
