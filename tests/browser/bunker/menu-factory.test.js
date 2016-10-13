window.isTesting = true

describe('MenuFactory', function () {
  beforeEach(module('js/common/directives/navbar/navbar-state.html'))
  beforeEach(module('AfterDark'))

  var $httpBackend
  var $rootScope
  var $q
  beforeEach('Get tools', inject(function (_$httpBackend_, _$rootScope_, _$q_) {
    $httpBackend = _$httpBackend_
    $rootScope = _$rootScope_
    $q = _$q_
  }))

  var AuthService, MenuFactory
  beforeEach('Get factories', inject(function (_MenuFactory_, _AuthService_) {
    AuthService = _AuthService_
    MenuFactory = _MenuFactory_
  }))

  afterEach(function () {
    $httpBackend.verifyNoOutstandingRequest()
    $httpBackend.verifyNoOutstandingExpectation()
  })

  it('should be an object', function () {
    expect(MenuFactory).to.be.an('object')
  })

  describe('saveBunker', function () {
    var fakeBunker = {bg: [1], visual: [2], collision: [], interactive: [], upgrades: [], floors: 2, doorSwitch: true}

    it('should only save a bunker when an user is logged-in', function (done) {
      var stub = sinon.stub(AuthService, 'getLoggedInUser', function () {
        return $q.when({id: 2})
      })

      $httpBackend.expectPUT('/api/bunkerstate/2', fakeBunker).respond({})

      setTimeout(function () {
        $httpBackend.flush()
      }, 500)

      MenuFactory.saveBunker(fakeBunker)
        .then(() => {
          expect(stub.called).to.be.ok
          stub.restore()
          done()
        })
    })
  })
})
