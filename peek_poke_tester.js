
const digitaljs = require("./main.js")
const { Vector3vl } = require('3vl');

class PeekPokeTester {
  constructor(circ) {
    this.inputs = {};
    this.outputs = {};
    this.circuit = new digitaljs.HeadlessCircuit(circ);
    for (const [name, celldata] of Object.entries(circ.devices)) {
      if (celldata.type == 'Input')
          this.inputs[name] = {net: celldata.net, bits: celldata.bits};
      if (celldata.type == 'Output')
          this.outputs[name] = {net: celldata.net, bits: celldata.bits};
    }
  }

  peek(name) {
    if (!this.outputs[name])
      return null;
    const value = this.circuit.getOutput(name)
    console.error(value);
    return value.toNumber(false);
  }
  
  poke(name, value) {
    const input = this.inputs[name];
    if (!input)
      return false;
    this.circuit.setInput(name, Vector3vl.fromNumber(value, input.bits))
    return true;
  }

  step(steps) {
    for (let i = 0; i < steps; i++) {
      this.circuit.updateGates();
    }
  }
}

module.exports = { PeekPokeTester };
