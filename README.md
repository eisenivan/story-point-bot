# Story Point Estimation Proof of Concept

This readme is a work in progress. Inclided in the `data` directory is `story-points.json`. This file contains 100 bugs pulled from the Lodash github repo. I threw story point estimates on it myself. This obviously isn't useful. You'll need to get your own training set to replace the one in `story-points.json`.

You'll also probably need to modify line 3 in `helpers.js`. This function is what takes your JSON structure and converts them into a single text item. Unless the shape of your training set is the same, update this function to concat all the fields you care about.

## Usage

```
npm i

// Train the model
npm run train

// Run a prediction
npm run predict "your story here"
```
