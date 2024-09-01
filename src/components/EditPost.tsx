import React, { ChangeEvent, useState, useEffect } from "react";
import { MdPhotoLibrary, MdCancel } from "react-icons/md";
import { TbPhotoVideo, TbLetterX } from "react-icons/tb";
import { db, storage } from "../firebase"; // Ensure `db` is correctly initialized
import { v4 } from "uuid";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { useUser } from "./User";

interface EditPostProps {
  editId: string | null;
  closeModal: () => void;
  showModal: boolean;
}

const EditPost: React.FC<EditPostProps> = ({
  showModal,
  closeModal,
  editId,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [openUpload, setOpenUpload] = useState(false);
  const [formData, setFormData] = useState({
    postMessage: "",
    rhu: "",
  });
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    if (editId === null) {
      console.log("Edit ID is null");
      return;
    }

    const docRef = doc(db, "CommunityPost", editId); // Make sure editId is a string here
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFormData({
          postMessage: data.postMessage || "",
          rhu: data.rhu || "",
        });
        if (data.postImg) {
          setOpenUpload(true);
          setPreview(data.postImg);
        }
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching document: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [editId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId === null) {
        console.log("Edit ID is null");
        return;
      }

      const updates: any = { ...formData };

      if (file) {
        const storageReference = storageRef(
          storage,
          `CommunityPost/${file.name + v4()}`
        );

        await uploadBytes(storageReference, file);
        const imageUrl = await getDownloadURL(storageReference);
        updates.postImg = imageUrl;
      }

      await updateDoc(doc(db, "CommunityPost", editId), {
        ...updates,
        updated_by: new Date().toISOString(),
      });

      console.log("Document successfully updated!");
    } catch (error) {
      console.error("Error updating document:", error);
    } finally {
      setLoading(false);
      closeModal();
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.target instanceof HTMLInputElement && e.target.files) {
      const selectedFile = e.target.files[0];
      if (selectedFile) {
        console.log("Selected file:", selectedFile);
        console.log("File type:", selectedFile.type);

        const objectUrl = URL.createObjectURL(selectedFile);
        setFile(selectedFile);
        setPreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
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

  const userImg = (rhuOrBarangay: string) => {
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
  console.log("File type:", file?.type);
  console.log("Object URL:", preview);

  return (
    <>
      {showModal && (
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
                    Edit Post
                  </h3>
                  <button onClick={closeModal}>
                    <MdCancel className="absolute w-10 h-10 right-5 top-4 text-red-700 hover:text-red-900" />
                  </button>
                </div>
                <div className="w-full border-b border-gray-300 mt-4"></div>
                <div className="flex flex-row">
                  <img
                    src={userImg(user?.rhuOrBarangay || "")}
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
                </div>
                <div className="overflow-y-auto max-h-70">
                  <div className="m-3">
                    <textarea
                      id="postMessage"
                      value={formData.postMessage}
                      onChange={handleChange}
                      placeholder="What's on your mind?"
                      className="p-2 w-full border-none focus:border-none focus:outline-none text-2xl"
                      rows={2}
                    ></textarea>
                  </div>
                  {openUpload && (
                    <div className="p-4 flex justify-center items-center">
                      <div className="w-full border p-2 flex justify-center items-center h-3/6 rounded-lg">
                        <div className="relative flex justify-center items-center bg-gray-100 hover:bg-gray-300 w-full h-48 rounded-lg bg-cover bg-center">
                          {preview ? (
                            preview.startsWith("data:") ||
                            preview.startsWith("blob:") ? (
                              // If the preview URL is a data URL or blob URL (e.g., from a file input)
                              file?.type.startsWith("video/") ? (
                                <video
                                  src={preview}
                                  controls
                                  className="rounded-lg max-h-full w-full"
                                  onError={() =>
                                    console.error("Error loading video")
                                  }
                                >
                                  Your browser does not support the video tag.
                                </video>
                              ) : file?.type.startsWith("image/") ? (
                                <img
                                  src={preview}
                                  alt="Selected preview"
                                  className="rounded-lg max-h-full max-w-full"
                                  onError={() =>
                                    console.error("Error loading image")
                                  }
                                />
                              ) : (
                                <div>Unsupported file type</div>
                              )
                            ) : // If the preview URL is a direct URL (e.g., from Firebase Storage)
                            preview.endsWith(".mp4") ? (
                              <video
                                src={preview}
                                controls
                                className="rounded-lg max-h-full w-full"
                                onError={() =>
                                  console.error("Error loading video")
                                }
                              >
                                Your browser does not support the video tag.
                              </video>
                            ) : (
                              <img
                                src={preview}
                                alt="Selected preview"
                                className="rounded-lg max-h-full max-w-full"
                                onError={() =>
                                  console.error("Error loading image")
                                }
                              />
                            )
                          ) : (
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

                          {preview && (
                            <button
                              onClick={closeUploadImg}
                              className="absolute z-20 top-2 right-2 rounded-full bg-red-700 hover:bg-red-900 p-1"
                            >
                              <TbLetterX className="w-5 h-5 text-white " />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4 relative">
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
                    onClick={handleSubmit}
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
                      "Update Post"
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

export default EditPost;
