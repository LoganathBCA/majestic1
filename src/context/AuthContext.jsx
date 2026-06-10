import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const AuthContext = createContext();

const ADMIN_UIDS = [
  import.meta.env.VITE_ADMIN_UID,
  'ulRgKkzhMRVjEoopbnLTT1FiDwv1',
  '1uXFRjwJkFfX1PO7HXbRbTCl4Om2'
].filter(Boolean);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // `user` is the Firebase user object (or null when logged out)
  // `loading` is true while onAuthStateChanged hasn't fired yet — prevents
  //   a flash of the "Sign In" button when the user already has a session
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal state: null = closed, 2 = WhatsApp input, 3 = success
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState(1);

  // Firestore-persisted WhatsApp number (Firebase user object has no custom fields)
  const [whatsappNo, setWhatsappNo] = useState('');

  // -----------------------------------------------------------------------
  // onAuthStateChanged — the single source of truth for auth state
  // -----------------------------------------------------------------------
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        // Check whether this user already has a whatsappNo in Firestore
        try {
          const ref = doc(db, 'users', firebaseUser.uid);
          const snap = await getDoc(ref);

          if (!snap.exists() || !snap.data().whatsappNo) {
            // New user or existing user without WhatsApp — open step 2
            setModalStep(2);
            setShowModal(true);
          }
          // If whatsappNo exists → do nothing, no modal
        } catch (err) {
          console.error('Error fetching user doc:', err);
        }
      } else {
        // Logged out
        setUser(null);
        setShowModal(false);
        setModalStep(1);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // -----------------------------------------------------------------------
  // signIn — opens the Google popup
  // -----------------------------------------------------------------------
  const signIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // onAuthStateChanged above handles everything after sign-in
    } catch (err) {
      // User closed the popup — not a real error, just ignore
      if (err.code !== 'auth/popup-closed-by-user') {
        console.error('Sign-in error:', err);
      }
    }
  };

  // -----------------------------------------------------------------------
  // signOut — clears the Firebase session
  // -----------------------------------------------------------------------
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      // onAuthStateChanged fires and resets user to null
    } catch (err) {
      console.error('Sign-out error:', err);
    }
  };

  // -----------------------------------------------------------------------
  // openSubscribe — triggered by Subscribe buttons in Hero / Footer
  // -----------------------------------------------------------------------
  const openSubscribe = () => {
    if (!user) {
      setModalStep(1);
      setShowModal(true);
    } else if (!whatsappNo) {
      setModalStep(2);
      setShowModal(true);
    } else {
      setModalStep(3);
      setShowModal(true);
    }
  };

  const closeSubscribe = () => {
    setShowModal(false);
  };

  // -----------------------------------------------------------------------
  // submitWhatsApp — saves user data to Firestore users/{uid}
  // -----------------------------------------------------------------------
  const submitWhatsApp = async (whatsappNo) => {
    if (!user) return;

    try {
      await setDoc(
        doc(db, 'users', user.uid),
        {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          whatsappNo,
          subscribedAt: serverTimestamp()
        },
        { merge: true } // safe to call even if doc already exists
      );

      // Firebase user object is read-only — we store whatsappNo locally so
      // the UI badge reflects the new state without a full page reload
      // We do this by forcing a re-check of the Firestore doc
      // (the simplest approach that keeps user always === Firebase user)
      setWhatsappNo(whatsappNo);
      setModalStep(3);
    } catch (err) {
      console.error('Error saving WhatsApp number:', err);
      throw err; // Let SubscribeModal surface the error
    }
  };

  // Re-fetch whatsappNo from Firestore when user or modal step changes
  useEffect(() => {
    if (!user) {
      setWhatsappNo('');
      return;
    }

    const fetchWhatsapp = async () => {
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists()) {
          setWhatsappNo(snap.data().whatsappNo || '');
        }
      } catch {
        // silent — non-critical
      }
    };

    fetchWhatsapp();
  }, [user, modalStep]); // re-run when modalStep changes (i.e. after save)

  const isAdmin = user && ADMIN_UIDS.includes(user.uid);
  const effectiveAdminUid = isAdmin ? user.uid : (import.meta.env.VITE_ADMIN_UID || 'ulRgKkzhMRVjEoopbnLTT1FiDwv1');

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        whatsappNo,        // Firestore whatsappNo for badge/status checks
        showModal,
        modalStep,
        signIn,
        signOut,
        openSubscribe,
        closeSubscribe,
        submitWhatsApp,
        ADMIN_UID: effectiveAdminUid,
        isAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
