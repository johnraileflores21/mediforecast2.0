import { useState, useEffect } from "react";
import { IoMdNotifications, IoMdWarning } from "react-icons/io";
import { FaTruck, FaExclamationCircle } from "react-icons/fa"; // Import additional icons
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useUser } from "./User";
import notificationService from "../utils/notificationService";

interface Notification {
  id: string;
  action: string;
  itemName: string;
  description: string;
  performedBy: string;
  createdAt: any;
  status: 'read' | 'unread';
}

const NotificationModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useUser();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (user?.rhuOrBarangay) {
      const notificationsRef = collection(db, "Notifications");
      const q = query(
        notificationsRef,
        where("sentTo", "==", user.rhuOrBarangay)
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const notifData: Notification[] = [];
        querySnapshot.forEach((doc) => {
          notifData.push({
            id: doc.id,
            ...doc.data(),
          } as Notification);
        });
        notifData.sort(
          (a, b) => b.createdAt.seconds - a.createdAt.seconds
        );
        setNotifications(notifData);
      });

      return () => unsubscribe();
    }
  }, [user?.rhuOrBarangay]);

  const handleNotificationClick = async (notificationId: string) => {
    await notificationService.markAsRead(notificationId);
  };


  useEffect(() => {
    console.log("Notifications:", notifications);
  }, [notifications]);

  const actionIconMap: Record<string, JSX.Element> = {
    distribute: <FaTruck className="h-6 w-6 text-teal-600" />,
    outOfStock: <FaExclamationCircle className="h-6 w-6 text-red-600" />,
    alert: <IoMdWarning className="h-6 w-6 text-yellow-600" />,
    receive: <FaTruck className="h-6 w-6 text-teal-600" />,
  };

  const actionTitleMap: Record<string, string> = {
    distribute: "Distribution",
    outOfStock: "Stock Alert",
    alert: "Warning",
    receive: "Received",
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="relative z-10 block rounded-md focus:outline-none"
      >
        <IoMdNotifications className="h-7 w-7 text-white" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white text-teal-800 rounded-md shadow-lg overflow-hidden z-20">
          <div className="divide-y divide-gray-200 max-h-96 p-2 overflow-y-auto">
          {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification.id)}
                className={`flex p-2 m-2  rounded-lg hover:bg-gray-100 transition-colors duration-200 ${
                  notification.status === 'unread' ? 'bg-gray-200' : ''
                }`}
              >
                <div className="flex-shrink-0">
                  {actionIconMap[notification.action] || (
                    <IoMdNotifications className="h-6 w-6 text-teal-600" />
                  )}
                </div>
                <div className="w-full pl-3">
                  <div className={`font-semibold text-gray-900 text-sm ${
                    notification.status === 'unread' ? 'font-bold' : ''
                  }`}>
                    {actionTitleMap[notification.action] || "Notification"}
                  </div>
                  <div className={`text-gray-700 text-sm mb-1.5 ${
                    notification.status === 'unread' ? 'font-bold' : ''
                  }`}>
                    {notification.description}
                  </div>
                  <div className="text-xs text-blue-600">
                    {new Date(
                      notification.createdAt.seconds * 1000
                    ).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
            {notifications.length === 0 && (
              <div className="px-4 py-3 text-gray-500 text-sm text-center">
                No notifications
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationModal;