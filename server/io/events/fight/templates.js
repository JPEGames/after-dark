const Character = require('../../../db').model('character')

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
    src: '/pimages/rat.svg',
    id: '',
    status: '',
    exitType: '',
    next: ''
  },
  mutantAttack: {
    title: '',
    description: '',
    src: '',
    id: '',
    status: '',
    exitType: '',
    next: ''
  },
  run: function (dangerLevel, userId) {
    let win = Promise.resolve(statCheck(dangerLevel, userId))
    win.then((value) => {
      console.log('promise resolved', value)
      return value ? this.runSuccess : this.runFailure
    })
  },
  fight: function (dangerLevel) {
    let win = statCheck(dangerLevel, userId)
  },
  runSuccess: {
    title: 'Run Success',
    description: 'You run away successfully!',
    src: '',
    id: '',
    status: '',
    exitType: '',
    next: ''
  },
  runFailure: {
    title: 'Run Failure',
    description: 'Your cowardice is of no avail! You fall down crying.',
    src: '',
    id: '',
    status: '',
    exitType: '',
    next: ''
  }
}
