module.exports =
{
    "devices": {
        "_GEN_2": {
            "type": "Mux",
            "label": " @[example_test.scala 39:14]",
            "bits": {
                "in": 16,
                "sel": 1
            }
        },
        "x": {
            "type": "Dff",
            "label": " @[example_test.scala 33:15]",
            "bits": 16,
            "polarity": {
                "clock": false
            },
            "initial": ""
        },
        "io_v": {
            "type": "Output",
            "label": "",
            "net": "io_v",
            "order": 6,
            "bits": 1
        },
        "_T": {
            "type": "Gt",
            "label": " @[example_test.scala 36:10]",
            "bits": {
                "in1": 16,
                "in2": 16
            },
            "signed": {
                "in1": false,
                "in2": false
            }
        },
        "_T_3": {
            "type": "Subtraction",
            "label": " @[example_test.scala 37:25]",
            "bits": {
                "in1": 16,
                "in2": 16,
                "out": 17
            },
            "signed": {
                "in1": false,
                "in2": false
            }
        },
        "y": {
            "type": "Dff",
            "label": " @[example_test.scala 34:15]",
            "bits": 16,
            "polarity": {
                "clock": false
            },
            "initial": ""
        },
        "_T_4": {
            "type": "BusSlice",
            "label": " @[example_test.scala 37:25]",
            "slice": {
                "first": 0,
                "count": 16,
                "total": 17
            }
        },
        "_GEN_3": {
            "type": "Mux",
            "label": " @[example_test.scala 39:14]",
            "bits": {
                "in": 16,
                "sel": 1
            }
        },
        "_T_2": {
            "type": "BusSlice",
            "label": " @[example_test.scala 36:24]",
            "slice": {
                "first": 0,
                "count": 16,
                "total": 17
            }
        },
        "__INTERMEDIATE__18": {
            "type": "Constant",
            "label": " @[example_test.scala 45:13]",
            "constant": "0"
        },
        "clock": {
            "type": "Input",
            "label": "",
            "net": "clock",
            "order": 0,
            "bits": 1
        },
        "io_e": {
            "type": "Input",
            "label": "",
            "net": "io_e",
            "order": 4,
            "bits": 1
        },
        "_T_5": {
            "type": "Eq",
            "label": " @[example_test.scala 45:13]",
            "bits": {
                "in1": 16,
                "in2": 1
            },
            "signed": {
                "in1": false,
                "in2": false
            }
        },
        "reset": {
            "type": "Input",
            "label": "",
            "net": "reset",
            "order": 1,
            "bits": 1
        },
        "_GEN_1": {
            "type": "Mux",
            "label": " @[example_test.scala 36:15]",
            "bits": {
                "in": 16,
                "sel": 1
            }
        },
        "io_b": {
            "type": "Input",
            "label": "",
            "net": "io_b",
            "order": 3,
            "bits": 16
        },
        "_T_1": {
            "type": "Subtraction",
            "label": " @[example_test.scala 36:24]",
            "bits": {
                "in1": 16,
                "in2": 16,
                "out": 17
            },
            "signed": {
                "in1": false,
                "in2": false
            }
        },
        "_GEN_0": {
            "type": "Mux",
            "label": " @[example_test.scala 36:15]",
            "bits": {
                "in": 16,
                "sel": 1
            }
        },
        "io_z": {
            "type": "Output",
            "label": "",
            "net": "io_z",
            "order": 5,
            "bits": 16
        },
        "io_a": {
            "type": "Input",
            "label": "",
            "net": "io_a",
            "order": 2,
            "bits": 16
        }
    },
    "connectors": [
        {
            "to": {
                "id": "x",
                "port": "clk"
            },
            "from": {
                "id": "clock",
                "port": "out"
            }
        },
        {
            "to": {
                "id": "y",
                "port": "clk"
            },
            "from": {
                "id": "clock",
                "port": "out"
            }
        },
        {
            "to": {
                "id": "_T",
                "port": "in1"
            },
            "from": {
                "id": "x",
                "port": "out"
            }
        },
        {
            "to": {
                "id": "_T",
                "port": "in2"
            },
            "from": {
                "id": "y",
                "port": "out"
            }
        },
        {
            "to": {
                "id": "_T_1",
                "port": "in1"
            },
            "from": {
                "id": "x",
                "port": "out"
            }
        },
        {
            "to": {
                "id": "_T_1",
                "port": "in2"
            },
            "from": {
                "id": "y",
                "port": "out"
            }
        },
        {
            "to": {
                "id": "_T_2",
                "port": "in"
            },
            "from": {
                "id": "_T_1",
                "port": "out"
            }
        },
        {
            "to": {
                "id": "_T_3",
                "port": "in1"
            },
            "from": {
                "id": "y",
                "port": "out"
            }
        },
        {
            "to": {
                "id": "_T_3",
                "port": "in2"
            },
            "from": {
                "id": "x",
                "port": "out"
            }
        },
        {
            "to": {
                "id": "_T_4",
                "port": "in"
            },
            "from": {
                "id": "_T_3",
                "port": "out"
            }
        },
        {
            "to": {
                "id": "_GEN_0",
                "port": "in0"
            },
            "from": {
                "id": "x",
                "port": "out"
            }
        },
        {
            "to": {
                "id": "_GEN_0",
                "port": "in1"
            },
            "from": {
                "id": "_T_2",
                "port": "out"
            }
        },
        {
            "to": {
                "id": "_GEN_0",
                "port": "sel"
            },
            "from": {
                "id": "_T",
                "port": "out"
            }
        },
        {
            "to": {
                "id": "_GEN_1",
                "port": "in0"
            },
            "from": {
                "id": "_T_4",
                "port": "out"
            }
        },
        {
            "to": {
                "id": "_GEN_1",
                "port": "in1"
            },
            "from": {
                "id": "y",
                "port": "out"
            }
        },
        {
            "to": {
                "id": "_GEN_1",
                "port": "sel"
            },
            "from": {
                "id": "_T",
                "port": "out"
            }
        },
        {
            "to": {
                "id": "_GEN_2",
                "port": "in0"
            },
            "from": {
                "id": "_GEN_0",
                "port": "out"
            }
        },
        {
            "to": {
                "id": "_GEN_2",
                "port": "in1"
            },
            "from": {
                "id": "io_a",
                "port": "out"
            }
        },
        {
            "to": {
                "id": "_GEN_2",
                "port": "sel"
            },
            "from": {
                "id": "io_e",
                "port": "out"
            }
        },
        {
            "to": {
                "id": "_GEN_3",
                "port": "in0"
            },
            "from": {
                "id": "_GEN_1",
                "port": "out"
            }
        },
        {
            "to": {
                "id": "_GEN_3",
                "port": "in1"
            },
            "from": {
                "id": "io_b",
                "port": "out"
            }
        },
        {
            "to": {
                "id": "_GEN_3",
                "port": "sel"
            },
            "from": {
                "id": "io_e",
                "port": "out"
            }
        },
        {
            "to": {
                "id": "_T_5",
                "port": "in1"
            },
            "from": {
                "id": "y",
                "port": "out"
            }
        },
        {
            "to": {
                "id": "_T_5",
                "port": "in2"
            },
            "from": {
                "id": "__INTERMEDIATE__18",
                "port": "out"
            }
        },
        {
            "to": {
                "id": "io_z",
                "port": "in"
            },
            "from": {
                "id": "x",
                "port": "out"
            }
        },
        {
            "to": {
                "id": "io_v",
                "port": "in"
            },
            "from": {
                "id": "_T_5",
                "port": "out"
            }
        },
        {
            "to": {
                "id": "x",
                "port": "in"
            },
            "from": {
                "id": "_GEN_2",
                "port": "out"
            }
        },
        {
            "to": {
                "id": "y",
                "port": "in"
            },
            "from": {
                "id": "_GEN_3",
                "port": "out"
            }
        }
    ],
    "subcircuits": {}
}