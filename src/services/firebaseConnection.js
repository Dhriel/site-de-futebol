import {initializeApp} from 'firebase/app'
import {getFirestore} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';
import {getStorage} from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyC6u4kKFWCmaqqZBi46WYBi8DsUvnvTKNQ",
    authDomain: "galaticos-d9405.firebaseapp.com",
    projectId: "galaticos-d9405",
    storageBucket: "galaticos-d9405.appspot.com",
    messagingSenderId: "866837239230",
    appId: "1:866837239230:web:9fe418eec4afbab54c15ef",
    measurementId: "G-H4PWZRD0LT"
  };

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);

export {db, auth, storage};