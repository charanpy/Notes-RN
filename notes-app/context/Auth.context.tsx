import React, { createContext, useCallback, useEffect, useState } from 'react';

export interface User {
  name: string;
  email: string;
  _id: string;
}

const initialUser = {
  name: '',
  email: '',
  _id: '',
};

export const AuthContext = createContext({
  user: initialUser,
  loading: true,
  setUser: (user: User) => {},
});

const AuthProvider: React.FC = ({ children }) => {
  const [user, setUserData] = useState<User>(initialUser);

  const setUser = (user: User) => {
    if (user) setUserData(user);
  };

  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch('https://notes-rn.herokuapp.com/api/v1/auth/me');
      const user = await res.json();
      console.log(user);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
