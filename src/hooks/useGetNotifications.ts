import {
  query,
  where,
  collection,
  getDocs,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import { firestore } from "../firebase/firebase";

interface Notification {
  fullName: string;
  type: string;
  postId: string;
  createdAt: number;
  userId: string;
}

// Function to fetch notifications for a specific user from Firestore within a given time range
const fetchUserNotificationsForWeek = async (
  userId: string
): Promise<Notification[]> => {
  const currentTime = Date.now();
  const oneWeekAgo = currentTime - 7 * 24 * 60 * 60 * 1000; // Calculate timestamp for one week ago

  const notificationsRef = collection(firestore, "notifications");
  const q = query(
    notificationsRef,
    where("userId", "==", userId),
    where("createdAt", ">=", oneWeekAgo),
    where("createdAt", "<=", currentTime)
  );
  const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);

  const notifications: Notification[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data() as Notification;
    notifications.push(data);
  });

  notifications.sort(
    (a: Notification, b: Notification) => b.createdAt - a.createdAt
  );

  return notifications;
};

export default fetchUserNotificationsForWeek;
