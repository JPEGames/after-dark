const Character = require('../../../db').model('character')
const Promise = require('bluebird')

// <---- DEFAULT MESSAGES FOR EVENT CONSTRUCTORS --->
const ratMessage = 'A giant Earth Rat attacked! What do you do?'

// <---- HELPER FUNCTIONS THAT INTERACT WITH BACKEND ---->
function statCheck (dangerLevel, userId) {
  return Character.findOne({where: {userId}})
    .then(character => {
      return Math.random() * dangerLevel < Math.random() * character.attackPower
    })
}

// <---- CUSTOM CONSTRUCTOR FUNCTIONS INVOKED IN GENERATOR FUNCTION ---->
function makeRatattack (userId, message = ratMessage) {
  return Promise.resolve({
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
    ],
    type: 'general',
    socketMsg: true,
    category: 'fight'
  })
}

function run (userId, dangerLevel = 2) {
  return Promise.resolve(statCheck(dangerLevel, userId))
    .then((value) => {
      console.log('promise resolved', value)
      return value ? {
        title: 'Run Success',
        description: 'You run away successfully!',
        eventType: 'confirm',
        source: '',
        id: '',
        status: '',
        exitType: '',
        next: '',
        options: [{title: 'Run', req: false, action: 0, create: undefined}],
        type: 'general',
        socketMsg: true,
        category: 'fight'
      } : {
        title: 'Run Failure',
        description: 'Your cowardice is of no avail! You fall down crying.',
        eventType: 'confirm',
        source: '',
        id: '',
        status: '',
        exitType: 'load',
        next: 'Are you fast enough?????',
        options: [{title: 'Run', req: false, action: 0, create: (userId) => makeRatattack(userId, 'You are a failure. The rat leaps on you and spins you around!')}],
        type: 'general',
        socketMsg: true,
        category: 'fight'
      }
    })
}

function repeatRatAttack (userId) {
  return makeRatattack(userId, 'You are a failure. The rat leaps on you and spins you around!')
}

function fight (userId, dangerLevel = 2) {
  return statCheck(dangerLevel, userId)
    .then((value) => {
      console.log('fight win: ', value)
      return value ? fightSuccess : fightFailure
    })
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
  options: [{title: 'Run', req: false, action: 0, create: undefined}],
  type: 'general',
  socketMsg: true,
  category: 'fight'
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
  options: [{title: 'Run', req: false, action: 0, create: undefined}],
  type: 'general',
  socketMsg: true,
  category: 'fight'
}

// <------- POSSIBLE STARTING EVENTS FOR INITIATING GENERATOR FUNCTION ------>
module.exports = {
  ratAttack: makeRatattack,
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
