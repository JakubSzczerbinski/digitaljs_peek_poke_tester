module.exports = {
"devices": {
    "io_in1_3": {
        "type": "Input",
        "label": "",
        "net": "io_in1_3",
        "order": 5,
        "bits": 1
    },
    "_T": {
        "type": "BusGroup",
        "label": " @[XorReducer.scala 15:21]",
        "groups": [
        1,
        1
        ]
    },
    "_T_3": {
        "type": "AndReduce",
        "label": " @[XorReducer.scala 15:28]",
        "bits": 4
    },
    "io_in1_0": {
        "type": "Input",
        "label": "",
        "net": "io_in1_0",
        "order": 2,
        "bits": 1
    },
    "_T_4": {
        "type": "OrReduce",
        "label": " @[XorReducer.scala 15:28]",
        "bits": 4
    },
    "io_out_andr": {
        "type": "Output",
        "label": "",
        "net": "io_out_andr",
        "order": 6,
        "bits": 1
    },
    "_T_2": {
        "type": "BusGroup",
        "label": " @[XorReducer.scala 15:21]",
        "groups": [
        2,
        2
        ]
    },
    "clock": {
        "type": "Input",
        "label": "",
        "net": "clock",
        "order": 0,
        "bits": 1
    },
    "io_in1_1": {
        "type": "Input",
        "label": "",
        "net": "io_in1_1",
        "order": 3,
        "bits": 1
    },
    "_T_5": {
        "type": "XorReduce",
        "label": " @[XorReducer.scala 15:28]",
        "bits": 4
    },
    "reset": {
        "type": "Input",
        "label": "",
        "net": "reset",
        "order": 1,
        "bits": 1
    },
    "_T_1": {
        "type": "BusGroup",
        "label": " @[XorReducer.scala 15:21]",
        "groups": [
        1,
        1
        ]
    },
    "io_out_orr": {
        "type": "Output",
        "label": "",
        "net": "io_out_orr",
        "order": 7,
        "bits": 1
    },
    "io_in1_2": {
        "type": "Input",
        "label": "",
        "net": "io_in1_2",
        "order": 4,
        "bits": 1
    },
    "io_out_xorr": {
        "type": "Output",
        "label": "",
        "net": "io_out_xorr",
        "order": 8,
        "bits": 1
    }
    },
    "connectors": [
    {
        "to": {
        "id": "_T",
        "port": "in0"
        },
        "from": {
        "id": "io_in1_1",
        "port": "out"
        }
    },
    {
        "to": {
        "id": "_T",
        "port": "in1"
        },
        "from": {
        "id": "io_in1_0",
        "port": "out"
        }
    },
    {
        "to": {
        "id": "_T_1",
        "port": "in0"
        },
        "from": {
        "id": "io_in1_3",
        "port": "out"
        }
    },
    {
        "to": {
        "id": "_T_1",
        "port": "in1"
        },
        "from": {
        "id": "io_in1_2",
        "port": "out"
        }
    },
    {
        "to": {
        "id": "_T_2",
        "port": "in0"
        },
        "from": {
        "id": "_T_1",
        "port": "out"
        }
    },
    {
        "to": {
        "id": "_T_2",
        "port": "in1"
        },
        "from": {
        "id": "_T",
        "port": "out"
        }
    },
    {
        "to": {
        "id": "_T_3",
        "port": "in"
        },
        "from": {
        "id": "_T_2",
        "port": "out"
        }
    },
    {
        "to": {
        "id": "_T_4",
        "port": "in"
        },
        "from": {
        "id": "_T_2",
        "port": "out"
        }
    },
    {
        "to": {
        "id": "_T_5",
        "port": "in"
        },
        "from": {
        "id": "_T_2",
        "port": "out"
        }
    },
    {
        "to": {
        "id": "io_out_andr",
        "port": "in"
        },
        "from": {
        "id": "_T_3",
        "port": "out"
        }
    },
    {
        "to": {
        "id": "io_out_orr",
        "port": "in"
        },
        "from": {
        "id": "_T_4",
        "port": "out"
        }
    },
    {
        "to": {
        "id": "io_out_xorr",
        "port": "in"
        },
        "from": {
        "id": "_T_5",
        "port": "out"
        }
    }
    ],
    "subcircuits": {}
}