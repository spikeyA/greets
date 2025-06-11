import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Enable anonymous authentication
export const signInAnonymously = async () => {
  try {
    const { user } = await auth().signInAnonymously();
    return user;
  } catch (error) {
    console.error('Anonymous auth error:', error);
    throw error;
  }
};

// Create or update user profile
export const updateUserProfile = async (userId, data) => {
  try {
    await firestore().collection('users').doc(userId).set({
      ...data,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
  } catch (error) {
    console.error('Profile update error:', error);
    throw error;
  }
};

// Store confession in Firestore
export const storeConfession = async (confession) => {
  try {
    const docRef = await firestore().collection('confessions').add({
      ...confession,
      createdAt: firestore.FieldValue.serverTimestamp(),
      isPublic: confession.isPublic || false,
      location: confession.location || null,
    });
    return docRef.id;
  } catch (error) {
    console.error('Confession storage error:', error);
    throw error;
  }
};

// Get public confessions with geolocation
export const getPublicConfessions = async (radius, userLocation) => {
  try {
    const confessions = await firestore()
      .collection('confessions')
      .where('isPublic', '==', true)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();
      
    return confessions.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Fetch confessions error:', error);
    throw error;
  }
};

// Create ephemeral message
export const createEphemeralMessage = async (senderId, receiverId, content) => {
  try {
    const messageRef = await firestore().collection('ephemeral_messages').add({
      senderId,
      receiverId,
      content,
      createdAt: firestore.FieldValue.serverTimestamp(),
      isRead: false,
      expiresAt: firebase.firestore.Timestamp.fromDate(
        new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
      ),
    });
    return messageRef.id;
  } catch (error) {
    console.error('Ephemeral message error:', error);
    throw error;
  }
};

export { firebase, auth, firestore, storage }; 