const Sequelize = require('sequelize')
const _ = require('lodash')
const db = require('../../_db')

module.exports = db.define('character', {
  perk: {
    type: Sequelize.ENUM('miner', 'scientist', 'soldier'),
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT,
    defaultValue: ''
  },
  strength: {
    type: Sequelize.INTEGER,
    defaultValue: 1
  },
  endurance: {
    type: Sequelize.INTEGER,
    defaultValue: 1
  },
  perception: {
    type: Sequelize.INTEGER,
    defaultValue: 1
  },
  luck: {
    type: Sequelize.INTEGER,
    defaultValue: 1
  },
  intelligence: {
    type: Sequelize.INTEGER,
    defaultValue: 1
  },
  tinkering: {
    type: Sequelize.INTEGER,
    defaultValue: 1
  }
}, {
  getterMethods: {
    attackPower: function () {
      return this.perk === 'soldier'
        ? this.strength * 2
        : this.strength
    }
  },
  hooks: {
    beforeCreate: function (character) {
      console.log('character!', character.perk)
      if (character.perk === 'soldier') {
        character.strength = _.sample(_.range(7, 11))
        character.perception = _.sample(_.range(7, 11))
      }
      if (character.perk === 'scientist') {
        character.intelligence = _.sample(_.range(7, 11))
        character.tinkering = _.sample(_.range(7, 11))
      }
      if (character.perk === 'miner') {
        character.endurance = _.sample(_.range(7, 11))
        character.luck = _.sample(_.range(7, 11))
      }
    }
  }
})
