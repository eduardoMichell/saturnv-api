const { DATA_MEM_INIT } = require('../utils/constants/memConfig')
const { binaryToDecimal } = require('../utils/utils')
module.exports = class DataMem {
  constructor(dataMem, data) {
    this.memory = this.#setDataToDataMem(dataMem, data)
  }
  writeMemory(address, data, memWrite) {
    if (memWrite){
      this.memory[address] = data;
    }
  }
  readMemory(address, rgData2, memRead, memBen, memUsgn) {
    if (memRead){
      return  this.memory[binaryToDecimal(address)];
    }
  }

  #setDataToDataMem(datamem, data) {
    let total = 0
    for (const dataI of data){
      for (let i = 0; i < dataI.basic.length; i++){
        datamem[DATA_MEM_INIT + total*4] = dataI.basic[i];
        total++;
      }
    }
    return datamem;
  }

}
