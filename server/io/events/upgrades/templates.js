const _ = require('lodash')
const db = require('../../../db')
const Bunker = db.model('bunker')

// sending down upgrades menu
function makeMenu (userId) {
  console.log('Calling Make Menu!')
  return Bunker.findOne({ where: { userId } })
    .then(bunker => {
      return {
        title: 'Purchase Upgrades',
        description: 'What would you like to upgrade?',
        eventType: 'variadic',
        source: '/pimages/message.png',
        type: 'general',
        id: 998,
        status: 'neutral',
        exitType: 'load',
        options: [ { title: 'water', action: 0, create: () => new Upgrade('water', bunker.waterCapacity, userId) },
          { title: 'air', action: 1, create: () => new Upgrade('air', bunker.airCapacity, userId) },
          { title: 'electricity', action: 2, create: () => new Upgrade('electricity', bunker.electricityCapacity, userId) },
          { title: 'metal', action: 3, create: () => new Upgrade('metal', bunker.metalCapacity, userId) } ],
        next: 'Calculating optimal upgrades',
        socketMsg: true,
        category: 'upgrade'
      }
    })
}

// upgrade object class
class Upgrade {
  constructor (category, level, userId, type = 'capacity') {
    this.title = `${category} ${type} upgrade ${level}`
    this.description = `This increases your ${category} ${type}`
    this.source = `/pimages/${category}.png`
    this.status = 'neutral'
    this.exitType = 'load'
    this.costs = makeCosts(category, level)
    this.benefits = [ { type, category, benefit: 'times', quantity: level } ]
    this.next = ''
    this.eventType = 'variadic'
    this.options = [
      { title: 'purchase', action: 0, create: () => checkPurchase(userId, category, type) },
      { title: 'back', action: 1, create: () => makeMenu(userId) }
    ]
    this.category = 'upgrade'
    this.socketMsg = true
  }
}

// Helper Methods
// if upgrade type is metal -> cost is 20 * lvl for every other element
// otherwise, costs are dependent on every resource except for resource being upgraded
function makeCosts (category, level) {
  return category === 'metal'
    ? [ 'water', 'air', 'electricity' ].map(type => new Cost(type, 20 * level))
    : [ new Cost('metal', 20 * level), ...(otherTypes(category).map(other => new Cost(other, 15 * level))) ]
}

class Cost {
  constructor (type, quantity) {
    this.type = type
    this.quantity = quantity
  }
}
function otherTypes (type) {
  return _.without([ 'water', 'air', 'electricity' ], type)
}

// Logic for when a user makes a purchase, directs to one of two actions
function checkPurchase (userId, category, type = 'capacity') {
  console.log('CHECKING USER PURCHASE~~~~~')
  console.log('CATEGORY: ', category)
  return Bunker.findOne({ where: { userId } })
    .then(bunker => {
      console.log('UPGRADE TYPE: ', type)
      let level = bunker[ `${category}${type.substring(0, 1).toUpperCase()}${type.substring(1)}` ]
      console.log('LEVEL: ', level)
      let costs = makeCosts(category, level)
      return costs.every(costObj => bunker[ costObj.type ] >= costObj.quantity)
        ? purchaseSuccess(userId, costs, bunker)
        : purchaseFailure(userId)
    })
}

// Subtracts the resources,  and then does nothing for now, ends the generator chain
function purchaseSuccess (userId, costs, bunker) {
  console.log('PURCHASE SUCCESS')
  costs.forEach(costObj => bunker.subtract(costObj.type, costObj.quantity))
  return bunker.save().then(() => undefined)
}

// informs the user that the purchase failed and then either restarts process or exits
function purchaseFailure (userId) {
  console.log('PURCHASE FAILURE GETTING CALLED')
  return {
    title: 'Nice Try...',
    description: `You don't have enough resources`,
    eventType: 'variadic',
    source: '/pimages/message.png',
    type: 'general',
    id: 998,
    status: 'neutral',
    exitType: 'load',
    options: [ { title: 'Browse More', action: 0, create: () => makeMenu(userId) }, { title: 'Exit', action: 1, create: undefined } ],
    next: 'Calculating optimal upgrades',
    socketMsg: true,
    category: 'upgrade'
  }
}

module.exports = makeMenu
