import { collection, doc, getDoc,getDocs,query,serverTimestamp,setDoc,updateDoc, where, writeBatch } from "firebase/firestore";
import { useEffect, useState } from "react"
import { db } from "../../firebase";
import { FaInfoCircle, FaUpload } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { baseUrl } from "../../assets/common/constants";
import { useNavigate } from "react-router-dom";

interface OtpVerificationProps {
    userId: string;
    showModal: boolean;
    closeModal: () => void;
}

export default function OtpVerification({ userId, showModal, closeModal }: OtpVerificationProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>();
    const [userData, setUserData] = useState<any>({});
    const [otp, setOtp] = useState();

    const Navigate = useNavigate();

    useEffect(() => {
        getUser();
    }, [userId]);


    async function getUser() {
        try {
            if (!userId) return;
            setLoading(true);

            const userDoc = await getDoc(doc(db, "Users", userId));
            if(userDoc.exists())
                setUserData({ id: userDoc.id, ...userDoc.data() });
            else setError("User not found");
        } catch (error: any) {
            toast.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function handleVerify(e: any) {
        try {
            setLoading(true);
            e.preventDefault();
            if(!otp) return toast.error("OTP is required");

            const otpQuerySnapshot = await getDocs(
                query(collection(db, "OtpVerifications"), where("userId", "==", userId))
            );
    
            let otpVerified = false;

            for(const otpDocSnap of otpQuerySnapshot.docs) {
                const otpData = otpDocSnap.data();
                console.log('otpData :>> ', otpData);
                console.log('otp :>> ', otp);
                const savedOtp = otpData.otp;
                const isValid = otpData.isValid;
    
                if(otp == savedOtp && isValid) {
                    const userDocRef = doc(db, "Users", userId);
                    await updateDoc(userDocRef, { acc_status: "pending" });
                    await updateDoc(otpDocSnap.ref, { isValid: false });
                    otpVerified = true;
                    break;
                }
            }

            console.log('otpVerified :>> ', otpVerified);
    
            if(!otpVerified) {
                toast.error("Invalid OTP. Please try again.");
            }

        } catch (error: any) {
            toast.error(error);
        } finally {
            setLoading(false);
            toast.success("Your account has been verified and will be reviewed by admin.");
            closeModal();
            Navigate('/');
        }
    }

    async function handleResendCode() {
        try {
            const newOtp = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
            const otpQuerySnapshot = await getDocs(
                query(collection(db, "OtpVerifications"), where("userId", "==", userId))
            );
    
            const batch = writeBatch(db);
    
            otpQuerySnapshot.forEach(doc => {
                const otpDocRef = doc.ref;
                batch.update(otpDocRef, { isValid: false });
            });
    
            await batch.commit();

            const newOtpDocRef = doc(collection(db, "OtpVerifications"));
            await setDoc(newOtpDocRef, {
                created_at: serverTimestamp(),
                isValid: true,
                otp: newOtp,
                userId: userId
            });

            await axios.post(`${baseUrl}/forgot-password/registration-otp`, {
                to: userData?.email,
                subject: '[Mediforecast] - Account Verification | OTP',
                firstName: userData?.firstname,
                code: newOtp
            }, { headers: {'token': 's3cretKey'} });
    
            toast.success(`Code has been sent to ${userData.email}`);
        } catch (error) {
            console.error("Error resending OTP: ", error);
            toast.error("Failed to resend OTP. Please try again.");
        }
    }
    
 

    return (
        showModal === true && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                <ToastContainer />
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                    <h2 className="text-xl font-semibold mb-4">OTP Verification</h2>
                    <div className="bg-blue-100 border-t-4 border-blue-500 rounded-b text-blue-900 px-4 py-1 shadow-md" role="alert">
                        <div className="flex items-center gap-2">
                            <div className="py-1">
                                <FaInfoCircle className="w-4 h-4 text-blue-700" />
                            </div>
                            <div>
                                <p className="text-sm">
                                    Code has been sent to {userData.email}. <br />
                                    <u style={{ cursor: 'pointer' }} onClick={handleResendCode}>Resend Code</u>
                                </p>
                            </div>
                        </div>
                    </div>


                    <form className="mt-6" onSubmit={handleVerify}>
                        <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                            Enter OTP
                        </label>
                        <input
                            type="number"
                            id="otp"
                            name="otp"
                            onInput={(e: any) => {
                                const value = e.target.value.slice(0, 6);
                                setOtp(value);
                            }}
                            value={otp}
                            placeholder="Enter OTP"
                            className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />

                        <button
                            disabled={loading}
                            type="submit"
                            className={`mt-4 w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                                loading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        >
                            Verify
                        </button>
                        <button
                            onClick={closeModal}
                            className="mt-4 w-full border bg-transparent font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            </div>

        )
    )
}