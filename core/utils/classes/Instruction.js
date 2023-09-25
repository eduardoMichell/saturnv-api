const InstructionsJson = require('../jsons/instructions.json');
module.exports = class Instruction {
  constructor(inst) {
    this.line = inst;
    this.inst = inst[0] ? inst[0] : null;
    this.t1 = inst[1] ? inst[1] : null;
    this.t2 = inst[2] ? inst[2] : null;
    this.t3 = inst[3] ? inst[3] : null;
    this.info = this.getInstInfo(this.inst);
  }

  getInstInfo(inst){
    return InstructionsJson[inst];
  }
}
