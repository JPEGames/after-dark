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
    var users = [{
      email: 'testing@test.com',
      password: 'sup'
    },
      {
        email: 'testing2@test.com',
        password: 'hi'
      }]
    var creatingUsers = users.map(user => User.create(user))
    return Promise.all(creatingUsers)
      .then((result) => {
        var bunkerCreation = [Bunker.create({lat: '42.2', lng: '42.3', userId: 1}),
          Bunker.create({lat: '22.2', lng: '24.2', userId: 2})]
        return Promise.all(bunkerCreation)
          .then(() => {
            console.log('done')
          })
      })
  })

  describe('GET /api/bunkerstate/:id', function () {

    it('retrieve correct bunker for user', function (done) {
      agent.get('/api/bunkerstate/1').expect(200).end(function (err, res) {
        if (err) return done(err)
        expect(res.body.userId).to.equal(1)
        expect(res.body.lat).to.equal('42.2')
        expect(res.body.lng).to.equal('42.3')
        done()
      })
    })

  })

  describe('POST /api/bunkerstate/:id', function () {
    var newUser
    beforeEach('make new user', function () {
        var makeUser = User.create({email: 'test@fsa.com', password: '1234'})
        return Promise.resolve(makeUser)
          .then(user => {
            newUser = user
          })
    })

    // TODO: this doesn't work with associating the bunker with an user!!
    it('successfully adds a new bunker to the db', function (done) {
      let fakeBunker = {userId: newUser.id, lat: '42.5', lng: '56.4'}
      return agent.post(`/api/bunkerstate/${newUser.id}`)
        .send(fakeBunker)
        .expect(201)
        .end(function(err, res) {
            if (err) return done(err)
            expect(res.body.userId).to.equal(3)
            done()
        })
    })
  })
})
