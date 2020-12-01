
'use strict';

const assert = require('assert').strict;
const { spawn } = require('child_process');
const { PeekPokeTester } = require('./peek_poke_tester')

const helpers = {
  msgToJson(data) {
    return JSON.parse(Buffer.from(data.toString().trim(), 'base64').toString());
  },
  jsonToMsg(json) {
    return Buffer.from(JSON.stringify(json)).toString('base64') + '\n';
  }
}

const tests = [];

const colors = {
  reset: "\x1b[0m",
  fg_red: "\x1b[31m",
  fg_green: "\x1b[32m",
}

const test = (name, tags, proc) => {
  tests.push({ name, tags, proc });
}

const sequentially = (promises) =>
  promises.reduce(
    (acc, val) => acc.then((arr) => val().then((res) => [...arr, res])), 
    Promise.resolve([])
  )

let test_log = console.error

const runTests = async (activeTags) => {
  const activeTests = activeTags ? tests.filter(test => test.tags.some(tag => activeTags.includes(tag))) : tests
  const results = await sequentially(activeTests.map(({ name, tags, proc }) => async () => {
    const log = []
    try {
      test_log = (line) => log.push(line)
      console.log("---   Running test: '" + name + " " + tags.map(tag => "[" + tag + "]").join("") + "'.");
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

const simple_circuit = require('./circuits/simple')

test("Should load circuit", ["Communication", "Simple"], async () => {
  const sut = makeSut();

  const load_request = {
    type: "load",
    circuit: simple_circuit,
  }
  const ok_response = { type: "ok" };
  await expectResponse(sut, load_request, ok_response);

  shutdown(sut);
})

test("Should load circuit and respond to peek, poke, and step", ["Communication", "Simple"], async () => {
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

const clocked_circuit = require('./circuits/clocked') 

test("Should load circuit and detect clock", ["Communication", "Clocked"], async () => {
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

const gcd_circuit = require('./circuits/gcd')

test("Peek poke tester works with clocked circuit", ["PeekPokeTester", "Clocked"], () => {
  const ppt = new PeekPokeTester(clocked_circuit)
  ppt.poke("dev0", 0);
  ppt.step(3);
  assert(ppt.peek("dev2") == 0)
  assert(ppt.peek("dev3") == 0)
  assert(ppt.peek("dev4") == 0)
})

test("Peek poke tester works with gcd circuit", ["PeekPokeTester", "Gcd"], () => {
  const ppt = new PeekPokeTester(gcd_circuit);
  ppt.poke("io_a", 24)
  ppt.poke("io_b", 20)
  ppt.poke("io_e", 1)
  ppt.step(2)
  ppt.poke("io_e", 0)
  assert(ppt.peek("io_v") == 0)
})

const andr_orr_xorr = require('./circuits/andr_orr_xorr');

test("Peek poke tester works with andr_orr_xorr circuit", ["PeekPokeTester", "AndrOrrXorr"], () => {
  const ppt = new PeekPokeTester(andr_orr_xorr);
  ppt.poke("io_in1_0", 0);
  ppt.poke("io_in1_1", 0);
  ppt.poke("io_in1_2", 1);
  ppt.poke("io_in1_3", 0);
  assert(ppt.peek("io_out_andr") == 0);
  assert(ppt.peek("io_out_orr")  == 1);
  assert(ppt.peek("io_out_xorr") == 1);
})

const simple_2 = require('./circuits/simple_2');

test("Peek poke tester load simple_2", ["PeekPokeTester", "Simple2"], () => {
  const ppt = new PeekPokeTester(simple_2)
})

const carry_or_chain3 = require('./circuits/carry_or_chain3');
test("Peek poke tester load carry_or_chain_3", ["PeekPokeTester", "CarryOrChain3"], () => {
  const ppt = new PeekPokeTester(carry_or_chain3)
})

runTests().then(process.exit);
