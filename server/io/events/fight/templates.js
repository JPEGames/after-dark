const Character = require('../../../db').model('character')
const Promise = require('bluebird')

function statCheck (dangerLevel, userId) {
  return Character.findOne({where: {userId}})
    .then(character => {
      return Math.random() * dangerLevel < Math.random() * character.attackPower
    })
}

let userId // need to actual get this...
module.exports = {
  ratAttack: {
    title: 'Rat Attack!',
    description: 'A giant Earth Rat attacked! What do you do?',
    eventType: 'variadic',
    source: '/pimages/rat.svg',
    id: 6,
    status: 'danger',
    exitType: 'load',
    next: '',
    options: [
      {title: 'Run', req: false, action: 0},
      {title: 'Fight', req: false, action: 1},
      {title: 'Talk', req: false, action: 2}
    ]
  },
  mutantAttack: {
    title: '',
    description: '',
    source: '',
    id: '',
    status: '',
    exitType: '',
    next: ''
  },
  run: function (dangerLevel, userId) {
    let win = Promise.resolve(statCheck(dangerLevel, userId))
    return win.then((value) => {
      console.log('promise resolved', value)
      return value ? this.runSuccess : this.runFailure
    })
  },
  fight: function (dangerLevel, userId) {
    let win = Promise.resolve(statCheck(dangerLevel, userId))
    return win.then((value) => {
      console.log('fight win: ', value)
      return value ? this.fightSuccess : this.fightFailure
    })
  },
  runSuccess: {
    title: 'Run Success',
    description: 'You run away successfully!',
    eventType: 'confirm',
    source: '',
    id: '',
    status: '',
    exitType: '',
    next: '',
    options: ''
  },
  runFailure: {
    title: 'Run Failure',
    description: 'Your cowardice is of no avail! You fall down crying.',
    eventType: 'confirm',
    source: '',
    id: '',
    status: '',
    exitType: '',
    next: '',
    options: ''
  },
  fightSuccess: {
    title: 'Fight Success',
    description: 'You beat the feisty rodent up!',
    eventType: 'confirm',
    source: '',
    id: '',
    status: '',
    exitType: '',
    next: '',
    options: ''
  },
  fightFailure: {
    title: 'Fight Failure',
    description: 'The rat bites into you...HARD. You scream and drop your hard-earned resources.',
    eventType: 'confirm',
    source: '',
    id: '',
    status: '',
    exitType: '',
    next: '',
    options: ''
  }
}
