
'use strict';

const assert = require('assert').strict;
const { rejects } = require('assert');
const { spawn } = require('child_process');
const { Resolver } = require('dns');
const { request } = require('http');
const { resolve } = require('path');

const tests = [];

const colors = {
  reset: "\x1b[0m",
  fg_red: "\x1b[31m",
  fg_green: "\x1b[32m",
}

const test = (name, proc) => {
  tests.push({ name, proc });
}

const sequentially = (promises) =>
  promises.reduce(
    (acc, val) => acc.then((arr) => val().then((res) => [...arr, res])), 
    Promise.resolve([])
  )

let test_log = console.error

const runTests = async () => {
  const results = await sequentially(tests.map(({ name, proc }) => async () => {
    const log = []
    try {
      test_log = (line) => log.push(line)
      console.log("---   Running test: '" + name + "'.");
      await proc();
    } catch (error) {
      log.forEach(line => console.log(line));
      console.log("---   Failed with error: ", error);
      return { name, passed: false, error };
    } finally {
      test_log = console.error
    }
    console.log("---   Passed.");
    return { name, passed: true };
  }))
  const tests_count = results.length;
  const tests_passed = results.filter(({ passed }) => passed).length;
  const tests_failed = tests_count - tests_passed;

  console.log(tests_count, "tests executed.");

  if (tests_passed != tests_count) {
    console.log(colors.fg_red + tests_failed, "tests failed." + colors.reset);
    console.log(colors.fg_green + tests_passed, "tests passed." + colors.reset);
    return 1;
  }

  console.log(colors.fg_green + "All tests passed." + colors.reset);
  return 0;
}

const helpers = {
  msgToJson(data) {
    return JSON.parse(Buffer.from(data.toString().trim(), 'base64').toString());
  },
  jsonToMsg(json) {
    return Buffer.from(JSON.stringify(json)).toString('base64') + '\n';
  }
}

const sendMsg = (sut, request) => 
  new Promise((resolve, rejects) => {
    sut.stdout.on("data", (data) => {
      resolve(data);
    })
    const msg = helpers.jsonToMsg(request);
    sut.stdin.write(msg, 'ascii');
    setTimeout(() => {
      rejects(new Error("Timeout"));
    }, 5 * 1000)
  })
  .catch((err) => {
    console.log(err);
    assert.fail()
  })

const expectResponse = (sut, request, expeced_response) =>
  sendMsg(sut, request)
    .then(helpers.msgToJson)
    .then(response => assert.deepStrictEqual(response, expeced_response))

const makeSut = () => {
  const sut = spawn("node", ["./index.js"], {shell: true});
  sut.stderr.on("data", (data) => {
    test_log("SUT stderr: " + data.toString().trim());
  })
  return sut;
}

const shutdown = async (sut) => 
  await sut.kill("SIGKILL")

const simple_circuit = {
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

test("Should load circuit", async () => {
  const sut = makeSut();

  const load_request = {
    type: "load",
    circuit: simple_circuit,
  }
  const ok_response = { type: "ok" };
  await expectResponse(sut, load_request, ok_response);

  shutdown(sut);
})

test("Should load circuit and respond to peek, poke, and step", async () => {
  const sut = makeSut();

  const load_request = {
    type: "load",
    circuit: simple_circuit,
  }
  const ok_response = { type: "ok" };
  await expectResponse(sut, load_request, ok_response);

  const poke_request_1 = {
    type: "poke",
    name: "dev-1",
    value: 1,
  }
  await expectResponse(sut, poke_request_1, ok_response);

  const step_request = {
    type: "step",
    steps: 1,
  }
  await expectResponse(sut, step_request, ok_response);
  
  const peek_request = {
    type: "peek",
    name: "dev0",
  }
  const value_1_response = {
    type: "value",
    value: 1,
  }
  await expectResponse(sut, peek_request, value_1_response)

  const poke_request_0 = {
    ...poke_request_1,
    value: 0,
  }
  await expectResponse(sut, poke_request_0, ok_response)

  await expectResponse(sut, step_request, ok_response)
  
  const value_0_response = {
    type: "value",
    value: 0,
  }
  await expectResponse(sut, peek_request, value_0_response);

  shutdown(sut);
})

const clocked_circuit = {
  "devices": {
      "dev0": {
          "label": "x",
          "type": "Input",
          "propagation": 0,
          "position": {
              "x": 0,
              "y": 0
          }
      },
      "dev1": {
          "label": "clk",
          "type": "Input",
          "propagation": 100,
          "position": {
              "x": 0,
              "y": 95
          }
      },
      "dev2": {
          "label": "y1",
          "type": "Output",
          "propagation": 1,
          "position": {
              "x": 309.25,
              "y": 0
          }
      },
      "dev3": {
          "label": "y2",
          "type": "Output",
          "propagation": 1,
          "position": {
              "x": 468.75,
              "y": 47.5
          }
      },
      "dev4": {
          "label": "y3",
          "type": "Output",
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

test("Should load circuit and detect clock", async () => {
  const sut = makeSut();
  
  const load_request = {
    type: "load",
    circuit: clocked_circuit,
  }
  const ok_response = { type: "ok" };
  await expectResponse(sut, load_request, ok_response);

  const poke_1_request = {
    type: "poke",
    name: "dev0",
    value: 1,
  }
  await expectResponse(sut, poke_1_request, ok_response);
  
  const step_3_request = {
    type: "step",
    steps: 3,
  }
  await expectResponse(sut, step_3_request, ok_response);

  const peek_y1_request = {
    type: "peek",
    name: "dev2",
  }
  const peek_y2_request = {
    type: "peek",
    name: "dev3",
  }
  const peek_y3_request = {
    type: "peek",
    name: "dev4",
  }
  const value_1_response = {
    type: "value",
    value: 1,
  }
  const value_0_response = {
    type: "value",
    value: 0,
  }
  await expectResponse(sut, peek_y1_request, value_1_response);
  await expectResponse(sut, peek_y2_request, value_1_response);
  await expectResponse(sut, peek_y3_request, value_1_response);

  const poke_0_request = {
    type: "poke",
    name: "dev0",
    value: 0,
  }
  const step_1_request = {
    type: "step",
    steps: 1,
  }
  await expectResponse(sut, poke_0_request, ok_response)

  await expectResponse(sut, step_1_request, ok_response);
  await expectResponse(sut, peek_y1_request, value_0_response);
  await expectResponse(sut, peek_y2_request, value_1_response);
  await expectResponse(sut, peek_y3_request, value_1_response);

  await expectResponse(sut, step_1_request, ok_response);
  await expectResponse(sut, peek_y1_request, value_0_response);
  await expectResponse(sut, peek_y2_request, value_0_response);
  await expectResponse(sut, peek_y3_request, value_1_response);

  await expectResponse(sut, step_1_request, ok_response);
  await expectResponse(sut, peek_y1_request, value_0_response);
  await expectResponse(sut, peek_y2_request, value_0_response);
  await expectResponse(sut, peek_y3_request, value_0_response);

  shutdown(sut);
})

runTests().then(process.exit);
