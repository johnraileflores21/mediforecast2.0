import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as cors from "cors";

admin.initializeApp();

const corsHandler = cors({
  origin: true, // Allow all origins or specify your allowed origins
});

export const deleteUser = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    const userId = req.body.userId;

    if (!userId) {
      return res.status(400).send("User ID is required");
    }

    try {
      // Delete user from Firebase Authentication
      await admin.auth().deleteUser(userId);
      // Delete user from Firestore
      await admin.firestore().collection("Users").doc(userId).delete();
      return res.status(200).send({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      return res.status(500).send("Failed to delete user");
    }
  });
});
