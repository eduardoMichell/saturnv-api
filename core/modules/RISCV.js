const RvState = require('./RvState')
const RegFile = require('../riscv/regfile')
const InstMem = require('../riscv/instmem')
const DataMem = require('../riscv/datamem')
const Control = require('../riscv/controller')
const ALU = require('../riscv/alu')
const PC = require('../riscv/pc')
const ImmGen = require('../riscv/immGeneration')
const multiplexer2X1 = require('../riscv/controls/multiplexers/multiplexer2x1')
const add = require('../riscv/controls/add')
const memDataSelector = require('../riscv/controls/memDataSelector')
const aluDataSelector = require('../riscv/controls/aluDataSelector')
const {
  convertArrayBinaryToHexadecimal,
  convertConfigToText,
  getBinaryRange,
  getOpcode,
  getFunct3,
  getFunct7, decimalToBinary, binaryToDecimal
} = require('../utils/utils')


//TODO: VERIFICAR A QUANTIDADE E FORMATO DA SAIDA DA ALU, PC, REGFILE, ETC
// VERIFICAR O FORMATO DE TODOS PARAMETROS, STRING OU NUMBER
// FAZER O OTHER '0' PARA SAIDAS DE TODAS FUNCOES


module.exports = class RISCV {
  constructor(asm) {
    const { code, memories } = asm
    const { instMem, regFile, pc, dataMem } = memories
    this.code = new RvState(code)
    this.regFile = new RegFile(regFile)
    this.instMem = new InstMem(instMem, this.code.text)
    this.dataMem = new DataMem(dataMem, this.code.data)
    this.alu = new ALU()

    this.pc = new PC(pc)
    this.immGen = new ImmGen()
    this.control = new Control()
  }

  runTheCurrentProgram() {
    //TODO: vai usar a função run one step at time em um for
  }

  run() {
    //PC
    console.log(this.instMem.readInstruction(this.pc.getPc()))
    const instruction = this.instMem.readInstruction(this.pc.getPc()).code
    console.log('instruction',instruction)
    //DECODE
    const {
      aluOp,
      aluSrcImm,
      immShamt,
      immUp,
      regWrite,
      invBranch,
      branch,
      jump,
      jalr,
      memRead,
      memWrite,
      loadUpImm,
      auipc,
      memBen,
      memUsgn
    } = this.control.generateControl(getOpcode(instruction), getFunct3(instruction), getFunct7(instruction))
    console.log('opcode',getOpcode(instruction))
    console.log('funct3',getFunct3(instruction))
    console.log('funct7',getFunct7(instruction))
    console.log('aluOp',aluOp)
    console.log('aluSrcImm',aluSrcImm)
    console.log('immShamt',immShamt)
    console.log('immUp',immUp)
    console.log('regWrite',regWrite)
    console.log('invBranch',invBranch)
    console.log('branch',branch)
    console.log('jump',jump)
    console.log('jalr',jalr)
    console.log('memRead',memRead)
    console.log('memWrite',memWrite)
    console.log('loadUpImm',loadUpImm)
    console.log('auipc',auipc)
    console.log('memBen',memBen)
    console.log('memUsgn',memUsgn)
    const rd1 = getBinaryRange(19, 15, instruction)
    const rd2 = getBinaryRange(24, 20, instruction)
    const writeRg = getBinaryRange(11, 7, instruction)
    console.log('rd1',rd1)
    console.log('rd2',rd2)
    console.log('writeRg', writeRg)
    const rgData1 = this.regFile.read(rd1)
    const rgData2 = this.regFile.read(rd2)
    console.log('rgData1',rgData1)
    console.log('rgData2',rgData2)

    const instImm = this.immGen.generate(instruction, immShamt, immUp, memWrite, jump, jalr)
    console.log('instImm',instImm)

    const { aluInput1, aluInput2 } = aluDataSelector(auipc, jump, jalr, aluSrcImm, this.pc.getPc(), instImm, rgData1, rgData2)
    console.log('aluInput1',aluInput1)
    console.log('aluInput2',aluInput2)

    //EXEC
    const { aluZero, aluResult } = this.alu.executeALU(aluOp, aluInput1, aluInput2)
    console.log('aluZero',aluZero)
    console.log('aluResult',aluResult)

    //MEM ACCESS
    this.dataMem.writeMemory(aluResult, rgData2, memWrite)
    const dataMemData = this.dataMem.readMemory(aluResult, rgData2, memRead, memBen, memUsgn)
    //WRITEBACK
    const regFileWriteData = memDataSelector(memRead, loadUpImm, jump, dataMemData, instImm, this.pc.plusFour(), aluResult)
    console.log('regFileWriteData',regFileWriteData)
    this.regFile.write(regWrite, writeRg, regFileWriteData)
    const pcSel = branch && (aluZero ^ invBranch)
    const newPc = multiplexer2X1(this.pc.plusFour(), add(this.pc.getPc(), instImm), pcSel)
    console.log('pcSel',pcSel)
    console.log('newPc',newPc)

    this.pc.setPc(newPc)
  }

  runOneStep() {

  }


  dump(type) {
    switch (type) {
    case 'binary':
      return this.code.text.code
    case 'hexadecimal':
      return convertArrayBinaryToHexadecimal(this.code.text.code)
    case 'text':
      return convertConfigToText(this.code, this.instMem.memory, this.pc.pc)
    }
  }


}
