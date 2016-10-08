const Firebase = require('firebase')
let config = {
  apiKey: 'AIzaSyBta3VMqrzMP5tCWcixB0wlEat5pvz_GcY',
  authDomain: 'after-dark-b86e4.firebaseapp.com',
  databaseURL: 'https://after-dark-b86e4.firebaseio.com',
  storageBucket: '',
  messagingSenderId: '635243851384'
}

module.exports = Firebase.initializeApp(config).database().ref()

