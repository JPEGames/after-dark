// <--- DATA STRUCTURE USED TO HANDLE EVENT GENERATION --->
module.exports = class EventTree {
  constructor (title, description, eventType, source, id, status, exitType, next, options) {
    this.title = title
    this.description = description
    this.eventType = eventType
    this.source = source
    this.id = id
    this.status = status
    this.exitType = exitType
    this.next = next
    this.options = options
    this.outcomes = []
  }
  insert (parentEvent, childEvent, childDesc, childType, childSource, childId, childStatus, childExitType, childNext, childOptions) {
    if (!this.contains(parentEvent)) throw new Error('No such event in tree!')
    if (this.title === parentEvent) {
      console.log('Adding', childEvent)
      this.outcomes.push(new EventTree(childEvent, childDesc, childType, childSource, childId, childStatus, childExitType, childNext, childOptions))
      return true
    } else {
      return this.outcomes.some(outcome => {
        return outcome.insert(parentEvent, childDesc, childType, childSource, childId, childStatus, childExitType, childNext, childOptions)
      })
    }
  }
  contains (title) {
    if (!this.title) return false
    if (this.title === title) {
      return true
    } else {
      return this.outcomes.some(outcome => {
        return outcome.contains(title)
      })
    }
  }
}

// class UpgradeTree extends EventTree {
//   constructor (title, description, source, id, status, exitType, next, cost, benefit) {
//     super(title, description, source, id, status, exitType, next)
//     this.cost = cost
//     this.benefit = benefit
//   }
// }

// let firstUpgrades = new UpgradeTree('airProduction', 'produces more air', 'air.png', 1, 'success', 'load', '', [], [])
// let newNode = ['airProduction', 'confirm', 'confirm upgrade', '', 2, 'success', 'load', '', [], []]
// console.log(firstUpgrades)
// console.log(firstUpgrades.contains())
// console.log(...newNode)
// firstUpgrades.insert(...newNode)
// console.log(firstUpgrades)
