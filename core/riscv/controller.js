const Opcodes = require('../utils/constants/opcodes')
const Operations = require('../utils/constants/aluOperation')
const InstructionFormat = require('../utils/constants/instFormat')
const { getBinaryRange } = require('../utils/utils')
module.exports = class Control {
  constructor() {

  }

  generateControl(opcode, funct3, funct7) {
    let aluOp = 0
    let aluSrcImm = 0
    let immShamt = 0
    let immUp = 0
    let regWrite = 0
    let invBranch = 0
    let branch = 0
    let jump = 0
    let jalr = 0
    let memRead = 0
    let memWrite = 0
    let loadUpImm = 0
    let auipc = 0
    let memBen = 0
    let memUsgn = 0

    const instructionFormat = this.#getInstructionFormat(opcode)
    console.log(`instructionFormat`, instructionFormat)

    // -------------------- ALU --------------------
    const shiftOp = getBinaryRange(1, 0, funct3) === '01' ? 1 : 0
    const branchOp = this.#getBranchOperation(funct3)
    const addSubOp = funct3 === '000' ? 1 : 0
    aluOp = this.#getAluOp(funct3, funct7, branchOp, shiftOp,addSubOp, instructionFormat)

    aluSrcImm = instructionFormat !== InstructionFormat.R && instructionFormat !== InstructionFormat.B

    // -------------------- IMMEDIATE SELECTOR --------------------
    //instr[24:20]
    immShamt = (instructionFormat ===  InstructionFormat.IARITH || instructionFormat ===  InstructionFormat.R) && (shiftOp === 1)

    //instr[31:12] -> imm[31:12]
    immUp = (instructionFormat === InstructionFormat.ULUI || instructionFormat === InstructionFormat.UAUIPC)

    // -------------------- REGISTER BANK --------------------
    //   (instructionFormat !== InstructionFormat.IFENCE ||
      regWrite = (instructionFormat !== InstructionFormat.S && instructionFormat !==InstructionFormat.IFENCE &&
        instructionFormat !== InstructionFormat.B && instructionFormat !== InstructionFormat.ULUI)

    // -------------------- BRANCHS --------------------
    invBranch = Boolean(parseInt(getBinaryRange(2, 2, funct3)) ^ parseInt(getBinaryRange(0, 0, funct3)))
    branch = instructionFormat === InstructionFormat.B
    jump = (instructionFormat === InstructionFormat.UJAL || instructionFormat === InstructionFormat.IJALR)
    jalr = instructionFormat === InstructionFormat.IJALR

    // -------------------- MEMORY ACCESS --------------------
    memRead = instructionFormat === InstructionFormat.ILOAD
    memWrite = instructionFormat === InstructionFormat.S
    memBen = getBinaryRange(1,1, funct3) === '0' ? getBinaryRange(1,0, funct3) : '11'
    memUsgn = parseInt(getBinaryRange(2,2, funct3))

    // -------------------- U TYPE --------------------
    loadUpImm = instructionFormat === InstructionFormat.ULUI
    auipc = instructionFormat === InstructionFormat.UAUIPC

    return {
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
    }
  }

  #getInstructionFormat(opcode) {
    switch (opcode) {
    case Opcodes.R:
      return InstructionFormat.R
    case Opcodes.IJALR:
      return InstructionFormat.IJALR
    case Opcodes.ILOAD:
      return InstructionFormat.ILOAD
    case Opcodes.IARITH:
      return InstructionFormat.IARITH
    case Opcodes.IFENCE:
      return InstructionFormat.IFENCE
    case Opcodes.ISYSCALL:
      return InstructionFormat.ISYSCALL
    case Opcodes.S:
      return InstructionFormat.S
    case Opcodes.B:
      return InstructionFormat.B
    case Opcodes.ULUI:
      return InstructionFormat.ULUI
    case Opcodes.UAUIPC:
      return InstructionFormat.UAUIPC
    case Opcodes.UJAL:
      return InstructionFormat.UJAL
    }
  }


  #getBranchOperation(funct3) {
    const funct3to2 = getBinaryRange(2, 1, funct3)
    switch (funct3to2) {
    case '00':
      return Operations.XOR
    case '10':
      return Operations.SLT
    case '11':
      return Operations.SLTU
    default:
      return Operations.XOR
    }
  }

  #getAluOp(funct3, funct7, branchOp, shiftOp, addSubOp, format) {
    if (format === InstructionFormat.IARITH) {
      return (parseInt(getBinaryRange(5, 5, funct7)) && shiftOp) + funct3
    } else {
      if (format === InstructionFormat.R) {
        return (parseInt(getBinaryRange(5, 5, funct7)) && (shiftOp || addSubOp))
          + funct3
      } else {
        if (format === InstructionFormat.B) {
          return branchOp
        } else {
          return Operations.ADD
        }
      }
    }
  }
}
