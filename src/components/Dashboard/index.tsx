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

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

import { auth, db } from "../../firebase";
import { useUser } from "../User";
import {
  generateRandomColor,
  getTypes,
  RHUs,
} from "../../assets/common/constants";

import LineChart from "./LineChart";
import CountCard from "./CountCard";
import PieChart from "./PieChart";
import InsertDistributionsButton from "../InsertDistributionsButton";
import BarChart from "./BarChart";

interface UserDetails {
  firstname: string;
  middlename: string;
  lastname: string;
  email: string;
  rhuOrBarangay: string;
  dateOfBirth: string;
  imageUrl: string;
  gender: string;
  phone: string;
  barangay: string;
  uid: string;
  role: string;
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

  const [distributions, setDistributions] = useState<any[]>([]);
  const [inventoryCount, setInventoryCount] = useState<number>(0);
  const [inventoryList, setInventoryList] = useState<any[]>([]);
  const [dataForBarGraph, setDataForBarGraph] = useState<any>({});
  const [requestsCount, setRequestsCount] = useState<number>(0);
  const [itrRecordsCount, setItrRecordsCount] = useState<number>(0);

  const unit =
          RHUs.findIndex((x: any) => x["barangays"].includes(user?.barangay)) +
          1;

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
                middlename: data.middlename,
                lastname: data.lastname,
                email: data.email,
                rhuOrBarangay: data.rhuOrBarangay,
                imageUrl: data.imageUrl,
                barangay: data.barangay,
                dateOfBirth: data.dateOfBirth,
                phone: data.phone,
                uid: user.uid,
                role: data.role,
                gender: data.gender,
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
        const distributionQuery = query(
          collection(db, "Distributions"),
          where("distributedBy", "==", user?.rhuOrBarangay),
          where("isDistributed", "==", true)
        );
        const distributionsSnapshot = await getDocs(distributionQuery);
        const distributionsList: any[] = distributionsSnapshot.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data(),
          })
        );

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
        const inventoryCollection = isBarangay
          ? "BarangayInventory"
          : "Inventory";
        const inventoryQueries = [
          where(
            isBarangay ? "barangay" : "created_by_unit",
            "==",
            isBarangay ? user?.barangay : unit?.toString()
          ),
          // ...(isBarangay ? [where("status", "==", "approved")] : [])
        ];

        const inventoryQuery = query(
          collection(db, inventoryCollection),
          ...inventoryQueries
        );

        const inventorySnapshot = await getDocs(inventoryQuery);

        // Fetch the inventory
        const inventoryList: any[] = inventorySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((x: any) => !x.status || x.status == 'approved');

        setInventoryCount(inventoryList.length);
        setInventoryList(inventoryList);

        const requestQuery = query(
          collection(db, "Requests"),
          where(isBarangay ? "userId" : "rhuId", "==", user?.uid)
        );
        const requestsSnapshot = await getDocs(requestQuery);
        setRequestsCount(requestsSnapshot.size);

        const itrRecordsQuery = query(
          collection(db, "IndividualTreatmentRecord"),
          where("rhuOrBarangay", "==", user?.rhuOrBarangay)
        );

        const itrRecordsSnapshot = await getDocs(itrRecordsQuery);
        setItrRecordsCount(itrRecordsSnapshot.size);
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchDistributions();
    fetchCounts();
  }, []);

  useEffect(() => {
    // console.log('distributions data :>>', distributions.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()));
  }, [distributions, inventoryCount, requestsCount, itrRecordsCount]);

  // for bar graph
  useEffect(() => {
    const fetchDataForBarGraph = async () => {
      try {
        let q = {
          clause: isBarangay ? "barangay" : "created_by_unit",
          val: isBarangay ? user?.barangay : unit?.toString(),
        };

        const inventoryQueries = [where(q.clause, "==", q.val)];

        const inventoryQuery = query(
          collection(db, "BarangayInventory"),
          ...inventoryQueries
        );

        const inventorySnapshot = await getDocs(inventoryQuery);

        let _list: any[] = inventorySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((data: any) => !data.status || data.status == 'approved');

        const barangayData: any = {};
        let userList: any = [];

        const userRef = collection(db, "Users");
        const _q = query(userRef, where("acc_status", "==", "approved"));
        const querySnapshot = await getDocs(_q);

        if (!querySnapshot.empty) {
          userList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        }

        console.log("_list :>> ", _list);

        const mappedList = _list.map(l => ({ name: l[`${getTypes(l)}BrandName`], stock: l[`${getTypes(l)}Stock`], id: l.id }))
          .filter(l => l.name);

        console.log('mappedList :>> ', mappedList);

        _list.forEach((item: any) => {
          const stockType = getTypes(item);
          const stock = item[`${stockType}Stock`] || 0;
          const itemName = item[`${stockType}BrandName`];
          const userId = item.userId;

          if(itemName) {
            const user = userList.find((user: any) => user.id === userId);
            const barangay = user ? user.barangay : "Unknown Barangay";

            console.log("user :>> ", user);

            const key = isBarangay ? itemName : barangay;

            if (!barangayData[key]) {
              barangayData[key] = [];
            }

            barangayData[key].push({ itemName, stock });
          }
        });

        Object.keys(barangayData).forEach((key) => {
          barangayData[key].sort((a: any, b: any) => a.stock - b.stock);
          barangayData[key] = barangayData[key].slice(0, 4);
        });

        const chartLabels: string[] = [];

        Object.keys(barangayData).forEach((key) => {
          barangayData[key].forEach((item: any) => {
            if (!chartLabels.includes(item.itemName)) {
              chartLabels.push(item.itemName);
            }
          });
        });

        const seriesData = chartLabels.map((label) => {
          return {
            label,
            data: Object.keys(barangayData).map((key) => {
              const item = barangayData[key].find(
                (i: any) => i.itemName === label
              );
              return item ? item.stock : 0;
            }),
          };
        });

        const _s = seriesData.map((dataset: any, idx: number) => ({
          type: "bar",
          xKey: "barangay",
          yKey: `item${idx + 1}`,
          yName: dataset.label,
          backgroundColor: generateRandomColor(),
          borderColor: generateRandomColor(),
          borderWidth: 1,
        }));

        let _d = Object.keys(barangayData).map((barangay) => {
          const data: { [key: string]: any } = { barangay };

          if (isBarangay) {
            const aggregatedItems = barangayData[barangay].reduce(
              (acc: any, item: any) => {
                if (!acc[item.itemName]) {
                  acc[item.itemName] = { itemName: item.itemName, stock: 0 };
                }
                acc[item.itemName].stock += item.stock;
                return acc;
              },
              {}
            );

            Object.values(aggregatedItems).forEach((item: any) => {
              const key = _s.find((x) => x.yName === item.itemName);
              if (key) data[key.yKey] = item.stock;
            });
          } else
            barangayData[barangay].forEach((item: any, idx: number) => {
              data[`item${idx + 1}`] = item.stock;
            });

          return data;
        });

        const chartOptions = {
          title: {
            text: isBarangay
              ? `Top Low-stock Items in ${user?.barangay}`
              : "Barangays Top Low-stock Items",
          },
          subtitle: {
            text: isBarangay
              ? "Stock quantity by Item"
              : "Stock quantity by Barangay",
          },
          data: _d,
          series: _s,
          axes: [
            {
              type: "category",
              position: "bottom",
              title: {
                text: isBarangay ? "Item Name" : "Barangay",
              },
            },
            {
              type: "number",
              position: "left",
              title: {
                text: "Stock Quantity",
              },
            },
          ],
          legend: {
            position: "top",
          },
          tooltip: {
            renderer: (params: any) => {
              return {
                content: `${params.xValue}: ${params.yValue} units`,
              };
            },
          },
        };

        setDataForBarGraph(chartOptions);
      } catch (error) {
        console.log("error :>> ", error);
      }
    };

    fetchDataForBarGraph();
  }, [isBarangay, user?.barangay, user?.uid, user?.rhuOrBarangay]);

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
          path="/inventory"
        />
        <CountCard
          title="REQUEST"
          count={requestsCount}
          icon={FaQuestionCircle}
          backgroundColor="#00C49A"
          path="/request"
        />
        <CountCard
          title="ITR RECORDS"
          count={itrRecordsCount}
          icon={FaFileShield}
          backgroundColor="#FF6384"
          path="/individual-treatment-record"
        />
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Data Visualization</h2>
        <div className="bg-white p-4 rounded-lg shadow-md">
          {/* Container for the PieChart and LineChart */}
          <div className="flex justify-between mb-4">
            {!isBarangay && (
              <div className="w-1/2 p-2">
                <PieChart data={inventoryList} size={10} limit={100} />
              </div>
            )}
            <div className="w-full h-1/2 flex justify-center items-center">
              <LineChart distributions={distributions} />
            </div>
          </div>

          <div className="w-full p-2">
            {dataForBarGraph && <BarChart options={dataForBarGraph} />}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
