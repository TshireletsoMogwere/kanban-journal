import { getDatabase, ref, push } from "firebase/database";
import { auth } from "../firebase";

const db = getDatabase();

export const addTaskToFirestore = async (task) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not logged in");

  const taskRef = ref(db, `users/${user.uid}/tasks`);
  const newTaskRef = await push(taskRef, {
    ...task,
    createdAt: Date.now(),
  });
  return newTaskRef.key; 
};
