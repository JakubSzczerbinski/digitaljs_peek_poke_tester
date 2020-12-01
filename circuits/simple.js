module.exports = {
    "devices": {
      "dev-1": {
        "type": "Input",
        "net": "i",
        "order": -1,
        "bits": 1,
        "label": "i"
      },
      "dev0": {
        "type": "Output",
        "net": "o",
        "order": 0,
        "bits": 1,
        "label": "o"
      }
    },
    "connectors": [
      {
        "to": {
          "id": "dev0",
          "port": "in"
        },
        "from": {
          "id": "dev-1",
          "port": "out"
        },
        "name": "i"
      }
    ],
    "subcircuits": {}
  }