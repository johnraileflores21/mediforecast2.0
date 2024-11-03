// src/listeners/InventoryListener.tsx
import { useEffect } from "react";
import { collection, query, where, onSnapshot, DocumentData } from "firebase/firestore";
import { db } from "../firebase"; // Adjust the import path
import { useUser } from "../components/User";
import notificationService from "../utils/notificationService";

const InventoryListener = () => {
  const { user } = useUser();
  const isBarangay = user?.role.includes("Barangay");

  useEffect(() => {
    console.log("Inventory Listener started.");
    if (!user) return;

    const collectionName = isBarangay ? "BarangayInventory" : "Inventory";
    const inventoryRef = collection(db, collectionName);
    // const inventoryQuery = query(
    //   inventoryRef,
    //   // where("created_by_unit", "==", user.rhuOrBarangay || "")
    // );

    const unsubscribe = onSnapshot(inventoryRef, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const data = change.doc.data() as DocumentData;
        const id = change.doc.id;

        if (change.type === "modified") {
          console.log("Listener Inventory modified:", id, data);
          console.log('Listener isBarangay:', isBarangay);
          if (isBarangay) {
            const totalPieces = data.totalPieces || 0;
            console.log("Listener Barangay Inventory Stock:", totalPieces);
            console.log('user.rhuOrBarangay:', user.rhuOrBarangay);

            if (totalPieces === 0) {
              notificationService.createNotification({
                action: "outOfStock",
                itemId: id,
                itemName: data.medicineBrandName || data.vaccineName || data.vitaminName || "Item",
                itemType: data.type || "Item",
                quantity: totalPieces,
                description: `${data.medicineBrandName || data.vaccineName || data.vitaminName || "Item"} is out of stock.`,
                performedBy: "",
                sentBy: "",
                sentTo: user.rhuOrBarangay || "",
              });

              console.log("Barangay Item is out of stock.");
            } else if (totalPieces < 50) {
              notificationService.createNotification({
                action: "alert",
                itemId: id,
                itemName: data.medicineBrandName || data.vaccineName || data.vitaminName || "Item",
                itemType: data.type || "Item",
                quantity: totalPieces,
                description: `${data.medicineBrandName || data.vaccineName || data.vitaminName || "Item"} is out of stock.`,
                performedBy: "",
                sentBy: "",
                sentTo: user.rhuOrBarangay || "",
              });
              console.log("Barangay Stock is below 50.");
            }
          } else {
            const stockFields = ["medicineStock", "vaccineStock", "vitaminStock"];
            let stock = 0;

            for (const field of stockFields) {
              if (data[field] !== undefined) {
                stock = data[field];
                break;
              }
            }
            console.log("Listener Inventory Stock:", stock);
            if (stock === 0) {
              notificationService.createNotification({
                action: "outOfStock",
                itemId: id,
                itemName: data.medicineBrandName || data.vaccineName || data.vitaminName || "Item",
                itemType: data.type || "Item",
                quantity: stock,
                description: `${data.medicineBrandName || data.vaccineName || data.vitaminName || "Item"} is out of stock.`,
                performedBy: "",
                sentBy: "",
                sentTo: "",
              });
              console.log("Item is out of stock.");
            } else if (stock < 10) {
              notificationService.createNotification({
                action: "alert",
                itemId: id,
                itemName: data.medicineBrandName || data.vaccineName || data.vitaminName || "Item",
                itemType: data.type || "Item",
                quantity: stock,
                description: `${data.medicineBrandName || data.vaccineName || data.vitaminName || "Item"} stock is below 10.`,
                performedBy: "",
                sentBy: "",
                sentTo: user.rhuOrBarangay || "",
              });
              console.log("Stock is below 10.");
            }
          }
        }
      });
    });

    return () => unsubscribe();
  }, [user, isBarangay]);

  return null;
};

export default InventoryListener;