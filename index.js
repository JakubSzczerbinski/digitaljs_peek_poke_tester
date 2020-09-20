"use strict";

const readline = require('readline');
const digitaljs = require("./main.js")
const { PeekPokeTester } = require('./peek_poke_tester.js')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
})

const onLoad = (msg) => {
    const tester = makeTester(msg.circuit)
    if (!tester) {
        respond_NOK(LOAD_FAILED);
        return;
    }
    onMsg = circuitLoaded(tester)
    respond_OK()
}

const initial = (msg) => {
    switch (msg.type) {
        case 'load':
            onLoad(msg)
            return;
        case 'peek':
        case 'poke':
        case 'step':
            console.error('Load file first.')
            respond_NOK(NO_TEST_CIRCUIT)
            return;
        default:
            console.error('Unknown command:', msg.type)
            respond_NOK(UNKNOWN_COMMAND)
    }
}

const circuitLoaded = (tester) => (msg) => {
    switch (msg.type) {
        case 'load':
            onLoad(msg)
        case 'peek':
            const value = tester.peek(msg.name);
            if (value === null) {
                respond_NOK(INVALID_OUTPUT_NAME);
                return;
            }
            respond_VALUE(value);
            return;
        case 'poke':
            if (!tester.poke(msg.name, msg.value)) {
                respond_NOK(INVALID_INPUT_NAME)
                return;
            }
            respond_OK();
            return;
        case 'step':
            tester.step(msg.steps)
            respond_OK();
            return;
        default:
            console.error('Unknown command:', msg.type)
            respond_NOK(UNKNOWN_COMMAND)
    }
}

let onMsg = initial

const sendMsg = (msg) => {
    const encoded = (Buffer.from(JSON.stringify(msg))).toString('base64')
    console.log(encoded + "\n")
}

const respond_OK = () => {
    sendMsg({ type: "ok" })
}

const UNKNOWN_COMMAND = -1
const LOAD_FAILED = 0
const NO_TEST_CIRCUIT = 1
const NOT_IMPLEMENTED = 2
const INVALID_OUTPUT_NAME = 3
const INVALID_INPUT_NAME = 4

const respond_NOK = (err) => {
    sendMsg({ type: "nok", error_code: err })
}

const respond_VALUE = (value) => {
    sendMsg({ type: "value", value })
}

const makeTester = (data) => {
    try {
        const tester = new PeekPokeTester(data);
        return tester;
    } catch (error) {
        console.error("Error while loading circuit:", error);
    }
    return null;
}

const parseMessage = (line) => {
    try {
        const decoded = (Buffer.from(line, 'base64')).toString();
        const json = JSON.parse(decoded);
        return json;
    }
    catch (error) {
        console.error("Error while parsing message:", error);
        return null;
    }
    return null;
}

rl.on('line', function (line) {
    const msg = parseMessage(line);
    if (msg != null)
        onMsg(msg);
})
