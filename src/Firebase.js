import {initializeApp} from 'firebase/app';
import {getDatabase} from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: 'taskzilla-10d4b.firebaseapp.com',
  databaseURL: 'https://taskzilla-10d4b-default-rtdb.firebaseio.com',
  projectId: 'taskzilla-10d4b',
  storageBucket: 'taskzilla-10d4b.appspot.com',
  messagingSenderId: '940135903393',
  appId: '1:940135903393:web:face302d4f8653aa9140e0',
  measurementId: 'G-C79M5PZ1R5',
};

export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
