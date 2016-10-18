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
        options: [
          new Upgrade('water', bunker.waterCapacity / 500, userId, 500, 0),
          new Upgrade('air', bunker.airCapacity / 500, userId, 500, 1),
          new Upgrade('electricity', bunker.electricityCapacity / 500, userId, 500, 2),
          new Upgrade('metal', bunker.metalCapacity / 500, userId, 500, 3)
        ],
        next: 'Calculating optimal upgrades',
        socketMsg: true,
        category: 'upgrade',
        forceEventType: 'upgrades'
      }
    })
}

// upgrade object class
class Upgrade {
  constructor (category, level, userId, levelDivisor, actionId, type = 'capacity') {
    this.title = `${category} ${type} upgrade ${level}`
    this.description = `This increases your ${category} ${type}`
    this.source = `/pimages/${category}.png`
    this.status = 'neutral'
    this.exitType = 'immediate'
    this.costs = makeCosts(category, level, type)
    this.benefits = [ { type, category, benefit: 'plus', quantity: levelDivisor } ]
    this.next = ''
    this.id = 1000
    this.eventType = 'variadic'
    this.category = 'upgrade'
    this.socketMsg = true
    // this property is necessary in order to call changeModal('upgrades')
    // even though 'serverRes' listener uses changeModal('message') by default
    this.forceEventType = 'upgrades'
    // THIS IS FOR THE BUY OPTION!!!!
    this.action = actionId
    this.create = () => checkPurchase(userId, category, type, levelDivisor)
  }
}

// Helper Methods
// if element to be upgraded is metal -> cost is 20 * lvl for every other element
// otherwise, costs are dependent on every resource except for resource being upgraded
function makeCosts (category, level, upgradeType) {
  let baseCost = 20
  if (upgradeType === 'capacity') {
    baseCost = 250
  }
  return category === 'metal'
    ? [ 'water', 'air', 'electricity' ].map(type => new Cost(type, baseCost * level))
    : [ new Cost('metal', baseCost * level), ...(otherTypes(category).map(other => new Cost(other, baseCost * level))) ]
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
function checkPurchase (userId, category, type = 'capacity', levelDivisor) {
  return Bunker.findOne({ where: { userId } })
    .then(bunker => {
      let upgradeCategory = `${category}${type.substring(0, 1).toUpperCase()}${type.substring(1)}`
      let level = bunker[ upgradeCategory ] / levelDivisor
      let costs = makeCosts(category, level, type)
      console.log('COSTS: ', costs)
      return costs.every(costObj => bunker[ costObj.type ] >= costObj.quantity)
        ? purchaseSuccess(userId, costs, bunker, upgradeCategory)
        : purchaseFailure(userId)
    })
}

// Subtracts the resources,  and then does nothing for now, ends the generator chain
function purchaseSuccess (userId, costs, bunker, upgradeCategory) {
  // TODO: put actual upgrade to capacity here!
  // deduct appropriate resource amount for upgrade
  costs.forEach(costObj => bunker.subtract(costObj.type, costObj.quantity))
  // increase appropriate upgrade field in bunker instance
  bunker.upgradeCapacity(upgradeCategory)
  return bunker.save().then(() => {
    return {
      title: 'It seems you have enough resources for your upgrade!',
      description: 'Please place your upgrade in the appropriate space in the bunker.',
      eventType: 'confirm',
      source: '',
      type: 'general',
      id: 998,
      status: 'success',
      exitType: 'immediate',
      // this has to go on a confirm event object because the generator needs
      // options array with create property in the first object returning undefined
      // in order to resolve
      options: [ {create: undefined} ],
      socketMsg: true,
      category: 'upgrade',
      afterEffect: 'allowBunkerUpgrade'
    }
  })
}

// informs the user that the purchase failed and then either restarts process or exits
function purchaseFailure (userId) {
  console.log('PURCHASE FAILURE GETTING CALLED')
  return {
    title: 'Nice Try...',
    description: `You don't have enough resources`,
    eventType: 'confirm',
    source: '/pimages/message.png',
    type: 'general',
    id: 998,
    status: 'neutral',
    exitType: 'immediate',
    options: [ { title: 'Exit', action: 0, create: undefined } ],
    // next: 'Calculating optimal upgrades',
    socketMsg: true,
    category: 'upgrade'
  }
}
// { title: 'Browse More', action: 0, create: () => makeMenu(userId) },

module.exports = makeMenu
