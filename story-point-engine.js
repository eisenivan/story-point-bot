import * as tf from '@tensorflow/tfjs-node'
import pasteboard from 'clipboardy'
import { normalizeItem, buildXs, buildSet } from './helpers'
import key from './model/key.json'
import trainingSet from './data/story-points.json'
import fs from 'fs'

const arr = buildSet(trainingSet)

const xDataLength = buildXs(arr, key)[0].length

async function predict (x) {
  const model = await tf.loadModel('file://./model/model.json')
  const raw = await model.predict(tf.tensor2d([x], [1, xDataLength]))
    .dataSync()
  return raw[0]
}

const fibNormal = {
  1: 1,
  2: 2,
  3: 3,
  5: 4,
  8: 5,
  13: 6,
  20: 7,
  40: 8,
  100: 9
}

async function runIssue (issue) {
  const score = await predict(normalizeItem(`${issue.Summary} ${issue.Description} ${issue.points}`, key))
  const ceil = Math.ceil(score)
  const fibScore = (ceil > 9 ? Infinity : Object.keys(fibNormal).find(key => fibNormal[key] === ceil)) || -1
  console.log(`
  score        : ${score}
  story points : ${fibScore}`)
}

async function runDescription (description) {
  const score = await predict(normalizeItem(description, key))
  const ceil = Math.ceil(score)
  const fibScore = (ceil > 9 ? Infinity : Object.keys(fibNormal).find(key => fibNormal[key] === ceil)) || -1
  console.log(`Description: ${description}
  score        : ${score}
  story points : ${fibScore}`)
}

/**
 * If argument provided, parse issue json from pasteboard
 * Otherwise, run stored predictionSet
 */
if (process.argv.length === 3 && process.argv[2] === 'p') {
  let issue
  try {
    issue = JSON.parse(pasteboard.readSync())
    if (!issue || !/^IL-\d+$/.test(issue['Issue key'])) {
      throw new Error('Invalid issue')
    }
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
  runIssue(issue)
} else if (process.argv.length === 3) {
  runDescription(process.argv[2])
}
