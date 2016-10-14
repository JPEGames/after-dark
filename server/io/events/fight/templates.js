const Character = require('../../../db').model('character')
const Promise = require('bluebird')

function statCheck (dangerLevel, userId) {
  return Character.findOne({where: {userId}})
    .then(character => {
      return Math.random() * dangerLevel < Math.random() * character.attackPower
    })
}

const ratMessage = 'A giant Earth Rat attacked! What do you do?'
function makeRatattack (userId, message = ratMessage) {
  return {
    title: 'Rat Attack!',
    description: message,
    eventType: 'variadic',
    source: '/pimages/rat.svg',
    id: 6,
    status: 'danger',
    exitType: 'load',
    next: '',
    options: [
      {title: 'Run', req: false, action: 0, create: () => run(userId)},
      {title: 'Fight', req: false, action: 1, create: () => fight(userId)}
    ]
  }
}

function run (userId, dangerLevel = 2) {
  return Promise.resolve(statCheck(dangerLevel, userId))
    .then((value) => {
      console.log('promise resolved', value)
      return value ? runSuccess : runFailure
    })
}

function fight (userId, dangerLevel = 2) {
  return statCheck(dangerLevel, userId)
    .then((value) => {
      console.log('fight win: ', value)
      return value ? fightSuccess : fightFailure
    })
}

const runSuccess = {
  title: 'Run Success',
  description: 'You run away successfully!',
  eventType: 'confirm',
  source: '',
  id: '',
  status: '',
  exitType: '',
  next: '',
  options: '',
  type: ''
}
const runFailure = {
  title: 'Run Failure',
  description: 'Your cowardice is of no avail! You fall down crying.',
  eventType: 'confirm',
  source: '',
  id: '',
  status: '',
  exitType: '',
  next: '',
  options: [{title: 'Run', req: false, action: 0, create: run}],
  type: ''
}
const fightSuccess = {
  title: 'Fight Success',
  description: 'You beat the feisty rodent up!',
  eventType: 'confirm',
  source: '',
  id: '',
  status: '',
  exitType: '',
  next: '',
  options: '',
  type: ''
}
const fightFailure = {
  title: 'Fight Failure',
  description: 'The rat bites into you...HARD. You scream and drop your hard-earned resources.',
  eventType: 'confirm',
  source: '',
  id: '',
  status: '',
  exitType: '',
  next: '',
  options: '',
  type: ''
}

module.exports = {
  ratAttack: Promise.promisify(makeRatattack),
  mutantAttack: {
    title: '',
    description: '',
    source: '',
    id: '',
    status: '',
    exitType: '',
    next: ''
  }
}
