import { query, where, collection, getDocs } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

// Function to fetch notifications for a specific user from Firestore within a given time range
const fetchUserNotificationsForWeek = async (userId: String) => {
  const currentTime = Date.now();
  const oneWeekAgo = currentTime - 7 * 24 * 60 * 60 * 1000; // Calculate timestamp for one week ago

  const notificationsRef = collection(firestore, "notifications");
  const querySnapshot = await getDocs(
    query(
      notificationsRef,
      where("userId", "==", userId), // Filter by user ID
      where("createdAt", ">=", oneWeekAgo),
      where("createdAt", "<=", currentTime)
    )
  );

  const notifications: any = [];
  querySnapshot.forEach((doc) => {
    notifications.push(doc.data());
  });

  return notifications;
};

export default fetchUserNotificationsForWeek;
