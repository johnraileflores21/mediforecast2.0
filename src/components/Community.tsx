import React, { useState, useEffect } from "react";
import DashboardLayout from "./DashboardLayout";
import { collection } from "firebase/firestore";
import { AiFillLike } from "react-icons/ai";
import ModalPost from "./Post";
import { onSnapshot } from "firebase/firestore";
import { db, storage } from "../firebase";
import { useUser } from "./User";
import { MdEdit, MdDelete } from "react-icons/md";
import { doc, deleteDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import EditPost from "./EditPost";
import ScrollToTop from "./ScrollToTop";

interface CommunityPost {
  id: string;
  created_by: string;
  postMessage: string;
  postImg?: string;
  fileType?: string; // Add fileType to store media type
}

const Community = () => {
  const [items, setItems] = useState<CommunityPost[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const { user } = useUser();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState<CommunityPost | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [collapse, setCollapse] = useState(false);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

  const handleShowModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const toggleDropdown = (id: string) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    };
    return date.toLocaleString(undefined, options);
  };

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "CommunityPost"), (snapshot) => {
      const itemsData: CommunityPost[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<CommunityPost, "id">),
      }));

      itemsData.sort(
        (a, b) =>
          new Date(b.created_by).getTime() - new Date(a.created_by).getTime()
      );

      setItems(itemsData);
    });
    return () => unsub();
  }, []);

  useEffect(() => {}, [user]);

  let inventory = "";

  if (user?.rhuOrBarangay === "1") {
    inventory = "RHU1Inventory";
  } else if (user?.rhuOrBarangay === "2") {
    inventory = "RHU2Inventory";
  } else if (user?.rhuOrBarangay === "3") {
    inventory = "RHU3Inventory";
  }

  const userImg = (rhuOrBarangay: string | undefined) => {
    if (rhuOrBarangay === "1") {
      return "/images/1.jpg";
    } else if (rhuOrBarangay === "2") {
      return "/images/2.jpg";
    } else if (rhuOrBarangay === "3") {
      return "/images/3.jpg";
    } else {
      return "/images/finalelogo.jpg";
    }
  };

  const handleDelete = (item: CommunityPost) => {
    setDeleteId(item.id);
    setDeleteItem(item);
    setShowDeleteModal(true);
    console.log(deleteId);
  };

  const handleEdit = (id: string) => {
    setEditId(id);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setEditId(null);
    setShowEditModal(false);
  };

  const handleConfirmDelete = async () => {
    if (deleteItem?.postImg) {
      const desertRef = ref(storage, deleteItem.postImg);
      try {
        await deleteObject(desertRef);
        console.log("Successfully deleted image");
      } catch (error) {
        console.log("Error deleting image:", error);
        return;
      }
    }

    if (deleteId) {
      setShowDeleteModal(false);
      try {
        await deleteDoc(doc(db, "CommunityPost", deleteId));
        setDeleteId(null);
        setDeleteItem(null);
        setShowDeleteModal(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
    setDeleteItem(null);
  };

  const renderMedia = (postImg: string, fileType: string | undefined) => {
    if (fileType === "image") {
      return (
        <div className="flex justify-center items-center">
          <img
            src={postImg}
            alt="Post content"
            className="rounded-lg h-[600px] max-w-full  "
          />
        </div>
      );
    } else if (fileType === "video") {
      return (
        <video
          src={postImg}
          controls
          loop
          className="rounded-lg max-h-full w-full"
        >
          Your browser does not support the video tag.
        </video>
      );
    } else {
      return null;
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedPostId(expandedPostId === id ? null : id);
  };

  return (
    <DashboardLayout>
      <ScrollToTop />
      <h1 className="text-3xl font-bold mb-4">Community Post</h1>

      <div className="space-x-8">
        <div className="w-full">
          <div className="bg-white w-full mt-4 rounded-lg shadow-md p-4 flex items-center">
            <img
              src={userImg(user?.rhuOrBarangay)}
              alt="Profile"
              className="w-14 h-12 rounded-full"
            />
            <button
              onClick={handleShowModal}
              className="w-full text-left text-gray-500 bg-gray-200 px-3 h-10 mx-4 border-2 rounded-2xl border-sky-500 focus:outline-none focus:border-sky-500 hover:bg-customMind font-semibold text-m"
            >
              What's on your mind?
            </button>
            <img
              src="/images/up.png"
              alt="Upload"
              className="w-8 h-8 cursor-pointer"
              onClick={handleShowModal}
            />
          </div>
          <div className="grid grid-rows-1 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white w-full mt-10 rounded-lg shadow-md"
              >
                <div className="flex justify-between p-4 border-b border-gray-300">
                  <div className="flex">
                    <img
                      src={userImg(user?.rhuOrBarangay)}
                      alt="Profile"
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h2 className="font-semibold ml-4">
                        RURAL HEALTH UNIT{" "}
                        {user?.rhuOrBarangay === "1" ? (
                          <span>I</span>
                        ) : user?.rhuOrBarangay === "2" ? (
                          <span>II</span>
                        ) : user?.rhuOrBarangay === "3" ? (
                          <span>III</span>
                        ) : (
                          <span>I</span>
                        )}
                      </h2>
                      <h3 className="text-sm text-gray-500 ml-4">
                        {formatDateTime(item.created_by)}
                      </h3>
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      className="text-2xl text-gray-600"
                      onClick={() => toggleDropdown(item.id)}
                    >
                      ...
                    </button>
                    {openDropdownId === item.id && (
                      <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded shadow-md">
                        <button
                          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={() => handleEdit(item.id)}
                        >
                          <MdEdit className="inline-block mr-2" />
                          Edit
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 text-red-700 hover:bg-gray-100"
                          onClick={() => handleDelete(item)}
                        >
                          <MdDelete className="inline-block mr-2 text-red-700" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <p className="p-4">
                    {expandedPostId === item.id
                      ? item.postMessage
                      : item.postMessage.length > 100
                      ? item.postMessage.substring(0, 300) + "...."
                      : item.postMessage}
                    {item.postMessage.length > 100 && (
                      <button
                        onClick={() => toggleExpand(item.id)}
                        className="text-blue-500 ml-2 font-bold hover:underline"
                      >
                        {expandedPostId === item.id ? "Show less" : "Show more"}
                      </button>
                    )}
                  </p>
                  <div className="w-full">
                    {item.postImg && renderMedia(item.postImg, item.fileType)}
                  </div>
                </div>
                {/* <div className="flex p-4 border-t border-gray-300">
                  <AiFillLike className="mr-2 text-xl" />
                </div> */}
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal && <ModalPost isVisible={showModal} closeModal={closeModal} />}

      {showEditModal && (
        <EditPost
          showModal={showEditModal}
          closeModal={closeEditModal}
          editId={editId}
        />
      )}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-md shadow-lg text-center">
            <p>Are you sure you want to delete this post?</p>
            <div className="mt-4 space-x-4">
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md"
              >
                Delete
              </button>
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-400 text-white rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Community;
