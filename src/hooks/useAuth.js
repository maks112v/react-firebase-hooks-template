import { useEffect, createContext, useContext, useState } from 'react';

import firebase, { firestore } from '../firebase';

const GOOGLE_AUTH_PROVIDER = new firebase.auth.GoogleAuthProvider();

export const authContext = createContext({ isLoading: true });

export const useSession = () => useContext(authContext);

export const useAuth = () => {
  const [state, setstate] = useState({
    isLoading: true,
    auth: null,
  });

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(auth => {
      if (auth) {
        setstate({ isLoading: false, auth: auth });
      } else {
        setstate({ isLoading: false, auth: null });
      }
    });
    return () => unsubscribe();
  }, []);

  return state;
};

export const GOOGLE_AUTH_CONTROLLER = 'GOOGLE_AUTH_CONTROLLER';

export const loginHandler = type => {
  switch (type) {
    case GOOGLE_AUTH_CONTROLLER:
      return firebase
        .auth()
        .signInWithPopup(GOOGLE_AUTH_PROVIDER)
        .then(res => {
          firestore
            .collection('users')
            .doc(res.user.uid)
            .set({
              email: res.user.email,
              name: res.user.displayName,
              profile: res.user.photoURL,
            });
        })
        .catch(err => {
          console.log(err);
        });
    default:
      return firebase.auth().signOut();
  }
};
