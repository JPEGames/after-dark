describe('BunkerStateFactory', function () {
  beforeEach(module('AfterDark'))

  var $httpBackend
  var BunkerStateFactory = null
  beforeEach(inject(function (_BunkerStateFactory_, _$httpBackend_) {
    BunkerStateFactory = _BunkerStateFactory_
    $httpBackend = _$httpBackend_
  }))

  it('should exist', function () {
    expect(BunkerStateFactory).to.be.an('object')
  })


})
