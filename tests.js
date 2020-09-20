
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

runTests().then(process.exit);
