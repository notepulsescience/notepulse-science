
import { useState } from "react";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // GOOGLE LOGIN - SUPER ADMIN
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const adminRef = doc(db, "admins", user.uid);
      const adminSnap = await getDoc(adminRef);

      const adminData = adminSnap.data();

      if (
        !adminSnap.exists() ||
        adminData?.active !== true ||
        adminData?.role !== "superAdmin"
      ) {
        await signOut(auth);
        setError("এই Google Account-এর Super Admin Access নেই।");
        return;
      }

      window.location.replace("/admin");
    } catch (err) {
      console.error("Google login error:", err);
      setError("Google Login করা যায়নি। আবার চেষ্টা করো।");
    } finally {
      setLoading(false);
    }
  };

  // EMAIL LOGIN - CO-ADMIN
  const handleEmailLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      setError("Email ও Password দিতে হবে।");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      const user = result.user;

      const adminRef = doc(db, "admins", user.uid);
      const adminSnap = await getDoc(adminRef);

      const adminData = adminSnap.data();

      if (
        !adminSnap.exists() ||
        adminData?.active !== true ||
        adminData?.role !== "coAdmin"
      ) {
        await signOut(auth);
        setError("তোমার Co-Admin Access অনুমোদিত নয় অথবা বন্ধ রয়েছে।");
        return;
      }

      window.location.replace("/admin");
    } catch (err) {
      console.error("Co-Admin login error:", err);

      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/wrong-password" ||
        err.code === "auth/user-not-found"
      ) {
        setError("Email অথবা Password সঠিক নয়।");
      } else {
        setError("Login করা যায়নি। আবার চেষ্টা করো।");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-page">
      <div className="admin-login-card">

        <h1>NotePulse Science</h1>

        <h2>Admin Login</h2>

        <p>
          শুধুমাত্র অনুমোদিত Admin প্রবেশ করতে পারবেন।
        </p>

        {/* GOOGLE LOGIN */}

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          {loading ? "Please wait..." : "Continue with Google"}
        </button>

        <div className="admin-login-divider">
          <span>OR</span>
        </div>

        {/* CO-ADMIN LOGIN */}

        <form
          className="admin-email-login"
          onSubmit={handleEmailLogin}
        >
          <label htmlFor="admin-email">
            Email Address
          </label>

          <input
            id="admin-email"
            type="email"
            placeholder="Enter your admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
            disabled={loading}
          />

          <label htmlFor="admin-password">
            Password
          </label>

          <input
            id="admin-password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Please wait..." : "Login as Co-Admin"}
          </button>
        </form>

        {error && (
          <p className="admin-login-error" role="alert">
            {error}
          </p>
        )}

      </div>
    </main>
  );
}
