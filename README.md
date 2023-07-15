# SATURN-V API

<div style="text-align: center;">
    <img src="imgs/logos/saturn.png" alt="saturnv-logo" width="350" height="200">
</div>

![GitHub repo size](https://img.shields.io/github/repo-size/eduardoMichell/saturnv-api?label=Repo%20Size)

This project is a RISC-V processor implemented in JavaScript, allowing the execution of RISC-V assembly code from the RV32I instruction set directly through HTTP requests. It was developed with the objective of providing an accessible implementation, allowing students, enthusiasts and developers to experience and learn about this popular processor architecture.

### Prerequisites
Before you begin, you will need to install [Node.js 16](https://nodejs.org/en/) to be able to initialize the api on your computer

### Tutorial
To use the api, the requests must follow the json format that is in the **template.json** file, here is an example of how the template can be used in the */assemble* endpoint:

    {
        "code": {
            "data": [
                {
                 "directive": "word",
                 "label": "Array", 
                 "source": [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100], 
                 "basic": [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
                }
            ],
            "text": {
                "source": [
                    ["addi", "t2", "zero", "11"],
                    ["auipc", "s3", "64528"],
                    ["addi", "s3", "s3", "-4"],
                    ["lb", "t0", "32(s3)"],
                    ["add", "t0", "s2", "t0"],
                    ["sw", "t0", "48(s3)"]
                ],
                "basic": [
                    ["addi", "t2", "zero", "11"],
                    ["auipc", "x19", "64528"],
                    ["addi", "x19", "x19", "-4"],
                    ["lb", "x5", "32(x19)"],
                    ['add", "x5", "x18", "x5"],
                    ["sw", "x5", "48(x19)"]
                ]
            }  
        },
        "memories": {
            "regFile": {
                "x0": 0,
                "x1": 0,
                "x2": 0,
                "x3": 0,
                "x4": 0,
                "x5": 0,
                "x6": 0,
                "x7": 0,
                "x8": 0,
                "x9": 0,
                "x10": 0,
                "x11": 0,
                "x12": 0,
                "x13": 0,
                "x14": 0,
                "x15": 0,
                "x16": 0,
                "x17": 0,
                "x18": 0,
                "x19": 0,
                "x20": 0,
                "x21": 0,
                "x22": 0,
                "x23": 0,
                "x24": 0,
                "x25": 0,
                "x26": 0,
                "x27": 0,
                "x28": 0,
                "x29": 0,
                "x30": 0,
                "x31": 0
              },
              "instMem":{
                "4194304": {"code": "0", "basic": "", "source": ""},
                "4194308": {"code": "0", "basic": "", "source": ""},
                "4194312": {"code": "0", "basic": "", "source": ""},
                "4194316": {"code": "0", "basic": "", "source": ""},
                "4194320": {"code": "0", "basic": "", "source": ""},
                ...
                "4194812": {"code": "0", "basic": "", "source": ""}
              {,
              "dataMem": {
                "268500992": 0,
                "268500996": 0,
                "268501000": 0,
                "268501004": 0,
                "268501008": 0,
                ...
                "268501500": 0,
               },
              "pc":  4194304
        }
    }


This example represents this assembly code:

         .data               # data segment
    Array: .word 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150
         .text               # code segment (program)
    main:    
         addi s2, zero, 11   # Initialize s2 with 1
         auipc s3, 64528     # s3 receives the base address of Array[]
         addi s3, s3, -4                    
         lb   t0, 32(s3)     # $t0 = A[8]
         add  t0, s2, t0     # $t0 = $t0 + h
         sw   t0, 48(s3)     # A[12] = $t0


The response of this request will return the same structure, but with the memories filled with data, just copy the response to use in the */run* endpoint