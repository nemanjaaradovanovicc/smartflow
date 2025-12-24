"use client";

import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:4000";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [token, setToken] = useState("");
  const [me, setMe] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<"" | "register" | "login" | "me">("");

  // Load token from localStorage on mount
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) setToken(t);
  }, []);

  // Persist token
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
  }, [token]);

  const logout = () => {
    setToken("");
    setMe(null);
    setError("");
    localStorage.removeItem("token");
  };

  const register = async () => {
    setError("");
    setLoading("register");

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();
      if (!res.ok) return setError(data.message || "Error");

      setToken(data.token);

      // opciono: odmah preusmeri na dashboard
      window.location.href = "/dashboard";
    } catch (e) {
      setError("Network error");
    } finally {
      setLoading("");
    }
  };

  const login = async () => {
    setError("");
    setLoading("login");

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) return setError(data.message || "Error");

      setToken(data.token);

      // opciono: odmah preusmeri na dashboard
      window.location.href = "/dashboard";
    } catch (e) {
      setError("Network error");
    } finally {
      setLoading("");
    }
  };

  const getMe = async () => {
    setError("");
    setLoading("me");

    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) return setError(data.message || "Unauthorized");

      setMe(data);
    } catch (e) {
      setError("Network error");
    } finally {
      setLoading("");
    }
  };

  return (
    <main style={{ padding: 40, fontFamily: "sans-serif", maxWidth: 520 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ margin: 0 }}>Smartflow</h1>

        {token ? (
          <button onClick={logout} style={{ padding: "8px 12px" }}>
            Logout
          </button>
        ) : null}
      </div>

      <p style={{ marginTop: 8, opacity: 0.7 }}>
        Mini Jira / Linear clone — auth test page
      </p>

      <div
        style={{
          marginTop: 20,
          padding: 16,
          border: "1px solid #2a2a2a",
          borderRadius: 12,
        }}
      >
        <h3 style={{ marginTop: 0 }}>Auth</h3>

        <div style={{ display: "grid", gap: 10 }}>
          <input
            placeholder="Name (for register)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ padding: 10, borderRadius: 10, border: "1px solid #333" }}
          />
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: 10, borderRadius: 10, border: "1px solid #333" }}
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: 10, borderRadius: 10, border: "1px solid #333" }}
          />
        </div>

        <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
          <button
            onClick={register}
            disabled={loading !== ""}
            style={{ padding: "10px 12px", borderRadius: 10 }}
          >
            {loading === "register" ? "Registering..." : "Register"}
          </button>

          <button
            onClick={login}
            disabled={loading !== ""}
            style={{ padding: "10px 12px", borderRadius: 10 }}
          >
            {loading === "login" ? "Logging in..." : "Login"}
          </button>

          <button
            onClick={getMe}
            disabled={!token || loading !== ""}
            style={{ padding: "10px 12px", borderRadius: 10 }}
            title={!token ? "Login first" : ""}
          >
            {loading === "me" ? "Loading..." : "Get /me"}
          </button>
        </div>

        {error && <p style={{ color: "red", marginTop: 12 }}>{error}</p>}
      </div>

      {token && (
        <div style={{ marginTop: 20 }}>
          <h3 style={{ marginBottom: 8 }}>JWT Token</h3>
          <pre
            style={{
              whiteSpace: "break-spaces",
              padding: 12,
              borderRadius: 12,
              border: "1px solid #333",
            }}
          >
            {token}
          </pre>
        </div>
      )}

      {me && (
        <div style={{ marginTop: 20 }}>
          <h3 style={{ marginBottom: 8 }}>/auth/me response</h3>
          <pre
            style={{ padding: 12, borderRadius: 12, border: "1px solid #333" }}
          >
            {JSON.stringify(me, null, 2)}
          </pre>
        </div>
      )}
    </main>
  );
}
