// import React, { useState, useEffect } from "react";
// import DashboardLayout from "./DashboardLayout";

// import { Line, Pie } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement,
// } from "chart.js";
// import { MdInventory } from "react-icons/md";
// import { FaQuestionCircle } from "react-icons/fa";
// import { FaFileShield } from "react-icons/fa6";
// import { auth, db } from "../firebase";
// import { useUser } from "./User";
// import { collection, doc, getDoc, getDocs } from "firebase/firestore";
// import InsertDistributionsButton from "./InsertDistributionsButton";

// interface UserDetails {
//   firstname: string;
//   lastname: string;
//   email: string;
//   rhuOrBarangay: string;
//   imageUrl: string;
//   barangay: string;
//   uid: string;
//   role: string
// }
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement
// );

// const Dashboard: React.FC = () => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const { user, setUser } = useUser();

//   const [distributions, setDistributions] = useState<any[]>([]);
//   const [distributionsLoading, setDistributionsLoading] = useState<boolean>(true);
//   const [distributionsError, setDistributionsError] = useState<string | null>(null);


//   useEffect(() => {
//     const fetchData = async () => {
//       auth.onAuthStateChanged(async (user) => {
//         if (user) {
//           try {
//             const docRef = doc(db, "Users", user.uid);
//             const docSnap = await getDoc(docRef);
//             if (docSnap.exists()) {
//               const data = docSnap.data() as UserDetails;
//               setUser({
//                 firstname: data.firstname,
//                 lastname: data.lastname,
//                 email: data.email,
//                 rhuOrBarangay: data.rhuOrBarangay,
//                 imageUrl: data.imageUrl,
//                 barangay: data.barangay,
//                 uid: user.uid,
//                 role: data.role,
//               });
//             } else {
//               setError("No user details found.");
//             }
//           } catch (error) {
//             console.error("Error fetching user details:", error);
//           } finally {
//             setLoading(false);
//           }
//         } else {
//           setError("No user is signed in.");
//           setLoading(false);
//         }
//       });
//     };

//     fetchData();
//   }, [setUser]);

//   useEffect(() => {
//     const fetchDistributions = async () => {
//       try {
//         const distributionsCol = collection(db, "Distributions");
//         const distributionsSnapshot = await getDocs(distributionsCol);
//         const distributionsList: any[] = distributionsSnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }))

//         setDistributions(distributionsList);
//       } catch (error) {
//         console.error("Error fetching distributions:", error);
//         setDistributionsError("Failed to fetch distributions data.");
//       } finally {
//         setDistributionsLoading(false);
//       }
//     };

//     fetchDistributions();
//     console.log('distributions data :>>', distributions);
//   }, []);

//   const lineData = {
//     labels: ["January", "February", "March", "April", "May", "June", "July"],
//     datasets: [
//       {
//         label: "Dataset 1",
//         data: [65, 57, 80, 81, 56, 55, 40],
//         fill: false,
//         backgroundColor: "rgba(75,192,192,0.2)",
//         borderColor: "rgba(75,192,192,1)",
//       },
//     ],
//   };

//   const lineOptions = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: "top" as const,
//       },
//       title: {
//         display: true,
//         text: "Chart.js Line Chart",
//       },
//     },
//   };

//   const pieData = {
//     labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
//     datasets: [
//       {
//         label: "# of Votes",
//         data: [12, 19, 3, 5, 2, 3],
//         backgroundColor: [
//           "rgba(255, 99, 132, 0.2)",
//           "rgba(54, 162, 235, 0.2)",
//           "rgba(255, 206, 86, 0.2)",
//           "rgba(75, 192, 192, 0.2)",
//           "rgba(153, 102, 255, 0.2)",
//           "rgba(255, 159, 64, 0.2)",
//         ],
//         borderColor: [
//           "rgba(255, 99, 132, 1)",
//           "rgba(54, 162, 235, 1)",
//           "rgba(255, 206, 86, 1)",
//           "rgba(75, 192, 192, 1)",
//           "rgba(153, 102, 255, 1)",
//           "rgba(255, 159, 64, 1)",
//         ],
//         borderWidth: 1,
//       },
//     ],
//   };

//   const pieOptions = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: "top" as const,
//       },
//       title: {
//         display: true,
//         text: "Chart.js Pie Chart",
//       },
//     },
//   };

//   return (
//     <DashboardLayout>
//       <h1 className="text-3xl font-bold mb-4">Welcome to the Dashboard</h1>
//       {/* <InsertDistributionsButton /> */}
//       {/* COUNT CARDS */}
//       <div className="xl:grid xl:grid-cols-3 gap-4">
//         <div className="w-full h-36 rounded-lg bg-customPurple p-6 shadow-md dark:bg-neutral-700 mb-4">
//           <div className="flex justify-between">
//             <h1 className="text-xl font-bold text-white mt-1 dark:text-neutral-200">
//               INVENTORY
//             </h1>
//             <MdInventory className="w-8 h-8 text-white" />
//           </div>
//           <h1 className="text-4xl font-bold text-white mt-7">1,024</h1>
//         </div>
//         <div className="w-full h-36 rounded-lg bg-customGreen p-6 shadow-md dark:bg-neutral-700 mb-4">
//           <div className="flex justify-between">
//             <h1 className="text-xl font-bold text-white mt-1 dark:text-neutral-200">
//               REQUEST
//             </h1>
//             <FaQuestionCircle className="w-8 h-8 text-white" />
//           </div>
//           <h1 className="text-4xl font-bold text-white mt-7">5</h1>
//         </div>
//         <div className="w-full h-36 rounded-lg bg-customPink p-6 shadow-md dark:bg-neutral-700 mb-4">
//           <div className="flex justify-between">
//             <h1 className="text-xl font-bold text-white mt-1 dark:text-neutral-200">
//               ITR RECORDS
//             </h1>
//             <FaFileShield className="w-8 h-8 text-white" />
//           </div>
//           <h1 className="text-4xl font-bold text-white mt-7">2,149</h1>
//         </div>
//       </div>
//       <div className="mt-8">
//         <h2 className="text-xl font-bold mb-4">Data Visualization</h2>
//         <div className="bg-white p-4 rounded-lg shadow-md flex justify-between">
//           <div className="w-1/3 p-2">
//             <Pie data={pieData} options={pieOptions} />
//           </div>
//           <div className="w-1/2 flex justify-center items-center">
//             <Line data={lineData} options={lineOptions} />
//           </div>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default Dashboard;
