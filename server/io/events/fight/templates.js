const Character = require('../../../db').model('character')

function statCheck (dangerLevel, userId) {
  return Character.findOne({where: {userId}})
    .then(character => {
      return Math.floor(Math.random() * dangerLevel) < Math.floor(Math.random() * character.attackPower)
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
  run: function (dangerLevel) {
    let win = statCheck(dangerLevel, userId)
    return {
      title: '',
      description: '',
      src: '',
      id: '',
      status: '',
      exitType: '',
      next: ''
    }
  }
}
