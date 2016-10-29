// TODO: Karma access to Geofire?

describe('BunkerStateFactory', function () {
  beforeEach(module('AfterDark'))
  console.log(window.Geofire)
  var $httpBackend
  var BunkerStateFactory = null

  let geofireStub, fbStub
  beforeEach(inject(function (FbFactory) {
    geofireStub = sinon.stub(window, 'GeoFire', function () {
      return {
        set: function () {}
      }
    })
    fbStub = sinon.stub(FbFactory, 'getFirebaseRef', function () {
      return {
        child: function () {
          return [{}]
        },
        hiJustin: true
      }
    })
  }))

  afterEach(function () {
    fbStub.restore()
    geofireStub.restore()
  })

  beforeEach(inject(function (_BunkerStateFactory_, _$httpBackend_) {
    BunkerStateFactory = _BunkerStateFactory_
    $httpBackend = _$httpBackend_
  }))

  it('should exist', function () {
    expect(BunkerStateFactory).to.be.an('object')
  })

  describe('getBunkerState', function () {
    it('should make a GET request to /api/bunkerstate/(userId)', function () {

    })
  })
})
