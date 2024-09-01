import React, { ChangeEvent, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { MdPhotoLibrary, MdCancel } from "react-icons/md";
import { TbPhotoVideo } from "react-icons/tb";
import { TbLetterX } from "react-icons/tb";
import { db, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { addDoc, collection } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "./User";

interface PostProps {
  isVisible: boolean;
  closeModal: () => void;
}
const Post: React.FC<PostProps> = ({ isVisible, closeModal }) => {
  if (!isVisible) return null;
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [openUpload, setOpenUpload] = useState(false);
  const [formData, setFormData] = useState({
    postMessage: "",
    rhu: "",
  });
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.target instanceof HTMLInputElement && e.target.files) {
      const selectedFile = e.target.files[0];
      if (e.target.id === "postImage") {
        setFile(selectedFile);
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreview(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
      } else {
        setFile(null);
        setPreview(null);
      }
    } else {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };
  const openUploadImg = () => {
    setOpenUpload(true);
  };
  const closeUploadImg = () => {
    setOpenUpload(false);
    setFile(null);
    setPreview(null);
  };
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);
  const onSubmit = async () => {
    setLoading(true);
    const now = new Date();
    const dateToday = now.toISOString();
    try {
      let postImg = "";
      let fileType = ""; // To store the file type (image or video)
      if (file) {
        const imageRef = ref(storage, `CommunityPost/${file.name + v4()}`);
        await uploadBytes(imageRef, file);
        postImg = await getDownloadURL(imageRef);
        fileType = file.type.startsWith("image/") ? "image" : "video"; // Determine if the file is an image or video
      }
      const formDataWithImage = {
        ...formData,
        created_by: dateToday,
        updated_by: dateToday,
        postImg,
        fileType, // Store file type in Firestore
        rhu: user?.rhuOrBarangay,
      };
      const docRef = await addDoc(
        collection(db, "CommunityPost"),
        formDataWithImage
      );
      console.log("Document written with ID: ", docRef.id);
      setFormData({
        postMessage: "",
        rhu: "",
      });
      closeModal();
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const userImg = (rhu: any) => {
    if (rhu === "1") {
      return "/images/1.jpg";
    } else if (rhu === "2") {
      return "/images/2.jpg";
    } else if (rhu === "3") {
      return "/images/3.jpg";
    } else {
      return "/images/finalelogo.jpg";
    }
  };
  return (
    <>
      {isVisible && (
        <div className="fixed inset-0 z-10 overflow-y-auto shadow-xl shadow-black">
          <div className="flex justify-center items-center min-h-screen pt-4 px-4 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white pt-5 pb-4 sm:pb-4">
                <div className="flex justify-center items-center sm:flex sm:items-start m-2">
                  <h3
                    className="text-xl leading-6 font-bold text-gray-900"
                    id="modal-headline"
                  >
                    Create post
                  </h3>
                  <button onClick={closeModal}>
                    <MdCancel className="absolute w-10 h-10 right-5 top-4 text-red-700 hover:text-red-900" />
                  </button>
                </div>
                <div className="w-full border-b border-gray-300 mt-4"></div>
                <div className="flex flex-row">
                  <img
                    src={userImg(user?.rhuOrBarangay)}
                    alt=""
                    className="w-14 h-14 ml-3 mt-3 mr-3"
                  />
                  <h2 className="mt-7 font-semibold">
                    Rural Health{" "}
                    {user?.rhuOrBarangay === "1" ? (
                      <span>I</span>
                    ) : user?.rhuOrBarangay === "2" ? (
                      <span>II</span>
                    ) : user?.rhuOrBarangay === "3" ? (
                      <span>III</span>
                    ) : null}
                  </h2>
                  <div></div>
                </div>
                <div className="overflow-y-auto max-h-70">
                  <div className="m-3">
                    <textarea
                      id="postMessage"
                      onChange={handleChange}
                      placeholder="What's on your mind?"
                      className="p-2 w-full border-none focus:border-none focus:outline-none text-2xl"
                      rows={2}
                    ></textarea>
                  </div>
                  {openUpload && (
                    <div className="p-4 flex justify-center items-center">
                      <div className="w-full border p-2 flex justify-center items-center h-3/6 rounded-lg">
                        <div
                          className="relative flex justify-center items-center bg-gray-100 hover:bg-gray-300 w-full h-48 rounded-lg bg-cover bg-center"
                          style={{
                            backgroundImage:
                              preview && file?.type.startsWith("image/")
                                ? `url(${preview})`
                                : "none",
                          }}
                        >
                          <button
                            onClick={closeUploadImg}
                            className="absolute z-20 top-2 right-2 rounded-full bg-red-700 hover:bg-red-900 p-1"
                          >
                            <TbLetterX className="w-5 h-5 text-white" />
                          </button>

                          {!preview && (
                            <>
                              <input
                                type="file"
                                accept="image/*, video/*"
                                name="postImage"
                                id="postImage"
                                onChange={handleChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                              />
                              <label
                                htmlFor="postImage"
                                className="absolute cursor-pointer rounded-full bg-gray-300 p-1 z-10"
                              >
                                <TbPhotoVideo className="w-9 h-9" />
                              </label>
                              <span className="mt-16">Add Photo/Video</span>
                            </>
                          )}

                          {/* Display Preview: Image or Video */}
                          {preview &&
                            (file?.type.startsWith("image/") ? (
                              <img
                                src={preview}
                                alt="Selected preview"
                                className="rounded-lg max-h-full max-w-full"
                              />
                            ) : (
                              <video
                                src={preview}
                                controls
                                className="rounded-lg max-h-full w-full"
                              >
                                Your browser does not support the video tag.
                              </video>
                            ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4 relative ">
                  <button
                    onClick={openUploadImg}
                    className="flex justify-between border border-gray-400 hover:bg-gray-100 rounded-lg p-4 w-full"
                  >
                    <span className="">Add to your post</span>
                    <MdPhotoLibrary className="w-6 h-6 text-customImageIcon" />
                  </button>
                </div>
                <div className="px-4">
                  <button
                    onClick={onSubmit}
                    className="mt-1 bg-customButtonPost text-white p-2 w-full rounded-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <svg
                          width="800px"
                          height="800px"
                          viewBox="0 0 16 16"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          className="animate-spin h-5 w-5 mr-3 text-white"
                          clipRule="evenodd"
                        >
                          <g
                            fill="#000000"
                            fillRule="evenodd"
                            clipRule="evenodd"
                          >
                            <path
                              d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8z"
                              opacity=".2"
                            />

                            <path d="M7.25.75A.75.75 0 018 0a8 8 0 018 8 .75.75 0 01-1.5 0A6.5 6.5 0 008 1.5a.75.75 0 01-.75-.75z" />
                          </g>
                        </svg>
                        {/* Loading... */}
                      </div>
                    ) : (
                      "Post"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Post;
