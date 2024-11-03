import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { auth, db } from "../firebase";
import { User as FirebaseUser, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

interface User {
  firstname: string;
  lastname: string;
  email: string;
  rhuOrBarangay: string;
  imageUrl: string;
  barangay: string;
  uid: string;
  role: string;
}

interface UserContextProps {
  user: User | null;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (authUser: FirebaseUser | null) => {
        if (authUser) {
          try {
            const docRef = doc(db, "Users", authUser.uid);
            const docSnap = await getDoc(docRef);
            // console.log("uid :>> ", authUser.uid);

            if (docSnap.exists()) {
              const userData = docSnap.data();
              const userPayload = {
                firstname: userData.firstname,
                lastname: userData.lastname,
                email: userData.email,
                rhuOrBarangay: userData.rhuOrBarangay,
                imageUrl: userData.imageUrl,
                barangay: userData.barangay,
                uid: authUser.uid,
                role: userData.role
              };
              // console.log("userPayload :>> ", userPayload);

              setUser(userPayload);
            } else {
              setUser(null);
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
            setUser(null);
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextProps => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
