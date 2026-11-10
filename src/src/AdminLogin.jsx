
import { useState } from "react";
import {
  signInWithPopup,
  signOut
} from "firebase/auth";
import {
  doc,
  getDoc
} from "firebase/firestore";
import {
  auth,
  db,
  googleProvider
} from "./firebase";

export default function AdminLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const adminRef = doc(db, "admins", user.uid);
      const adminSnap = await getDoc(adminRef);

      if (!adminSnap.exists() || adminSnap.data().active !== true) {
        await signOut(auth);
        setError("তোমার এই Admin Panel ব্যবহারের অনুমতি নেই।");
        return;
      }

      window.location.href = "/admin";
    } catch (err) {
      console.error("Admin login error:", err);
      setError("Login করা যায়নি। আবার চেষ্টা করো।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-page">
      <div className="admin-login-card">
        <h1>NotePulse Science</h1>
        <h2>Admin Login</h2>
        <p>শুধুমাত্র অনুমোদিত Admin প্রবেশ করতে পারবেন।</p>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          {loading ? "Please wait..." : "Continue with Google"}
        </button>

        {error && <p role="alert">{error}</p>}
      </div>
    </main>
  );
}
