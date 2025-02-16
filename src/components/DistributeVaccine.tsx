import React, { useState, useEffect, ChangeEvent } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, doc, updateDoc, getDoc, setDoc, getDocs, query, where, addDoc } from "firebase/firestore";
import { IoMdClose } from "react-icons/io";
import { useUser } from "./User";
import Swal from "sweetalert2";
import { RHUs } from "../assets/common/constants";

import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import { MdDelete, MdExpandMore } from 'react-icons/md';
import { createHistoryLog }  from '../utils/historyService';
import { createDistribution } from '../utils/distributionService';
import { useConfirmation } from '../hooks/useConfirmation';


interface DistributeVaccineProps {
  showModal: boolean;
  closeModal: (bool: any) => void;
  data: any;
}

const DistributeVaccine: React.FC<DistributeVaccineProps> = ({
  showModal,
  closeModal,
  data,
}) => {
  const confirm = useConfirmation();

  const [vaccine, setVaccine] = useState<any | null>(null);
  const [barangay, setBarangay] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState(0);
  const [originalQuantity, setOriginalQuantity] = useState(0);

  const [forms, setForms] = useState<any>([]);
  const [expanded, setExpanded] = useState(0);
  const [activeTabs, setActiveTabs] = useState([0]);

  const isBarangay = user?.role.includes('Barangay');

  const filteredBarangays = (RHUs.find((x: any) => x['barangays'].includes(user?.barangay))?.barangays || []);

  useEffect(() => {
    if(data) {
      console.log('showModal :>> ', showModal);
      console.log("distribute :>> ", data);
      if(data) {
        setVaccine(data);
        setForms([{ ...data }]);
        setOriginalQuantity(data.vaccineStock);
        if(data?.vitaminStock <= 100) {
          const tab = activeTabs.map((tab: number) => {
            tab = 1;
            return tab;
          })
          console.log('tab :>> ', tab);
          setActiveTabs(tab);
        }
      }

    }
  }, [data]);

  if (!showModal || !vaccine) {
    return null;
  }

  const handleConfirmSubmit = async () => {
    try {
      setLoading(true);

      let totalQty = 0;
      let errorCounter = { count: 0, insufficient: false };
      let validForms = [];


      if(isBarangay) {
        totalQty = forms.reduce((prev: any, acc: any) => parseInt(prev) + parseInt(acc.totalPieces), 0);
      } else {
        totalQty = forms.reduce((prev: any, acc: any) => parseInt(prev) + parseInt(acc.vaccineStock), 0);
      }

      for(let i = 0; i < forms.length; i++) {

        let form = forms[i];

        const payload = {
          ...form,
          ...(isBarangay
            ? { totalPieces: Number(form.totalPieces) }
            : { vaccineStock: Number(form.vaccineStock) })
        };

        console.log('payload :>> ', payload);

        if(!isBarangay) {
          if((!payload.barangay && activeTabs[i] == 0) || ((!payload.fullName || !payload.address) && activeTabs[i] == 1)) {
            errorCounter.count += 1;
            break;
          } else if(totalQty > parseInt(vaccine.vaccineStock)) {
            errorCounter.count += 1;
            errorCounter.insufficient = true;
            break;
          } else if((activeTabs[i] == 0 && payload.barangay) || (activeTabs[i] == 1 && (payload.fullName && payload.address))) {
            validForms.push(payload);
          }
        } else {
          if(!payload.fullName || !payload.address) {
            errorCounter.count += 1;
            break;
          } else if(totalQty > parseInt(payload.totalPieces)) {
            errorCounter.count += 1;
            errorCounter.insufficient = true;
            break;
          }else {
            validForms.push(payload);
          }
        }

      }

      console.log('validForms :>> ', validForms);
      console.log('errorCounter :>> ', errorCounter);

      if(errorCounter.count > 0 && !errorCounter.insufficient) {
        return Swal.fire({
          position: "center",
          icon: "error",
          title: `Fill out required fields`,
          showConfirmButton: false,
          timer: 1000,
        });
      } else if(errorCounter.insufficient) {
        return Swal.fire({
          position: "center",
          icon: "error",
          title: `Insufficient Stock`,
          showConfirmButton: false,
          timer: 1000,
        });
      }

      if(validForms.length == forms.length) {
        for(let i = 0; i < validForms.length; i++) {

          const form = validForms[i];

          console.log('form :>> ', form);


          const payload = {
            ...form,
            ...(isBarangay
              ? { totalPieces: Number(form.totalPieces) }
              : { vaccineStock: Number(form.vaccineStock) })
          };


          const collectionName = isBarangay ? 'BarangayInventory' : 'Inventory';
          const itemDocRef = doc(db, collectionName, payload.id);
          const itemSnap = await getDoc(itemDocRef);

          if (!itemSnap.exists()) {
            throw new Error("Item not found");
          }

          const itemData = itemSnap.data();
          const currentStock = isBarangay ? itemData.totalPieces : itemData.vaccineStock;
          console.log('itemData :>> ', itemData);

          const requestedQuantity = isBarangay ? payload.totalPieces : payload.vaccineStock;

          if (requestedQuantity > currentStock) {
            throw new Error("Insufficient stock.");
          }

          // FUNCTION IF THE DISTRIBUTION IS FOR RESIDENT
          if (isBarangay || activeTabs[i] == 1) {
            // // Calculate the new stock value
            // const newStockResident = currentStock - payload.vaccineStock;

            // // Update the stock value in Firestore
            // await updateDoc(itemDocRef, {
            //   vaccineStock: newStockResident
            // });

            let newStock = 0
            if(isBarangay) {
              newStock = currentStock - payload.totalPieces;
              const piecesPerItem = parseInt(itemData.vaccinePiecesPerItem);
              const updatedVaccineStock = Math.floor(newStock / piecesPerItem);
              console.log('updatedVaccineStock :>> ', updatedVaccineStock);
              //updated medicine  stock

              await updateDoc(itemDocRef, {
                totalPieces: newStock,
                vaccineStock: updatedVaccineStock
              });
            } else {
              newStock = currentStock - payload.vaccineStock;
              await updateDoc(itemDocRef, {
                vaccineStock: newStock
              });
            }
            console.log(`Stock updated. New stock: ${newStock}`);

            await createDistribution({
              itemId: payload.id,
              quantity: isBarangay ? payload.totalPieces : payload.vaccineStock,
              distributeType: 'individual',
              distributedBy: user?.rhuOrBarangay || '',
              distributedTo: payload.fullName,
              isDistributed: true
            });
            await createHistoryLog({
              actionType: "distribute",
              itemId: payload.id,
              itemName: payload.vaccineName,
              fullName: payload.fullName,
              barangay: payload.barangay,
              performedBy: payload.userId,
              remarks: `Distributed ${payload.vaccineStock} units to ${payload.fullName}`,
            });

            Swal.fire({
              position: "center",
              icon: "success",
              title: `${payload.vaccineName} has been distributed to ${payload.fullName}`,
              showConfirmButton: false,
              timer: 1500,
            });

          } else {
            const userQuery = query(
              collection(db, "Users"),
              where("barangay", "==", payload.barangay)
            );

            const userSnap = await getDocs(userQuery);
            console.log("userSnap :>> ", userSnap);
            const userData = userSnap.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));
            console.log("userData :>> ", userData);
            const filteredUser = userData.filter((x: any) => x?.role.includes('Barangay'));
            if (filteredUser.length > 0) {
              // await updateDoc(itemDocRef, { vaccineStock: currentStock - payload.vaccineStock });

              const _user = filteredUser[0];

              const barangayInventoryRef = doc(db, "BarangayInventory", payload.id);
              const barangayInventorySnap = await getDoc(barangayInventoryRef);
              const existingData = barangayInventorySnap.data();

              const _currentStock = existingData?.vaccineStock || 0;
              const newStock = parseInt(payload.vaccineStock) + _currentStock;

              const pendingDistributionData = {
                ...itemData,
                vaccineStock: newStock,
                totalQuantity: (existingData?.totalQuantity + newStock) || newStock,
                pendingQuantity: payload.vaccineStock,
                created_at: new Date().toISOString(),
                userId: _user?.id,
                barangay: payload.barangay,
                totalPieces: newStock * payload.vaccinePiecesPerItem,
                status: 'pending',
                itemId: payload?.id
              };

              if('id' in pendingDistributionData) delete (pendingDistributionData as any).id;

              console.log('pendingDistributionData :>> ', pendingDistributionData);
              const barangayInventoryReff  =  await addDoc(collection(db, "BarangayInventory"), pendingDistributionData);
              const barangayInventoryId = barangayInventoryReff.id;


              await createDistribution({
                barangayInventoryId,
                itemId: payload.id,
                quantity: payload.vaccineStock,
                distributeType: 'barangay',
                distributedBy: user?.rhuOrBarangay || '',
                distributedTo: payload.barangay,
                isDistributed: false
              });

              await createHistoryLog({
                actionType: "pending-distribution",
                itemId: payload.id,
                itemName: payload.vaccineName,
                barangay: payload.barangay,
                performedBy: _user.id,
                remarks: `Pending distribution of ${payload.vaccineStock} units to ${payload.barangay}`,
              });

              Swal.fire({
                position: "center",
                icon: "success",
                title: `${payload.vaccineName} has been scheduled for distribution to ${payload.barangay}`,
                showConfirmButton: false,
                timer: 1500,
              });

            } else {
              Swal.fire({
                position: "center",
                icon: "error",
                title: `No existing user for ${payload.barangay}`,
                showConfirmButton: false,
                timer: 1000,
              });
            }
          }
        }
      }

    } catch(error: any) {
      console.error("Error distributing vaccine: ", error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: `Distribution error`,
        showConfirmButton: false,
        timer: 1000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    const isConfirmed = await confirm({
      title: 'Confirm Submission',
      message: 'Are you sure you want to distribute this vaccine?',
    });

    if (isConfirmed) {
      handleConfirmSubmit();
    }
  };


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleChange = (e: any, field: string) => {
    setVaccine({ ...vaccine, [field]: e.target.value });
    console.log("vaccine :>> ", { ...vaccine, [field]: e.target.value });
  };

  const handleAccordion = (index: any) => (event: any, isExpanded: any) => {
    setExpanded(isExpanded ? index : false);
  };

  const handleTabChange = (index: number, tabIndex: number) => {
    const newActiveTabs = [...activeTabs];
    newActiveTabs[index] = tabIndex;
    setActiveTabs(newActiveTabs);
  };

  const handleFormsChange = (e: any, field: string, index: number) => {
    const updatedForms = forms.map((form: any, i: number) => {
      if (i === index) {
        return {
          ...form,
          [field]: e.target.value
        };
      }
      return form;
    });

    setForms(updatedForms);
    console.log("Updated forms: ", updatedForms);
  };

  const addForm = () => {
    setForms([...forms, vaccine]);
    setActiveTabs([...activeTabs, data?.vaccineStock <= 100 ? 1 : 0]);
  }


  const deleteForm = (i: number, e: any) => {
    e.stopPropagation();
    const updatedForms = forms.filter((_: any, index: number) => index !== i);
    setForms(updatedForms);
  };


  return (
    <div
      className={`fixed z-10 inset-0 overflow-y-auto transition-all duration-500 ease-out ${
        showModal ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex items-center justify-center min-h-screen px-4 py-6 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-black bg-opacity-50"></div>
        <div
          className={`inline-block align-middle bg-white rounded-lg text-left max-h-[600px] overflow-y-auto shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full ${
            showModal ? "animate-slideDown" : "animate-slideUp"
          }`}
        >
          {/* Modal content */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <div className="flex flex-row justify-between items-center">
                  <div className="flex-1 text-center">
                    <h3
                      className="text-xl pb-2 leading-6 font-medium text-gray-900"
                      id="modal-headline"
                    >
                      <span>Distribute</span> {vaccine.vaccineName}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  type="button"
                  className="absolute top-3 right-3 rounded-md text-gray-700 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  <IoMdClose className="w-8 h-8 text-gray-400 hover:text-red-600" />
                </button>
                <div className="mt-2">


                  <div className="flex justify-end mb-4">
                    <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={addForm}>
                      Add
                    </button>
                  </div>

                  <form className="space-y-4">
                  {forms.map((_: any, index: number) => (
                      <Accordion key={index} expanded={expanded === index} onChange={handleAccordion(index)}>
                        <AccordionSummary
                          expandIcon={<MdExpandMore />}
                          aria-controls={`panel${index}-content`}
                          id={`panel${index}-header`}
                          sx={{
                            bgcolor: '#f0f0f0',
                            '&.Mui-expanded': { bgcolor: '#f0f0f0' },
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Typography>Distribution #{index + 1}</Typography>
                          {forms.length > 1 && <MdDelete
                            onClick={(e) => deleteForm(index, e)}
                            style={{
                              cursor: 'pointer',
                              marginLeft: '10px',
                              color: 'red',
                              order: 1,
                              position: 'absolute',
                              right: '40px',
                              marginTop: '3px',
                            }}
                          />}
                        </AccordionSummary>
                        <AccordionDetails>

                        {/* Tabs for Barangay and Resident */}
                        {!isBarangay && <div className="my-6">
                            <button disabled={data?.vaccineStock <= 100} type="button" onClick={() => handleTabChange(index, 0)} className={`px-4 py-2 ${activeTabs[index] === 0 ? "bg-gray-300" : "bg-gray-200"}`}>Barangay</button>
                            <button type="button" onClick={() => handleTabChange(index, 1)} className={`px-4 py-2 ${activeTabs[index] === 1 ? "bg-gray-300" : "bg-gray-200"}`}>Resident</button>
                          </div>}

                          {isBarangay ?
                            <div className="w-full">
                              <label
                                htmlFor="totalPieces"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Quantity
                              </label>
                              <input
                                type="number"
                                id="totalPieces"
                                value={forms[index].totalPieces}
                                onChange={(e) => handleFormsChange(e, 'totalPieces', index)}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                              />
                            </div> :
                            <div className="w-full">
                              <label
                                htmlFor="vaccineStock"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Quantity
                              </label>
                              <input
                                type="number"
                                id="vaccineStock"
                                value={forms[index].vaccineStock}
                                onChange={(e) => handleFormsChange(e, 'vaccineStock', index)}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                              />
                            </div>
                          }
                          <br/>

                          {!isBarangay && activeTabs[index] == 0 ? (
                            <div className="relative">
                              <label
                                htmlFor="barangay"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Where to Distribute
                              </label>
                              <div className="relative mt-1">
                                <select
                                  id="barangay"
                                  onChange={(e) => handleFormsChange(e, 'barangay', index)}
                                  className="block appearance-none w-full p-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:black focus:border-black sm:text-base"
                                >
                                  <option value="">Barangay</option>
                                  {filteredBarangays.map((brgy) => (
                                    <option key={brgy} value={brgy}>{brgy}</option>
                                  ))}
                                </select>
                                <svg
                                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  aria-hidden="true"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="relative">
                                <label
                                  htmlFor="address"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Full Name
                                </label>
                                <div className="relative mt-1">
                                  <input
                                    type="text"
                                    id="address"
                                    value={forms[index].fullName}
                                    onChange={(e) => handleFormsChange(e, 'fullName', index)}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md ml-1"
                                  />
                                </div>
                              </div>
                              <div className="relative mt-4">
                                <label
                                  htmlFor="address"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Full Address
                                </label>
                                <div className="relative mt-1">
                                  <input
                                    type="text"
                                    id="address"
                                    value={forms[index].address}
                                    onChange={(e) => handleFormsChange(e, 'address', index)}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md ml-1"
                                  />
                                </div>
                              </div>
                            </div>
                          )}


                        </AccordionDetails>
                      </Accordion>
                    ))}



                    <div className="flex flex-row">
                      <div className="w-full">
                        <label
                          htmlFor="vaccineName"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Brand Name
                        </label>
                        <input
                          type="text"
                          id="vaccineName"
                          value={vaccine.vaccineName}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                          disabled
                        />
                      </div>

                      <div className="w-full">
                        <label
                          htmlFor="vaccineBatchNo"
                          className="block text-sm font-medium text-gray-700 ml-1"
                        >
                          Batch No.
                        </label>
                        <input
                          type="text"
                          id="vaccineBatchNo"
                          value={vaccine.vaccineBatchNo}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md ml-1"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="flex flex-row">
                      {isBarangay ?
                        <div className="w-full">
                          <label
                            htmlFor="totalPieces"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Quantity
                          </label>
                          <input
                            type="number"
                            id="totalPieces"
                            value={vaccine.totalPieces}
                            onChange={(e) => handleChange(e, 'totalPieces')}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            disabled
                          />
                        </div> :
                        <div className="w-full">
                          <label
                            htmlFor="vitaminStock"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Quantity
                          </label>
                          <input
                            type="number"
                            id="vitaminStock"
                            value={vaccine.vaccineStock}
                            onChange={(e) => handleChange(e, 'vitaminStock')}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            disabled
                          />
                        </div>
                      }

                      <div className="w-full">
                        <label
                          htmlFor="vaccineDosageForm"
                          className="block text-sm font-medium text-gray-700 ml-1"
                        >
                          Dosage Form
                        </label>
                        <input
                          type="text"
                          id="vaccineDosageForm"
                          value={vaccine.vaccineDosageForm}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md ml-1"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="flex flex-row">
                    </div>

                    <div className="flex flex-row">
                      <div className="w-full">
                        <label
                          htmlFor="vaccineExpiration"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Expiration Date
                        </label>
                        <input
                          type="text"
                          id="vaccineExpiration"
                          value={formatDate(vaccine.vaccineExpiration)}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                          disabled
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="vaccineDescription"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Description
                      </label>
                      <textarea
                        id="vaccineDescription"
                        value={vaccine.vaccineDescription}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        rows={4}
                        disabled
                      />
                    </div>

                    <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse w-full">
                      <button
                        disabled={loading}
                        type="button"
                        onClick={handleSubmit}
                        className={`${loading && 'opacity-[0.5]'} w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm`}
                      >
                        Submit
                      </button>
                      <button
                        onClick={closeModal}
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistributeVaccine;
