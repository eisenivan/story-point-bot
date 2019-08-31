import * as tf from '@tensorflow/tfjs-node'
import fs from 'fs'
import { buildKey, buildXs, buildYs, buildSet } from './helpers'
import jsonObj from './data/story-points.json'

const arr = buildSet(jsonObj)

const key = buildKey(arr)
fs.writeFileSync('./model/key.json', JSON.stringify(key, null, 2), 'utf8')

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

const normalizeStoryPoints = x => fibNormal[x] || 3

const xData = buildXs(arr, key)
const yData = buildYs(jsonObj.map(
  x => normalizeStoryPoints(parseInt(x.points, 10))
))

// Define a model for linear regression.
const model = tf.sequential()
model.add(tf.layers.dense({ units: 1, inputShape: [xData[0].length] }))

// Prepare the model for training: Specify the loss and the optimizer.
model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' })

// X's are the input strings
const xs = tf.tensor2d(xData, [xData.length, xData[0].length])
// Y's are the real results
const ys = tf.tensor2d(yData, [yData.length, yData[0].length])

// Train the model using the data.
model.fit(xs, ys, { epochs: 3000 }).then(() => {
  model.save('file://./model')
})
