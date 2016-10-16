const _ = require('lodash')
const db = require('../../../db')
const Bunker = db.model('bunker')

// sending down upgrades menu
function makeMenu (userId) {
  return Bunker.findOne({where: {userId}})
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
        options: [ {title: 'air', create: () => new Upgrade('water', bunker.waterCapacity, userId)}, {title: 'air', create: () => new Upgrade('air', bunker.airCapacity, userId)}, {title: 'electricity', create: () => new Upgrade('electricity', bunker.electricityCapacity, userId)}, {title: 'metal', create: () => new Upgrade('metal', bunker.metalCapacity, userId)} ],
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
    this.source = `/pimages/${type}.png`
    this.status = 'neutral'
    this.exitType = 'load'
    this.costs = makeCosts(category, level)
    this.benefits = [{type, category, benefit: 'times', quantity: level}]
    this.next = ''
    this.eventType = 'variadic'
    this.options = [{title: 'purchase', create: () => checkPurchase(type, userId)}, {title: 'back', create: () => makeMenu(userId)}]
  }
}

// Helper Methods
function makeCosts (category, level) {
  return category === 'metal'
    ? ['water', 'air', 'electricity'].map(type => new Cost(type, 20 * level))
    : [new Cost('metal', 20 * level), ...(otherTypes(category).map(other => new Cost(other, 15 * level)))]
}

class Cost {
  constructor (type, quantity) {
    this.type = type
    this.quantity = quantity
  }
}
function otherTypes (type) {
  return _.without(['water', 'air', 'electricity'], type)
}

// Logic for when a user makes a purchase, directs to one of two actions
function checkPurchase (userId, category, type = 'capacity') {
  return Bunker.findOne({where: {userId}})
    .then(bunker => {
      let level = bunker[category + _.upperFirst(type)]
      let costs = makeCosts(category, level)
      return costs.every(costObj => bunker[costObj.type] >= costObj.quantity)
        ? purchaseSuccess(userId, costs, bunker)
        : purchaseFailure(userId)
    })
}

// Subtracts the resources,  and then does nothing for now, ends the generator chain
function purchaseSuccess (userId, costs, bunker) {
  costs.forEach(costObj => bunker.subtract(costObj.type, costObj.quantity))
  return bunker.save().then(() => undefined)
}

// informs the user that the purchase failed and then either restarts process or exits
function purchaseFailure (userId) {
  return {
    title: 'Nice Try...',
    description: `You don't have enough resources`,
    eventType: 'variadic',
    source: '/pimages/message.png',
    type: 'general',
    id: 998,
    status: 'neutral',
    exitType: 'immediate',
    options: [{title: 'Browse More', create: () => makeMenu(userId)}, {title: 'Exit', create: undefined}],
    next: 'Calculating optimal upgrades',
    socketMsg: true,
    category: 'upgrade'
  }
}

module.exports = makeMenu
