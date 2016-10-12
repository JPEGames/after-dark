let lootTable = require('./loot.js')

let eventAttach = (point, modifier = a => a) => {
  // probability ANY event will be attached to a given point
  let eventTable = modifier(lootTable)
  let generationProb = 0.6
  if (Math.random() <= generationProb) point.event = eventSelector(eventTable)
  return point
}

// given a loot table, return the associated event
let eventSelector = (eventTable) => {
  let randomProb = Math.random()
  let chosenEvent

  // array of probabilities corresponding to loot table
  let probThresholds = Object.keys(eventTable).map(key => parseFloat(key)).sort()

  // randomly picks event in loot table based on random # generated
  for (let i = 0; i < probThresholds.length; i++) {
    if (randomProb <= probThresholds[i]) {
      chosenEvent = eventTable[probThresholds[i]]
      break
    }
  }
  return chosenEvent
}

module.exports = eventAttach
