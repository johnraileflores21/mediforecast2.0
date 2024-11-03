import React, { useState, useEffect } from "react";
import DashboardLayout from "../DashboardLayout";

import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { MdInventory } from "react-icons/md";
import { FaQuestionCircle } from "react-icons/fa";
import { FaFileShield } from "react-icons/fa6";

import { collection, doc, getDoc, getDocs, query, where, onSnapshot } from "firebase/firestore";

import { auth, db } from "../../firebase";
import { useUser } from "../User";
import { getTypes, RHUs } from "../../assets/common/constants";

import LineChart from "./LineChart";
import CountCard from "./CountCard";
import PieChart from "./PieChart";
import InsertDistributionsButton from "../InsertDistributionsButton";

interface UserDetails {
  firstname: string;
  lastname: string;
  email: string;
  rhuOrBarangay: string;
  imageUrl: string;
  barangay: string;
  uid: string;
  role: string
}
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, setUser } = useUser();

  const isBarangay = user?.role.includes("Barangay");
  // console.log('isBarangay :>>', isBarangay);

  const [distributions, setDistributions] = useState<any[]>([]);
  const [inventoryCount, setInventoryCount] = useState<number>(0);
  const [inventoryList, setInventoryList] = useState<any[]>([]);
  const [requestsCount, setRequestsCount] = useState<number>(0);
  const [itrRecordsCount, setItrRecordsCount] = useState<number>(0);
//   const [distributionsLoading, setDistributionsLoading] = useState<boolean>(true);
//   const [distributionsError, setDistributionsError] = useState<string | null>(null);


  useEffect(() => {
    const fetchData = async () => {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          try {
            const docRef = doc(db, "Users", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              const data = docSnap.data() as UserDetails;
              setUser({
                firstname: data.firstname,
                lastname: data.lastname,
                email: data.email,
                rhuOrBarangay: data.rhuOrBarangay,
                imageUrl: data.imageUrl,
                barangay: data.barangay,
                uid: user.uid,
                role: data.role,
              });
            } else {
              setError("No user details found.");
            }
          } catch (error) {
            console.error("Error fetching user details:", error);
          } finally {
            setLoading(false);
          }
        } else {
          setError("No user is signed in.");
          setLoading(false);
        }
      });
    };

    fetchData();
  }, [setUser]);

  useEffect(() => {
    const fetchDistributions = async () => {
      try {
        console.log('user?.rhuOrBarangay :>>', user?.rhuOrBarangay);
        const distributionQuery = query(
          collection(db, "Distributions"),
          where("distributedBy", "==", user?.rhuOrBarangay),
          where("isDistributed", "==", true)
        );
        // const distributionsCol = collection(db, "Distributions");
        const distributionsSnapshot = await getDocs(distributionQuery);
        const distributionsList: any[] = distributionsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        setDistributions(distributionsList);
      } catch (error) {
        console.error("Error fetching distributions:", error);
        // setDistributionsError("Failed to fetch distributions data.");
      } finally {
        // setDistributionsLoading(false);
      }
    };
    const fetchCounts = async () => {
        try {
          // Fetch Inventory count

          const unit = RHUs.findIndex((x: any) => x['barangays'].includes(user?.barangay)) + 1;
          // console.log('unit :>> ', unit);
          const inventoryCollection = isBarangay ? "BarangayInventory" : "Inventory";
          const inventoryQueries = [
            where("created_by_unit", "==", isBarangay ? unit.toString() : user?.rhuOrBarangay),
            ...(isBarangay ? [where("status", "==", "approved")] : [])
          ];

          const inventoryQuery = query(
            collection(db, inventoryCollection),
            ...inventoryQueries
          );

          const inventorySnapshot = await getDocs(inventoryQuery);
          setInventoryCount(inventorySnapshot.size);

          // Fetch the inventory
          const inventoryList: any[] =  inventorySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          setInventoryList(inventoryList);

          // Fetch Requests count
          const requestQuery =  query(
            collection(db, "Requests"),
            where(isBarangay ? "userId" : "rhuId", "==", user?.uid)
          );
          const requestsSnapshot = await getDocs(requestQuery);
          setRequestsCount(requestsSnapshot.size);


          // Fetch Individual Treatment Records count
          const itrRecordsSnapshot = await getDocs(
            collection(db, "IndividualTreatmentRecord")
          );
          setItrRecordsCount(itrRecordsSnapshot.size);
        } catch (error) {
          console.error("Error fetching counts:", error);
        }
      };

    fetchDistributions()
    fetchCounts();
  }, []);

  useEffect(() => {
    console.log('distributions data :>>', distributions.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()));
    // console.log('inventoryCount :>>', inventoryCount);
    // console.log('requestsCount :>>', requestsCount);
    // console.log('itrRecordsCount :>>', itrRecordsCount);
    // console.log('inventoryList :>>', inventoryList);
  }, [distributions, inventoryCount, requestsCount, itrRecordsCount]);


  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-4">Welcome to the Dashboard</h1>
      {/* <InsertDistributionsButton /> */}
      {/* COUNT CARDS */}
      <div className="xl:grid xl:grid-cols-3 gap-4">
      <CountCard
          title="INVENTORY"
          count={inventoryCount}
          icon={MdInventory}
          backgroundColor="#6C63FF"
        />
        <CountCard
          title="REQUEST"
          count={requestsCount}
          icon={FaQuestionCircle}
          backgroundColor="#00C49A"
        />
        <CountCard
          title="ITR RECORDS"
          count={itrRecordsCount}
          icon={FaFileShield}
          backgroundColor="#FF6384"
        />
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Data Visualization</h2>
        <div className="bg-white p-4 rounded-lg shadow-md flex justify-between">
          <div className="w-1/3 p-2">
            <PieChart data={inventoryList} size={10} limit={50}/>
          </div>
          <div className="w-1/2 flex justify-center items-center">
            <LineChart distributions={distributions} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
