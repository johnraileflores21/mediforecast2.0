import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

interface DistributionsProps {
    barangayInventoryId?: string;
    itemId: string;
    quantity: number;
    distributeType: 'barangay'  | 'individual';
    distributedBy: string; // rhuIdOrBarangay
    distributedTo?: string; // barangaay name or full name
    isDistributed?: boolean;
    created_at?: string;
}

export async function createDistribution({
    barangayInventoryId,
    itemId,
    quantity,
    distributeType,
    distributedBy,
    distributedTo,
    isDistributed,
}: DistributionsProps): Promise<void> {
    if(!distributeType || !distributedBy) {
        throw new Error("distributeType and distributedBy are required fields.");
    }

    const distributionPayload = {
        barangayInventoryId: barangayInventoryId || null,
        itemId,
        quantity,
        distributeType,
        distributedBy: distributedBy || null,
        distributedTo: distributedTo || null,
        isDistributed: isDistributed || false,
        created_at: new Date().toISOString(),
    }

    try{
        await addDoc(collection(db, "Distributions"), distributionPayload);
        console.log("Distribution log created successfully.");
    }catch(error) {
        console.error("Error creating distribution log:", error);
    }

}


// distributedBy: rhuId or userId