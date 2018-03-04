const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
require('isomorphic-fetch');

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest((request, response) => {
  var url = "//us.api.battle.net/wow/character/terokkar/thae?fields=reputation&locale=en_US&apikey=zpje22a5t884txe4snraxsddeu8xmyjq";
  response.send("Hello from Firebase!");

  let realm = 'terokkar';
  let character = 'zerza';



  let characters = { Kels: { name: 'Kels', realm: 'blackwater-raiders' },
  Sildreu: { name: 'Sildreu', realm: 'Terokkar' },
  Thae: { name: 'Thae', realm: 'Terokkar' },
  Umbrien: { name: 'Umbrien', realm: 'Terokkar' },
  Zerza: { name: 'Zerza', realm: 'Terokkar' } };

let characterArray = Object.keys(characters).map(i => characters[i]);
characterArray.forEach((character) => {
    let name = character.name;
    let realm = character.realm;
    console.log(name);

    return fetchData(buildUrl(realm, name))
  });


});

function getCharacters(){
  return admin.database().ref(`characters`).once('value')
  .then((snapshot) => {
     return snapshot.val();
  })

}

function buildUrl(realm, character){
  let url = "//us.api.battle.net/wow/character/" + realm + "/" + character + "?fields=reputation&locale=en_US&apikey=zpje22a5t884txe4snraxsddeu8xmyjq";
  return url;
}

function status(response) {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response)
  } else {
    return Promise.reject(new Error(response.statusText))
  }
}

function json(response) {
  return response.json()
}

function saveData(data){
  var key = data.name;
  var timestamp = data.lastModified;

  return data.reputation.forEach((element) => {
    var factionId = element.id;

    admin.database().ref(`/reputations/${key}/${factionId}/${timestamp}`)
    .update({standing : element.standing, value : element.value, max : element.max });

  });
}

function fetchData(url){
  return  fetch(url)
    .then(status)
    .then(json)
    .then(saveData)
    .catch((error) => {
      console.log('Request failed', error);
    });

}
