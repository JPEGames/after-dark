// var traveller = require('./event-tree')

module.exports = class EventTree {
  constructor (title, description, source, id, status, exitType, next) {
    this.title = title
    this.description = description
    this.source = source
    this.id = id
    this.status = status
    this.exitType = exitType
    this.next = next
    this.outcomes = []
  }
  insert (parentEvent, childEvent, childDesc, childSource, childId, childStatus, childExitType, childNext) {
    if (!this.contains(parentEvent)) throw new Error('No such event in tree!')
    if (this.title === parentEvent) {
      console.log('Adding', childEvent)
      this.outcomes.push(new EventTree(childEvent, childDesc, childSource, childId, childStatus, childExitType, childNext))
      return true
    } else {
      return this.outcomes.some(outcome => {
        return outcome.insert(parentEvent, childDesc, childSource, childId, childStatus, childExitType, childNext)
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

// insert event as a possible outcome of an existing event
// EventTree.prototype.insert = function (parentEvent, childEvent, childEventType) {
//   if (!this.contains(parentEvent)) throw new Error('No such event in tree!')
//   if (this.event === parentEvent) {
//     console.log('Adding', childEvent)
//     this.outcomes.push(new EventTree(childEvent, childEventType))
//     return true
//   } else {
//     return this.outcomes.some(outcome => {
//       return outcome.insert(parentEvent, childEvent, childEventType)
//     })
//   }
// }
//
// EventTree.prototype.contains = function (event) {
//   if (!this.event) return false
//   if (this.event === event) {
//     return true
//   } else {
//     return this.outcomes.some(outcome => {
//       return outcome.contains(event)
//     })
//   }
// }
