import { useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { auth } from "../api/index.js";
import { useAuth } from "../context/AuthContext.jsx";
import AuthLayout from "../components/AuthLayout.jsx";
import { field, label, primaryBtn, errorBox, infoBox } from "../components/authStyles.js";
import { clearPendingEmail, getPendingEmail } from "../lib/pendingEmail.js";

const RESEND_SECONDS = 60;

export default function VerifyEmail() {
  const { state } = useLocation();
  const email = state?.email || getPendingEmail();
  const { verifyEmail } = useAuth();

  const [otp, setOtp] = useState("");
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_SECONDS); // a code was just emailed

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  if (!email) return <Navigate to="/login" replace />;

  const submit = async (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(otp)) return setErr("Enter the 6-digit code from your email.");
    setErr("");
    setInfo("");
    setBusy(true);
    try {
      await verifyEmail(email, otp); // logs in; <GuestOnly> redirects to the tracker
      clearPendingEmail();
    } catch (x) {
      setErr(x.message || "Something went wrong. Try again.");
      setBusy(false);
    }
  };

  const resend = async () => {
    setErr("");
    setInfo("");
    try {
      await auth.resendOtp(email);
      setInfo("A new code is on its way. Check your inbox (and spam).");
      setCooldown(RESEND_SECONDS);
    } catch (x) {
      setErr(x.message || "Couldn't resend the code.");
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={submit} noValidate className="flex flex-col gap-3.5 px-5 py-6 md:p-8">
        <h1 className="font-display text-[56px] leading-none text-rust [text-shadow:3px_3px_0_var(--color-ink)]">
          AAdat
        </h1>
        <h2 className="mb-1 font-display text-[22px] font-normal">Check your email</h2>
        <p className="text-[13px]">
          We sent a 6-digit code to <b className="break-all">{email}</b>. It expires in 10 minutes.
        </p>

        <label className={label}>
          Verification code
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            inputMode="numeric"
            autoComplete="one-time-code"
            autoFocus
            maxLength={6}
            placeholder="123456"
            className={`${field} text-center text-2xl tracking-[0.5em]`}
          />
        </label>

        {err && <p className={errorBox} role="alert">{err}</p>}
        {info && <p className={infoBox} role="status">{info}</p>}

        <button type="submit" disabled={busy} className={primaryBtn}>
          {busy ? "Verifying…" : "Verify email"}
        </button>

        <button
          type="button"
          onClick={resend}
          disabled={cooldown > 0}
          className="cursor-pointer p-0.5 text-left underline disabled:cursor-not-allowed disabled:no-underline disabled:opacity-60"
        >
          {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
        </button>
        <Link to="/login" onClick={clearPendingEmail} className="p-0.5 underline">
          Use a different email
        </Link>
      </form>
    </AuthLayout>
  );
}
