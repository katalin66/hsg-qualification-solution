import firebase from "firebase";
// Készítsd el a saját config.js fájlodat a config.example.js fájl alapján
import firebaseConfig from "./firebase/config";
import Fakerator from "fakerator";

const fakerator = Fakerator("hu-HU");

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

firebase
  .auth()
  .signInAnonymously()
  .then(() => {
    console.log("signed in");
  })
  .catch((error) => {
    console.error(error);
  });

firebase.auth().onAuthStateChanged(async (user) => {
  const promises = [];

  const roles = ["vendég", "regisztrált felhasználó"];

  if (user) {
    for (let index = 0; index <= 10; index++) {
      const generatedUser = fakerator.entity.user();
      const item = {
        fullName: `${generatedUser.lastName} ${generatedUser.firstName}`,
        email: generatedUser.email,
        role: index === 1 ? "admin" : roles[randomInt(0, 1)],
        yearOfBirth: randomInt(1900, 2020),
      };

      const writePromise = db
        .collection("qualification-exam")
        .doc(index + "")
        .set(item)
        .then(() => {
          console.log("Document written");
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });
      promises.push(writePromise);
    }

    Promise.all(promises).then(() => {
      process.exit(0);
    });
  }
});

function randomInt(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
