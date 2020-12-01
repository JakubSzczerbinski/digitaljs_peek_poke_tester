module.exports = {
  "devices": {
    "out2": 
    {
      "type": "NumDisplay",
      "label": "",
      "bits": 2,
      "numbase": "hex"
    },
    "__INTERMEDIATE__4": 
    {
      "type": "BusSlice",
      "label": "",
      "slice": {
        "first": 0,
        "count": 2,
        "total": 3
      }
    },
    "in1": 
    {
      "type": "NumEntry",
      "label": "",
      "bits": 2,
      "numbase": "hex"
    },
    "__INTERMEDIATE__2": 
    {
      "type": "Constant",
      "label": "",
      "constant": "1"
    },
    "T_1": 
    {
      "type": "Addition",
      "label": "",
      "bits": {
        "in1": 2,
        "in2": 1,
        "out": 3
      },
      "signed": {
        "in1": false,
        "in2": false
      }
    },
    "reset": 
    {
      "type": "Button",
      "label": ""
    },
    "out1": 
    {
      "type": "NumDisplay",
      "label": "",
      "bits": 2,
      "numbase": "hex"
    }
  },
  "connectors": [
    {
      "to": 
      {
        "id": "T_1",
        "port": "in1"
      },
      "from": 
      {
        "id": "in1",
        "port": "out"
      }
    },
    {
      "to": 
      {
        "id": "T_1",
        "port": "in2"
      },
      "from": 
      {
        "id": "__INTERMEDIATE__2",
        "port": "out"
      }
    },
    {
      "to": 
      {
        "id": "out1",
        "port": "in"
      },
      "from": 
      {
        "id": "in1",
        "port": "out"
      }
    },
    {
      "to": 
      {
        "id": "out2",
        "port": "in"
      },
      "from": 
      {
        "id": "__INTERMEDIATE__4",
        "port": "out"
      }
    },
    {
      "to": 
      {
        "id": "__INTERMEDIATE__4",
        "port": "in"
      },
      "from": 
      {
        "id": "T_1",
        "port": "out"
      }
    }
  ],
  "subcircuits": {
  }
}