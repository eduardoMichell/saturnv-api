
function shiftLeft(decimal, base){
  return decimal << base;
}

function decimalToBinary(decimal) {
  const isNegative = decimal < 0;
  return isNegative ? (decimal >>> 0).toString(2) : parseInt(decimal).toString(2);
}

function hexadecimalToBinary(hex){
  return (parseInt(hex, 16).toString(2)).padStart(8, '0');
}

function getBinaryRange(left, right, imm){
  const reversedBinaryString = imm.split('').reverse().join('');
  const result = reversedBinaryString.substring(right, left + 1);
  return result.split('').reverse().join('');
}
function binaryToHexadecimal(binary){
  return parseInt(binary, 2).toString(16).toUpperCase();
}

function binaryToDecimal(binary){
  return parseInt(binary, 2);
}

function binaryToDecimalSigned(binary){
  const negative = (binary[0] === '1');
  if (negative) {
    let inverse = '';
    for (let i = 0; i < binary.length; i++) {
      inverse += (binary[i] === '0' ? '1' : '0');
    }
    return (parseInt(inverse, 2) + 1) * -1;
  } else {
    return parseInt(binary, 2);
  }
}

function convertArrayBinaryToHexadecimal(code){
  const hex = [];
  for (const binary of code){
    hex.push(addHexZeros(binaryToHexadecimal(binary), 10));
  }
  return hex;
}
function convertConfigToText(code, instMem, pc){
  const data = {
    address:[],
    code:[],
    basic:[],
    source:[]
  }
  let pcCount = Number.parseInt(pc);

  for (let i = 0; i < code.text.code.length; i++){
    data.address.push(decimalToHex(pcCount));
    data.code.push(addHexZeros(binaryToHexadecimal(code.text.code[i]), 10));
    data.basic.push(code.text.basic[i]);
    data.source.push(code.text.source[i]);
    pcCount += 4;
  }
  return data;
}

function decimalToHex(decimal) {
  return addHexZeros(decimal.toString(16), 10);
}

function addHexZeros (inst, quantity, number = '0')  {
  const increment = quantity - inst.length;
  for (let i = 0; i < increment; i++) {
    inst = (i === increment-2 ? 'x' : number) + inst;
  }
  return inst;
}


function addZeros (inst, quantity, number = '0') {
  const increment = quantity - inst.length;
  for (let i = 0; i < increment; i++) {
    inst = number + inst;
  }
  return inst;
}

function toUnsigned32(num) {
  return num >>> 0;
}

function getOpcode(instruction){
  return getBinaryRange(6,0, instruction);
}
function getFunct3(instruction){
  return getBinaryRange(14,12, instruction);

}
function getFunct7(instruction){
  return getBinaryRange(31,25, instruction);

}


module.exports = {
  decimalToHex,
  getOpcode,
  getFunct3,
  getFunct7,
  addZeros,
  shiftLeft,
  toUnsigned32,
  decimalToBinary,
  hexadecimalToBinary,
  getBinaryRange,
  binaryToHexadecimal,
  binaryToDecimal,
  convertArrayBinaryToHexadecimal,
  convertConfigToText,
  binaryToDecimalSigned
}