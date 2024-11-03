import { useState } from "react";
import { IoMdNotifications, IoMdMenu } from "react-icons/io";
import { useUser } from "./User";
import NotificationModal from "./NotificationModal";

const TopBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const rhuOrBarangayMap: Record<string, string> = {
    "1": "Rural Health Unit I",
    "2": "Rural Health Unit II",
    "3": "Rural Health Unit III",
    Balucuc: "Balucuc Health Center",
    Calantipe: "Calantipe Health Center",
    Capalangan: "Capalangan Health Center",
    Colgante: "Colgante Health Center",
    Paligui: "Paligui Health Center",
    Sampaloc: "Sampaloc Health Center",
    "San Juan": "San Juan Health Center",
    "San Vicente": "San Vicente Health Center",
    Sucad: "Sucad Health Center",
    Sulipan: "Sulipan Health Center",
    Tabuyuc: "Tabuyuc Health Center",
  };
  const rhuOrBarangayName =
    user?.rhuOrBarangay && rhuOrBarangayMap[user.rhuOrBarangay]
      ? rhuOrBarangayMap[user.rhuOrBarangay]
      : "Unknown";
  return (
    <div className="bg-teal-600 text-white p-2.5 shadow-md flex justify-between items-center relative">
      <h1 className="text-3xl font-extrabold xl:ml-[30%]">
        {rhuOrBarangayName}
      </h1>
      <NotificationModal />
    </div>
  );
};

export default TopBar;
