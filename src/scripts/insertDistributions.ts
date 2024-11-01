
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { distributionsData } from "../data/distributions";


const insertDistributions = async () => {
  try {
    const distributionsCollection = collection(db, "Distributions");

    for (const distribution of distributionsData) {
      await addDoc(distributionsCollection, distribution);
      console.log(`Inserted distribution: ${distribution.distributedTo || distribution.barangayInventoryId}`);
    }

    console.log("All distributions inserted successfully.");
  } catch (error) {
    console.error("Error inserting distributions:", error);
  }
};

// Execute the function
insertDistributions();
