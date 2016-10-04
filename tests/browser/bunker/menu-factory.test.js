describe('MenuFactory', function () {
  beforeEach(module('AfterDark'))

  var $httpBackend
  var $rootScope
  beforeEach('Get tools', inject(function (_$httpBackend_, _$rootScope_) {
    $httpBackend = _$httpBackend_
    $rootScope = _$rootScope_
  }))

  var AuthService, MenuFactory
  beforeEach('Get factories', inject(function (_MenuFactory_, _AuthService_) {
    AuthService = _AuthService_
    MenuFactory = _MenuFactory_
  }))

  it('should be an object', function () {
    expect(MenuFactory).to.be.an('object')
  })

  describe('saveBunker', function () {
    var fakeBunker = {bg: [1], visual: [2], collision: [], interactive: [], upgrades: [], floors: 2, doorSwitch: true}

    it('should only save a bunker when an user is logged-in', function (done) {
      var spy = sinon.spy(AuthService, 'getLoggedInUser')
      MenuFactory.saveBunker(fakeBunker)
        .then(() => {
          expect(spy.called).to.be.ok
          done()
        })
    })

  })
})
