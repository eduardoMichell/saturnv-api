const RvState = require('./RvState');
const RegFile = require('../riscv/regfile');
const InstMem = require('../riscv/instmem');
const DataMem = require('../riscv/datamem');
const Control = require('../riscv/controller');
const ALU = require('../riscv/alu');
const PC = require('../riscv/pc');
const ImmGen = require('../riscv/immGeneration');
const multiplexer2X1 = require('../riscv/controls/multiplexers/multiplexer2x1');
const add = require('../riscv/controls/add');
const memDataSelector = require('../riscv/controls/memDataSelector');
const aluDataSelector = require('../riscv/controls/aluDataSelector');
const {
  convertArrayBinaryToHexadecimal,
  convertConfigToText,
  getBinaryRange,
  getOpcode,
  getFunct3,
  getFunct7,
} = require('../utils/utils');


//TODO: VERIFICAR A QUANTIDADE E FORMATO DA SAIDA DA ALU, PC, REGFILE, ETC
// VERIFICAR O FORMATO DE TODOS PARAMETROS, STRING OU NUMBER
// FAZER O OTHER '0' PARA SAIDAS DE TODAS FUNCOES


module.exports = class RISCV {
  constructor(asm) {
    const { code, memories } = asm;
    const { instMem, regFile, pc, dataMem } = memories;
    this.code = new RvState(code);
    this.regFile = new RegFile(regFile);
    this.instMem = new InstMem(instMem, this.code.text);
    this.dataMem = new DataMem(dataMem, this.code.data);
    this.alu = new ALU();

    this.pc = new PC(pc);
    this.immGen = new ImmGen();
    this.control = new Control();
  }

  runOneStep() {
    //PC
    const instruction = this.instMem.readInstruction(this.pc.getPc()).code;

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
    } = this.control.generateControl(getOpcode(instruction), getFunct3(instruction), getFunct7(instruction));
    
    const rd1 = getBinaryRange(19, 15, instruction);
    const rd2 = getBinaryRange(24, 20, instruction);
    const writeRg = getBinaryRange(11, 7, instruction);
    const rgData1 = this.regFile.read(rd1);
    const rgData2 = this.regFile.read(rd2);
    const instImm = this.immGen.generate(instruction, immShamt, immUp, memWrite, jump, jalr);

    const { aluInput1, aluInput2 } = aluDataSelector(auipc, jump, jalr, aluSrcImm, this.pc.getPc(), instImm, rgData1, rgData2);

    //EXEC
    const { aluZero, aluResult } = this.alu.executeALU(aluOp, aluInput1, aluInput2);

    //MEM ACCESS
    this.dataMem.writeMemory(aluResult, rgData2, memWrite)
    const dataMemData = this.dataMem.readMemory(aluResult, rgData2, memRead, memBen, memUsgn);

    //WRITEBACK
    const regFileWriteData = memDataSelector(memRead, loadUpImm, jump, dataMemData, instImm, this.pc.plusFour(), aluResult);
    this.regFile.write(regWrite, writeRg, regFileWriteData);
    const pcSel = branch && (aluZero ^ invBranch);
    const newPc = multiplexer2X1(this.pc.plusFour(), add(this.pc.getPc(), instImm), pcSel);
    this.pc.setPc(newPc);
  }

  runEntireProgram() {
      for(const line of this.code.text.machineCode){
        this.runOneStep();
      }
  }


  dump(type) {
    switch (type) {
    case 'binary':
      return this.code.text.machineCode;
    case 'hexadecimal':
      return convertArrayBinaryToHexadecimal(this.code.text.machineCode);
    case 'text':
      return convertConfigToText(this.code, this.instMem.memory, this.pc.getPc());
    }
  }


}
