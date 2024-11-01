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

import { collection, doc, getDoc, getDocs } from "firebase/firestore";

import { auth, db } from "../../firebase";
import { useUser } from "../User";

import LineChart from "./LineChart";
import CountCard from "./CountCard";
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

  const [distributions, setDistributions] = useState<any[]>([]);
  const [inventoryCount, setInventoryCount] = useState<number>(0);
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
        const distributionsCol = collection(db, "Distributions");
        const distributionsSnapshot = await getDocs(distributionsCol);
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
          const inventorySnapshot = await getDocs(collection(db, "Inventory"));
          setInventoryCount(inventorySnapshot.size);

          // Fetch Requests count
          const requestsSnapshot = await getDocs(collection(db, "Requests"));
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
    console.log('inventoryCount :>>', inventoryCount);
    console.log('requestsCount :>>', requestsCount);
    console.log('itrRecordsCount :>>', itrRecordsCount);
  }, [distributions, inventoryCount, requestsCount, itrRecordsCount]);

  const pieData = {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [
      {
        label: "# of Votes",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Chart.js Pie Chart",
      },
    },
  };

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
            <Pie data={pieData} options={pieOptions} />
          </div>
          <div className="w-1/2 flex justify-center items-center">
            {/* <Line data={lineData} options={lineOptions} /> */}
            <LineChart distributions={distributions} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
