import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';

const firebaseConfig = {
  apiKey: "wOvVn8T56yjFnybBZ6gG9BiZU5Fsvhh45Ldb0d8eRVE",
  authDomain: "greetsapp.firebaseapp.com",
  projectId: "greetsapp-760e7",
  storageBucket: "greetsapp.appspot.com",
  messagingSenderId: "349692795489",
  appId: "1:349692795489:android:5c14e2ef251fa8c9b4e820",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase, auth, storage };

