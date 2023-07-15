const express = require('express')
const router = express.Router()
const RiscV = require('../modules/RISCV')

router.get('/health-check', async (req, res) => {
  // #swagger.tags = ['Risc V']
  // #swagger.path = ['/rv/health-check']
  // #swagger.description = 'Health check'
  try {
    res.status(201).json('health-check')
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/assemble', async (req, res) => {
  // #swagger.tags = ['Risc V']
  // #swagger.path = ['/rv/assemble']
  // #swagger.description = 'Assemble code'
  try {
    const { memories, code } = req.body
    const riscv = new RiscV({ memories, code })
    const result = {
      code: riscv.code,
      memories: {
        regFile: riscv.regFile.registers,
        instMem: riscv.instMem.memory,
        dataMem: riscv.dataMem.memory,
        pc: riscv.pc.getPc()
      }
    }
    return res.status(201).json({ error: false, data: result, message: 'Success' })
  } catch (err) {
    console.log(err)
    return res.json({ message: err, error: true, data: {} })
  }
})

router.post('/run', async (req, res) => {
  // #swagger.tags = ['Risc V']
  // #swagger.path = ['/rv/run']
  // #swagger.description = 'Run one line'
  try {
    const { memories, code } = req.body
    console.log(memories,code)
    const riscv = new RiscV({ memories, code })
    riscv.run()
    const result = {
      code: riscv.code,
      memories: {
        regFile: riscv.regFile.registers,
        instMem: riscv.instMem.memory,
        dataMem: riscv.dataMem.memory,
        pc: riscv.pc.getPc()
      }
    }
    console.log(result)
    return res.status(201).json({ error: false, data: result, message: 'Success' })
  } catch (err) {
    console.log(err)
    return res.json({ message: err, error: true, data: {} })
  }
})



router.post('/dump', async (req, res) => {
  // #swagger.tags = ['Risc V']
  // #swagger.path = ['/rv/dump']
  // #swagger.description = 'Dump code'
  try {

    const { asm, type } = req.body
    const { memories, code } = asm
    const riscv = new RiscV({ memories, code })
    const data = riscv.dump(type)
    console.log(data)
    return res.status(201).json({ error: false, data, message: 'Success' })
  } catch (err) {
    console.log(err)
    return res.json({ message: err, error: true, data: {} })
  }
})


module.exports = router
