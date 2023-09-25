module.exports = class PC {

  constructor(pc) {
    this.pc = pc;
  }
  setPc(newPc){
    this.pc = newPc;
  }

  getPc(){
    return this.pc;
  }

  plusFour(){
    return this.pc + 4;
  }
}
