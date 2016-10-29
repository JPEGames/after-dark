'use strict'
const crypto = require('crypto')
const _ = require('lodash')
const Sequelize = require('sequelize')
const db = require('../_db')
const GameState = require('./gamestate')
const Backpack = require('./backpack')
const Promise = require('sequelize').Promise

module.exports = db.define('user', {
  username: {
    type: Sequelize.STRING,
    unique: true
  },
  email: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  },
  salt: {
    type: Sequelize.STRING
  },
  twitter_id: {
    type: Sequelize.STRING
  },
  facebook_id: {
    type: Sequelize.STRING
  },
  google_id: {
    type: Sequelize.STRING
  }
}, {
  instanceMethods: {
    sanitize: function () {
      return _.omit(this.toJSON(), ['password', 'salt'])
    },
    correctPassword: function (candidatePassword) {
      return this.Model.encryptPassword(candidatePassword, this.salt) === this.password
    }
  },
  classMethods: {
    generateSalt: function () {
      return crypto.randomBytes(16).toString('base64')
    },
    encryptPassword: function (plainText, salt) {
      const hash = crypto.createHash('sha1')
      hash.update(plainText)
      hash.update(salt)
      return hash.digest('hex')
    }
  },
  hooks: {
    beforeValidate: function (user) {
      if (user.changed('password')) {
        user.salt = user.Model.generateSalt()
        user.password = user.Model.encryptPassword(user.password, user.salt)
      }
    },
    afterCreate: function (user) {
      return Promise.all([GameState.create({}), Backpack.create({userId: user.id})])
    }
  }
})
