const expect = require('chai').expect
const Sequelize = require('sequelize')
const supertest = require('supertest')
const chai = require('chai')
const Promise = require('bluebird')
chai.use(require('chai-things'))
const db = require('../../../server/db')
const app = require('../../../server/app')(db)
const agent = supertest.agent(app)

// models
const Bunker = db.model('bunker')
const User = db.model('user')

describe('Bunker Route', function () {
  beforeEach('Sync DB', function () {
    return db.sync({force: true})
  })
  beforeEach('Create users', function () {

  })
  beforeEach('Create bunkers and associate', function () {

  })
})
