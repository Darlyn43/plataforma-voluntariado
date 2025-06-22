import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, query, where, getDocs, updateDoc, orderBy, limit } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Auth functions
export const signIn = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const signUp = async (email: string, password: string) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const logout = async () => {
  return await signOut(auth);
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

export const onAuthChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Firestore functions
export const createUserProfile = async (uid: string, userData: any) => {
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, {
    ...userData,
    createdAt: new Date(),
    isFirstLogin: false,
    profileCompleted: true,
  });
};

export const getUserProfile = async (uid: string) => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data() : null;
};

export const saveAssessmentResults = async (uid: string, testType: string, responses: any, results: any) => {
  const assessmentRef = collection(db, 'assessments');
  await addDoc(assessmentRef, {
    userId: uid,
    testType,
    responses,
    results,
    completedAt: new Date(),
  });
};

export const getVolunteerOpportunities = async (userId?: string) => {
  const opportunitiesRef = collection(db, 'opportunities');
  const q = query(opportunitiesRef, where('isActive', '==', true), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getUserParticipations = async (userId: string) => {
  const participationsRef = collection(db, 'participations');
  const q = query(participationsRef, where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const joinOpportunity = async (userId: string, opportunityId: string) => {
  const participationRef = collection(db, 'participations');
  await addDoc(participationRef, {
    userId,
    opportunityId,
    status: 'applied',
    joinedAt: new Date(),
  });
};
