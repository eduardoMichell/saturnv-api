const express = require('express');
const router = express.Router();
const RiscV = require('../modules/RISCV');

router.get('/health-check', async (req, res) => {
  // #swagger.tags = ['Risc V']
  // #swagger.path = ['/health-check']
  // #swagger.description = 'Health check'
  res.status(200).json({ status: 'Healthy' });
})

router.post('/assemble-code', async (req, res) => {
  // #swagger.tags = ['Risc V']
  // #swagger.path = ['/assemble-code']
  // #swagger.description = 'Assemble code'
  try {
    const { memories, code } = req.body;
    const riscv = new RiscV({ memories, code });
    const result = {
      code: riscv.code,
      memories: {
        regFile: riscv.regFile.registers,
        instMem: riscv.instMem.memory,
        dataMem: riscv.dataMem.memory,
        pc: riscv.pc.getPc()
      }
    }
    return res.status(201).json({ error: false, data: result, message: 'Success' });
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: err, error: true, data: {} });
  }
})

router.post('/run-one-step', async (req, res) => {
  // #swagger.tags = ['Risc V']
  // #swagger.path = ['/run-one-step']
  // #swagger.description = 'Run one line'
  try {
    const { memories, code } = req.body;
    const riscv = new RiscV({ memories, code });
    riscv.runOneStep();
    const result = {
      code: riscv.code,
      memories: {
        regFile: riscv.regFile.registers,
        instMem: riscv.instMem.memory,
        dataMem: riscv.dataMem.memory,
        pc: riscv.pc.getPc()
      }
    }
    return res.status(201).json({ error: false, data: result, message: 'Success' });
  } catch (err) {
    return res.status(500).json({ message: err, error: true, data: {} });
  }
})

router.post('/run-entire-program', async (req, res) => {
  // #swagger.tags = ['Risc V']
  // #swagger.path = ['/run-entire-program']
  // #swagger.description = 'Run entire program'
  try {
    const { memories, code } = req.body;
    const riscv = new RiscV({ memories, code });
    riscv.runEntireProgram();
    const result = {
      code: riscv.code,
      memories: {
        regFile: riscv.regFile.registers,
        instMem: riscv.instMem.memory,
        dataMem: riscv.dataMem.memory,
        pc: riscv.pc.getPc()
      }
    }
    return res.status(201).json({ error: false, data: result, message: 'Success' });
  } catch (err) {
    return res.status(500).json({ message: err, error: true, data: {} });
  }
})

router.post('/dump-machine-code', async (req, res) => {
  // #swagger.tags = ['Risc V']
  // #swagger.path = ['/dump-machine-code']
  // #swagger.description = 'Dump code'
  try {

    const { asm, type } = req.body;
    const { memories, code } = asm;
    const riscv = new RiscV({ memories, code });
    const data = riscv.dump(type);
    return res.status(201).json({ error: false, data, message: 'Success' });
  } catch (err) {
    return res.status(500).json({ message: err, error: true, data: {} });
  }
})

module.exports = router;
