// PrivateRouteAdmin.tsx
import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import PulseLoader from "react-spinners/PulseLoader";

const PrivateRouteAdmin: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, "SuperAdmin", user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setIsAdmin(userData.isAdmin || false);
          } else {
            setIsAdmin(false);
          }
        } catch (error) {
          console.error("Error Fetching Data", error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-10 flex items-center justify-center bg-white bg-opacity-75">
        <div className="text-center">
          <h1 className="text-4xl mb-4 text-gray-800">Loading...</h1>
          <PulseLoader
            color={"#007f80"}
            loading={loading}
            size={20}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/administrator" state={{ from: location }} replace />;
  }

  // Use <Outlet /> to render child routes
  return <Outlet />;
};

export default PrivateRouteAdmin;
