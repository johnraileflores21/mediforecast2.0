
import { collection, addDoc, getDocs, query, where, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from "../firebase";

export type NotificationAction = 'approve' | 'request' | 'distribute' | 'receive' | 'outOfStock' | 'alert';

export interface Notification {
  id?: string;
  action: NotificationAction;
  barangayItemId?: string | null;
  itemId: string;
  itemName: string;
  itemType: string;
  quantity: number;
  description: string;
  performedBy: string;
  sentBy: string;
  sentTo: string; // Barangay or full name
  createdAt: Timestamp;
  readAt?: Timestamp;
  status: 'unread' | 'read';
}

class NotificationService {
  private collectionRef = collection(db, 'Notifications');

  /**
   * Creates a new notification.
   * @param notification The notification data.
   * @returns The created notification ID.
   */
  async createNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'status'>): Promise<void> {
    try {
       await addDoc(this.collectionRef, {
        ...notification,
        createdAt: Timestamp.now(),
        status: 'unread',
      });
      console.log('Notification created successfully.');
      // return docRef.id;
    } catch(e) {
      console.error('Error creating notification:', e);
    }
  }



  /**
   * Retrieves notifications for a specific recipient.
   * @param recipient The recipient's identifier.
   * @returns An array of notifications.
   */
  async getNotifications(recipient: string): Promise<Notification[]> {
    const q = query(this.collectionRef, where('sentTo', '==', recipient));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Notification) }));
  }

  /**
   * Marks a notification as read.
   * @param notificationId The ID of the notification to update.
   */
  async markAsRead(notificationId: string): Promise<void> {
    try {
      const notificationDoc = doc(db, 'Notifications', notificationId);
      await updateDoc(notificationDoc, {
        readAt: Timestamp.now(),
        status: 'read',
      });
      console.log('Notification marked as read.');
    } catch(e) {
      console.error('Error marking notification as read:', e);
    }
  }
}

export default new NotificationService();