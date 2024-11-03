
import React from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { distributionsData } from "../data/distributions";

const InsertDistributionsButton: React.FC = () => {
  const handleInsert = async () => {
    try {
      const distributionsCollection = collection(db, "Distributions");

      for (const distribution of distributionsData) {
        await addDoc(distributionsCollection, distribution);
        console.log(`Inserted distribution: ${distribution.distributedTo || distribution.barangayInventoryId}`);
      }

      alert("All distributions inserted successfully.");
    } catch (error) {
      console.error("Error inserting distributions:", error);
      alert("Error inserting distributions. Check console for details.");
    }
  };

  return (
    <button onClick={handleInsert}>
      Insert Distributions Data
    </button>
  );
};

export default InsertDistributionsButton;
