// TODO: THIS ISN'T BEING USED RIGHT NOW!
const Bunker = require('../../../db').model('bunker')
const Promise = require('bluebird')

function putResourcesInBunker (userId, resources) {
  console.log('putting resources in bunker!!!!')
  return Bunker.findOne({ where: { userId } })
    .then(bunker => {
      console.log('about to update bunker resources!')
      return bunker.update({ resources })
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
    options: [{}, {}],
    next: 'New Storage',
    socketMsg: true
  })
}
module.exports = {
  depositResources: makeDepositResources
}
