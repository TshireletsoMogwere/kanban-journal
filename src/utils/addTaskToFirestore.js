import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

export const addTaskToFirestore = async (task) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not logged in");

  const taskCollectionRef = collection(db, "users", user.uid, "tasks");
  const docRef = await addDoc(taskCollectionRef, {
    ...task,
    createdAt: serverTimestamp(),
  });

  return docRef.id; // Firestore document ID
};
