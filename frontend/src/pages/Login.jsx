import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../api/index.js";
import { useAuth } from "../context/AuthContext.jsx";
import AuthLayout from "../components/AuthLayout.jsx";
import { field, label, primaryBtn, errorBox } from "../components/authStyles.js";
import { setPendingEmail } from "../lib/pendingEmail.js";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [signup, setSignup] = useState(false);
  const [f, setF] = useState({ name: "", email: "", password: "" });
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const goVerify = (email) => {
    setPendingEmail(email);
    navigate("/verify-email", { state: { email } });
  };

  const submit = async (e) => {
    e.preventDefault();
    if (signup && !f.name.trim()) return setErr("Add your name so AAdat can greet you.");
    if (!/^\S+@\S+\.\S+$/.test(f.email)) return setErr("Enter a valid email, like you@example.com.");
    if (f.password.length < 8) return setErr("Use a password with at least 8 characters.");
    setErr("");
    setBusy(true);
    try {
      if (signup) {
        const { email } = await auth.signup(f.name, f.email, f.password);
        goVerify(email); // a code was emailed; verify before logging in
      } else {
        await login(f.email, f.password); // <GuestOnly> redirects to the tracker
      }
    } catch (x) {
      if (x.code === "EMAIL_NOT_VERIFIED") return goVerify(f.email.trim().toLowerCase());
      setErr(x.message || "Something went wrong. Try again.");
      setBusy(false);
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={submit} noValidate className="flex flex-col gap-3.5 px-5 py-6 md:p-8">
        <h1 className="font-display text-[56px] leading-none text-rust [text-shadow:3px_3px_0_var(--color-ink)]">
          AAdat
        </h1>
        <h2 className="mb-1 font-display text-[22px] font-normal">
          {signup ? "Start your streak" : "Welcome back"}
        </h2>

        {signup && (
          <label className={label}>
            Name
            <input value={f.name} onChange={set("name")} autoComplete="name" maxLength={30} className={field} />
          </label>
        )}
        <label className={label}>
          Email
          <input type="email" value={f.email} onChange={set("email")} autoComplete="email" className={field} />
        </label>
        <label className={label}>
          Password
          <span className="flex">
            <input
              type={show ? "text" : "password"}
              value={f.password}
              onChange={set("password")}
              autoComplete={signup ? "new-password" : "current-password"}
              className={`${field} border-r-0`}
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              aria-pressed={show}
              className="cursor-pointer border-2 border-ink bg-paper2 px-3 font-normal"
            >
              {show ? "Hide" : "Show"}
            </button>
          </span>
        </label>

        {err && <p className={errorBox} role="alert">{err}</p>}

        <button type="submit" disabled={busy} className={primaryBtn}>
          {busy ? "Please wait…" : signup ? "Create account" : "Sign in"}
        </button>
        <button
          type="button"
          onClick={() => { setSignup(!signup); setErr(""); }}
          className="cursor-pointer p-0.5 text-left underline"
        >
          {signup ? "Already have an account? Sign in" : "New here? Create an account"}
        </button>
      </form>
      
<button
  type="button"
  onClick={() => window.open("https://aadat-api-0u8l.onrender.com", "_blank")}
  className="cursor-pointer p-0.5 text-left underline"
>
  Click to start the server
</button>
    </AuthLayout>
  );
}
