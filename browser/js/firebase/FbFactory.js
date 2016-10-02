app.factory('FbFactory', function () {
  let FbFactory = {}
  let instance = null
  FbFactory.initialize = () => {
    let config = {
      apiKey: 'AIzaSyBta3VMqrzMP5tCWcixB0wlEat5pvz_GcY',
      authDomain: 'after-dark-b86e4.firebaseapp.com',
      databaseURL: 'https://after-dark-b86e4.firebaseio.com',
      storageBucket: '',
      messagingSenderId: '635243851384'
    }
    instance = window.firebase.initializeApp(config).database().ref()
  }
  FbFactory.getFirebaseRef = () => instance
  return FbFactory
})
