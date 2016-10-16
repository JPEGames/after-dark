const Bunker = require('../../../db').model('bunker')
const Backpack = require('../../../db').model('backpack')
const Promise = require('bluebird')
const _ = require('lodash')

function putResourcesInBunker (userId) {
  return Backpack.findOne({ where: { userId } })
    .then(backpack => {
      let resources = {
        air: backpack.air,
        electricity: backpack.electricity,
        water: backpack.water,
        metal: backpack.metal
      }
      return Bunker.findOne({ where: { userId } })
        .then(bunker => {
          return bunker.update(resources)
        })
        .then(() => {
          let defaultResources = {air: 0, electricity: 0, water: 0, metal: 0}
          return backpack.update(defaultResources)
        })
    })
}
function makeDepositResources (userId) {
  return Promise.resolve({
    title: 'Deposit Resources',
    description: 'Would you like to deposit your resources in your bunkers cache for use in upgrading your equipment?',
    eventType: 'yes/no',
    source: '/pimages/message.png',
    type: 'general',
    id: 998,
    status: 'neutral',
    exitType: 'load',
    options: [ { create: () => denyResourceSave() }, { create: () => saveResources(userId) } ],
    next: 'New Storage',
    socketMsg: true,
    category: 'saveBackpack'
  })
}
function saveResources (userId) {
  console.log('You chose to save your resources!!!')
  return Promise.resolve(putResourcesInBunker(userId))
    .then((bunker) => {
      console.log('saved resources!!!')
      return {
        title: 'Resources Successfully Stored',
        description: 'You deposited your hard-earned goods into your bunker!',
        eventType: 'confirm',
        source: '',
        id: '',
        status: 'success',
        exitType: 'immediate',
        next: '',
        options: [ { create: undefined }, { create: undefined } ],
        type: 'general',
        socketMsg: true,
        category: 'saveBackpack',
        afterEffect: 'clearInventory'
      }
    })
}
function denyResourceSave () {
  console.log('You chose not to save your resources~~~')
  return Promise.resolve(
    {
      title: 'Resources Not Stored.',
      description: 'Your choice, your loss',
      eventType: 'confirm',
      source: '',
      id: '',
      status: 'danger',
      exitType: 'immediate',
      next: '',
      options: [ { create: undefined }, { create: undefined } ],
      type: 'general',
      socketMsg: true,
      category: 'saveBackpack'
    }
  )
}
module.exports = {
  depositResources: makeDepositResources
}
