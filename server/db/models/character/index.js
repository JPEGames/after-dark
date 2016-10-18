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
  },
  experience: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
}, {
  getterMethods: {
    attackPower: function () {
      return this.perk === 'soldier'
        ? this.strength * 2
        : this.strength
    },
    level: function () {
      return this.experience < 2000 ? 1 : Math.floor(Math.log2(this.experience / 1000)) + 1
    },
    levelExp: function () {
      return this.experience > 2000 ? Math.pow(2, this.level) * 1000 : 2000
    },
    relativeExp: function () {
      return this.experience > 2000
        ? this.experience - _.range(1, this.level).map(num => Math.pow(2, num) * 1000).reduce((prev, curr) => prev + curr)
        : this.experience
    }
  },
  hooks: {
    beforeCreate: function (character) {
      if (character.perk === 'soldier') {
        // <--- STRONG ATTRIBUTES --->
        character.strength = _.sample(_.range(7, 11))
        character.perception = _.sample(_.range(7, 11))
        // <--- MEDIUM ATTRIBUTES --->
        character.intelligence = _.sample(_.range(5, 9))
        character.endurance = _.sample(_.range(5, 9))
        // <--- WEAK ATTRIBUTES --->
        character.tinkering = _.sample(_.range(3, 7))
        character.luck = _.sample(_.range(3, 7))
      }
      if (character.perk === 'scientist') {
        // <--- STRONG ATTRIBUTES --->
        character.intelligence = _.sample(_.range(7, 11))
        character.tinkering = _.sample(_.range(7, 11))
        // <--- MEDIUM ATTRIBUTES --->
        character.luck = _.sample(_.range(5, 9))
        character.perception = _.sample(_.range(5, 9))
        // <--- WEAK ATTRIBUTES --->
        character.strength = _.sample(_.range(3, 7))
        character.endurance = _.sample(_.range(3, 7))
      }
      if (character.perk === 'miner') {
        // <--- STRONG ATTRIBUTES --->
        character.endurance = _.sample(_.range(7, 11))
        character.luck = _.sample(_.range(7, 11))
        // <--- MEDIUM ATTRIBUTES --->
        character.strength = _.sample(_.range(5, 9))
        character.tinkering = _.sample(_.range(5, 9))
        // <--- WEAK ATTRIBUTES --->
        character.intelligence = _.sample(_.range(3, 7))
        character.perception = _.sample(_.range(3, 7))
      }
    }
  }
})
