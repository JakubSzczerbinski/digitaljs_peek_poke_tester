module.exports = {
    "devices": {
        "dev0": {
            "label": "x",
            "type": "Input",
            "bits": 1,
            "net": "x",
            "propagation": 0,
            "position": {
                "x": 0,
                "y": 0
            }
        },
        "dev1": {
            "label": "clk",
            "type": "Input",
            "bits": 1,
            "net": "clk",
            "propagation": 100,
            "position": {
                "x": 0,
                "y": 95
            }
        },
        "dev2": {
            "label": "y1",
            "type": "Output",
            "bits": 1,
            "net": "y1",
            "propagation": 1,
            "position": {
                "x": 309.25,
                "y": 0
            }
        },
        "dev3": {
            "label": "y2",
            "type": "Output",
            "bits": 1,
            "net": "y2",
            "propagation": 1,
            "position": {
                "x": 468.75,
                "y": 47.5
            }
        },
        "dev4": {
            "label": "y3",
            "type": "Output",
            "bits": 1,
            "net": "y3",
            "propagation": 1,
            "position": {
                "x": 618.5,
                "y": 105
            }
        },
        "dev5": {
            "label": "$procdff$2",
            "type": "Dff",
            "propagation": 1,
            "polarity": {
                "clock": true
            },
            "bits": 1,
            "initial": "x",
            "position": {
                "x": 140,
                "y": 5
            }
        },
        "dev6": {
            "label": "$procdff$3",
            "type": "Dff",
            "propagation": 1,
            "polarity": {
                "clock": true
            },
            "bits": 1,
            "initial": "x",
            "position": {
                "x": 299.5,
                "y": 52.5
            }
        },
        "dev7": {
            "label": "$procdff$4",
            "type": "Dff",
            "propagation": 1,
            "polarity": {
                "clock": true
            },
            "bits": 1,
            "initial": "x",
            "position": {
                "x": 459,
                "y": 100
            }
        }
    },
    "connectors": [
        {
            "from": {
                "id": "dev0",
                "port": "out"
            },
            "to": {
                "id": "dev5",
                "port": "in"
            },
            "name": "x"
        },
        {
            "from": {
                "id": "dev1",
                "port": "out"
            },
            "to": {
                "id": "dev5",
                "port": "clk"
            },
            "name": "clk"
        },
        {
            "from": {
                "id": "dev1",
                "port": "out"
            },
            "to": {
                "id": "dev6",
                "port": "clk"
            },
            "name": "clk"
        },
        {
            "from": {
                "id": "dev1",
                "port": "out"
            },
            "to": {
                "id": "dev7",
                "port": "clk"
            },
            "name": "clk"
        },
        {
            "from": {
                "id": "dev5",
                "port": "out"
            },
            "to": {
                "id": "dev2",
                "port": "in"
            },
            "name": "y1"
        },
        {
            "from": {
                "id": "dev5",
                "port": "out"
            },
            "to": {
                "id": "dev6",
                "port": "in"
            },
            "name": "y1"
        },
        {
            "from": {
                "id": "dev6",
                "port": "out"
            },
            "to": {
                "id": "dev3",
                "port": "in"
            },
            "name": "y2"
        },
        {
            "from": {
                "id": "dev6",
                "port": "out"
            },
            "to": {
                "id": "dev7",
                "port": "in"
            },
            "name": "y2"
        },
        {
            "from": {
                "id": "dev7",
                "port": "out"
            },
            "to": {
                "id": "dev4",
                "port": "in"
            },
            "name": "y3"
        }
    ],
    "subcircuits": {}
  }