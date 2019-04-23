import * as sinon from 'sinon'
import { getExamples } from './examples'
import { nod3Creator } from './shared'
let nod3 = global.nod3 || nod3Creator()

export const fakeNod3 = (test) => {
  const examples = {}

  const getExamplesByMethod = method => {
    if (!examples[method]) examples[method] = getExamples(method)
    return examples[method]
  }

  const fakeRpcSendMethod = (method, params) => {
    const examples = getExamplesByMethod(method)
    const example = examples.next()
    if (examples.total) return Promise.resolve(example)
    return Promise.reject(example)
  }

  return () => {
    before(async function () {
      sinon.replace(nod3.rpc, 'sendMethod', fakeRpcSendMethod)
    })
    test(nod3, examples)
    after(() => { sinon.restore() })
  }
}
