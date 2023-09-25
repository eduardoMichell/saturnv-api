const { getBinaryRange, addZeros, binaryToDecimal, decimalToBinary, binaryToDecimalSigned } = require('../utils/utils')

module.exports = class ImmGen {
  constructor() {

  }
  generate(instruction31to0, immShamt, immUp, memWrite, jump, jalr){

    const immShamtValue = getBinaryRange(24,20, instruction31to0);
    const immUpValue = getBinaryRange(31,12,instruction31to0);
    const immUpJValue = getBinaryRange(31,31,instruction31to0) +
      getBinaryRange(19,12, instruction31to0) + getBinaryRange(20,20,instruction31to0) +
      getBinaryRange(30,21,instruction31to0) + '0';
    const immStoreValue = getBinaryRange(31,25, instruction31to0) + getBinaryRange(11,7,instruction31to0);
    const immIValue = getBinaryRange(31,20, instruction31to0);
    const immShamt32 =immShamtValue;
    const immUp32 = decimalToBinary(binaryToDecimal(immUpValue) << 12);
    const immUpJ32 = immUpJValue;
    const immStoreJ32 = immStoreValue;
    const immI32 = immIValue;


    switch (true) {
    case immShamt:
      return binaryToDecimalSigned(immShamt32);
    case immUp:
      return binaryToDecimalSigned(immUp32);
    case memWrite:
      return binaryToDecimalSigned(immStoreJ32);
    case jump && !jalr:
      return binaryToDecimalSigned(immUpJ32);
    default:
      return binaryToDecimalSigned(immI32);
    }
  }
}
