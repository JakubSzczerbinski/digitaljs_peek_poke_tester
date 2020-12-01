
const digitaljs = require('digitaljs');
const { Vector3vl } = require('3vl');

const clockNames = ["clk", "clock"]
const isClockName = (name) => clockNames.some(clk_name => clk_name == name)

class PeekPokeTester {
  constructor(circ) {
    this.inputs = {};
    this.outputs = {};
    this.circuit = new digitaljs.HeadlessCircuit(circ);
    let clks = [];
    for (const [name, celldata] of Object.entries(circ.devices)) {
      if (celldata.type == 'Input')
        this.inputs[name] = {net: celldata.net, bits: celldata.bits};

      if (celldata.type == 'Input' && (isClockName(name) || isClockName(celldata.label))) 
        clks = [name, ...clks]

      if (celldata.type == 'Output')
        this.outputs[name] = {net: celldata.net, bits: celldata.bits};
    }

    if (clks.length == 0)
      console.error("WARN: No clock found.");

    if (clks.length >= 2)
      console.error("WARN: Found more than one clock. Selecting first found.");

    this.clock = clks[0];
    this.step_one();
  }

  peek(name) {
    if (!this.outputs[name]){
      console.error(this.outputs);
      return null;
    }
    const value = this.circuit.getOutput(name)
    let result = null;
    try {
      result = value.toHex();
    } catch (err) {
      console.error("Failed to convert", value, "to number:", err)
    }
    return result;
  }
  
  poke(name, value) {
    const input = this.inputs[name];
    if (!input)
      return false;
    this.circuit.setInput(name, Vector3vl.fromNumber(value, input.bits))
    this.updateUntilStable();
    return true;
  }

  step(steps) {
    for (let i = 0; i < steps; i++) {
      this.step_one();
    }
  }
  
  step_one() {
    if (this.clock) {
      this.poke(this.clock, 0);
      this.poke(this.clock, 1);
    }
  }

  updateUntilStable() {
    do {
      this.circuit._updateGates();
    } while (this.circuit.hasPendingEvents);
  }
}

module.exports = { PeekPokeTester };