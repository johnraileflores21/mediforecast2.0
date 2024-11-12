import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
interface HistoryLogParams {
  actionType: string;
  itemId?: string;
  itemName?: string;
  fullName?: string;
  barangay?: string;
  performedBy: string;
  remarks?: string;

  // extra for distribution 
  quantity?: string;
  address?: string;
  rhuOrBarangay?: string;
}

/**
 * Global function to log history actions in Firebase
 * @param {HistoryLogParams} params - The history log parameters
 * @returns {Promise<void>} - Returns a promise that resolves when the history is logged
 */
export async function createHistoryLog({
  actionType,
  itemId ,
  itemName,
  fullName,
  barangay,
  performedBy,
  remarks,
  quantity,
  address,
  rhuOrBarangay
}: HistoryLogParams): Promise<void> {
  if (!actionType || !performedBy) {
    throw new Error("actionType and performedBy a fields.");
  }

  let historyPayload = {
    actionType,
    itemId: itemId || null,
    itemName: itemName || null,
    fullName: fullName || null,
    barangay: barangay || null,
    performedBy,
    remarks: remarks || null,
    timestamp: new Date().toISOString(),
    quantity,
    address,
    rhuOrBarangay
  };

  if(quantity) historyPayload.quantity = quantity;
  else delete historyPayload.quantity

  if(address) historyPayload.address = address;
  else delete historyPayload.address

  if(rhuOrBarangay) historyPayload.rhuOrBarangay = rhuOrBarangay;
  else delete historyPayload.rhuOrBarangay

  try {
    await addDoc(collection(db, "History"), historyPayload);
    console.log("History log created successfully.");
  } catch (error) {
    console.error("Error creating history log:", error);
  }
}
