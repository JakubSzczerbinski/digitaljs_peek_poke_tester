module.exports =
{
  "devices": {
    "ORBlock_1_1": 
    {
      "type": "Subcircuit",
      "label": "ORBlock_1_1",
      "celltype": "ORBlock"
    },
    "clk": 
    {
      "type": "Input",
      "label": "",
      "net": "clk",
      "order": 0,
      "bits": 1
    },
    "io_co_2": 
    {
      "type": "Output",
      "label": "",
      "net": "io_co_2",
      "order": 7,
      "bits": 1
    },
    "io_a_0": 
    {
      "type": "Input",
      "label": "",
      "net": "io_a_0",
      "order": 2,
      "bits": 1
    },
    "ORBlock_2": 
    {
      "type": "Subcircuit",
      "label": "ORBlock_2",
      "celltype": "ORBlock"
    },
    "io_a_1": 
    {
      "type": "Input",
      "label": "",
      "net": "io_a_1",
      "order": 3,
      "bits": 1
    },
    "io_co_0": 
    {
      "type": "Output",
      "label": "",
      "net": "io_co_0",
      "order": 5,
      "bits": 1
    },
    "reset": 
    {
      "type": "Input",
      "label": "",
      "net": "reset",
      "order": 1,
      "bits": 1
    },
    "io_a_2": 
    {
      "type": "Input",
      "label": "",
      "net": "io_a_2",
      "order": 4,
      "bits": 1
    },
    "io_co_1": 
    {
      "type": "Output",
      "label": "",
      "net": "io_co_1",
      "order": 6,
      "bits": 1
    }
  },
  "connectors": [
    {
      "to": 
      {
        "id": "io_co_0",
        "port": "in"
      },
      "from": 
      {
        "id": "io_a_0",
        "port": "out"
      }
    },
    {
      "to": 
      {
        "id": "io_co_1",
        "port": "in"
      },
      "from": 
      {
        "id": "ORBlock_2",
        "port": "io_co"
      }
    },
    {
      "to": 
      {
        "id": "io_co_2",
        "port": "in"
      },
      "from": 
      {
        "id": "ORBlock_1_1",
        "port": "io_co"
      }
    },
    {
      "to": 
      {
        "id": "ORBlock_2",
        "port": "clk"
      },
      "from": 
      {
        "id": "clk",
        "port": "out"
      }
    },
    {
      "to": 
      {
        "id": "ORBlock_2",
        "port": "reset"
      },
      "from": 
      {
        "id": "reset",
        "port": "out"
      }
    },
    {
      "to": 
      {
        "id": "ORBlock_2",
        "port": "io_a"
      },
      "from": 
      {
        "id": "io_a_1",
        "port": "out"
      }
    },
    {
      "to": 
      {
        "id": "ORBlock_2",
        "port": "io_ci"
      },
      "from": 
      {
        "id": "io_a_0",
        "port": "out"
      }
    },
    {
      "to": 
      {
        "id": "ORBlock_1_1",
        "port": "clk"
      },
      "from": 
      {
        "id": "clk",
        "port": "out"
      }
    },
    {
      "to": 
      {
        "id": "ORBlock_1_1",
        "port": "reset"
      },
      "from": 
      {
        "id": "reset",
        "port": "out"
      }
    },
    {
      "to": 
      {
        "id": "ORBlock_1_1",
        "port": "io_a"
      },
      "from": 
      {
        "id": "io_a_2",
        "port": "out"
      }
    },
    {
      "to": 
      {
        "id": "ORBlock_1_1",
        "port": "io_ci"
      },
      "from": 
      {
        "id": "ORBlock_2",
        "port": "io_co"
      }
    }
  ],
  "subcircuits": {
    "ORBlock": 
    {
      "name": "ORBlock",
      "devices": {
        "T_3": 
        {
          "type": "Or",
          "label": " @[CarryChainSpecs.scala 19:17]",
          "bits": 1
        },
        "clk": 
        {
          "type": "Input",
          "label": "",
          "net": "clk",
          "order": 0,
          "bits": 1
        },
        "io_co": 
        {
          "type": "Output",
          "label": "",
          "net": "io_co",
          "order": 4,
          "bits": 1
        },
        "io_ci": 
        {
          "type": "Input",
          "label": "",
          "net": "io_ci",
          "order": 3,
          "bits": 1
        },
        "reset": 
        {
          "type": "Input",
          "label": "",
          "net": "reset",
          "order": 1,
          "bits": 1
        },
        "io_a": 
        {
          "type": "Input",
          "label": "",
          "net": "io_a",
          "order": 2,
          "bits": 1
        }
      },
      "connectors": [
        {
          "to": 
          {
            "id": "T_3",
            "port": "in1"
          },
          "from": 
          {
            "id": "io_a",
            "port": "out"
          }
        },
        {
          "to": 
          {
            "id": "T_3",
            "port": "in2"
          },
          "from": 
          {
            "id": "io_ci",
            "port": "out"
          }
        },
        {
          "to": 
          {
            "id": "io_co",
            "port": "in"
          },
          "from": 
          {
            "id": "T_3",
            "port": "out"
          }
        }
      ]
    }
  }
}
