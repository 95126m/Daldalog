import { auth } from "@/api/firebaseApp";
import { signInWithEmailAndPassword, UserCredential } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";

export const loginWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const db = getDatabase();
    const adminRef = ref(db, "admin/uid");
    const snapshot = await get(adminRef);

    if (!snapshot.exists() || snapshot.val() !== user.uid) {
      throw new Error("관리자 계정이 아닙니다.");
    }

    return user;
  } catch (error) {
    console.error("로그인 중 오류 발생:", error);
    throw error;
  }
};
