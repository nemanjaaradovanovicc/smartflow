"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = "http://127.0.0.1:4000";

type Me = {
  id: string;
  email: string;
  name?: string | null;
  createdAt?: string;
};

export default function Dashboard() {
  const router = useRouter();

  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = useMemo(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("token") || "";
  }, []);

  useEffect(() => {
    if (!token) {
      router.push("/");
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (!res.ok) {
          // token invalid/expired
          localStorage.removeItem("token");
          router.push("/");
          return;
        }

        if (!cancelled) setMe(data?.user ?? data);
      } catch (e) {
        if (!cancelled) setError("Failed to load user. Is API running?");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router, token]);

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const initials = (
    me?.name?.trim()?.[0] ||
    me?.email?.trim()?.[0] ||
    "U"
  ).toUpperCase();

  if (loading) {
    return (
      <div style={{ padding: 40, fontFamily: "sans-serif" }}>
        Loading dashboard…
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 40, fontFamily: "sans-serif", maxWidth: 600 }}>
        <h2 style={{ marginTop: 0 }}>Dashboard error</h2>
        <p style={{ opacity: 0.8 }}>{error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{ padding: "10px 12px" }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!me) return null;

  return (
    <div
      style={{ display: "flex", minHeight: "100vh", fontFamily: "sans-serif" }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: 260,
          borderRight: "1px solid #2a2a2a",
          padding: 18,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              border: "1px solid #333",
              display: "grid",
              placeItems: "center",
              fontWeight: 700,
            }}
          >
            S
          </div>
          <div>
            <div style={{ fontWeight: 800, lineHeight: 1.2 }}>Smartflow</div>
            <div style={{ fontSize: 12, opacity: 0.6 }}>Workspace</div>
          </div>
        </div>

        <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
          <NavItem label="Overview" active />
          <NavItem label="Projects" />
          <NavItem label="Issues" />
          <NavItem label="Settings" />
        </div>

        <div
          style={{
            marginTop: "auto",
            paddingTop: 14,
            borderTop: "1px solid #2a2a2a",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 999,
                border: "1px solid #333",
                display: "grid",
                placeItems: "center",
                fontWeight: 700,
              }}
              title={me.email}
            >
              {initials}
            </div>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontWeight: 700,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {me.name || "User"}
              </div>
              <div
                style={{
                  fontSize: 12,
                  opacity: 0.6,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {me.email}
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            style={{
              marginTop: 12,
              width: "100%",
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid #333",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: 22 }}>
        {/* Topbar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "14px 16px",
            border: "1px solid #2a2a2a",
            borderRadius: 16,
          }}
        >
          <div>
            <div style={{ fontWeight: 800, fontSize: 18 }}>Dashboard</div>
            <div style={{ fontSize: 12, opacity: 0.6 }}>
              Welcome back, {me.name || me.email}
            </div>
          </div>

          <button
            onClick={() => alert("Next: Create Project modal")}
            style={{
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid #333",
              cursor: "pointer",
            }}
          >
            + New Project
          </button>
        </div>

        {/* Content */}
        <div style={{ marginTop: 18, display: "grid", gap: 14 }}>
          <Card
            title="Quick stats"
            subtitle="Placeholder (next: real projects/issues)"
          >
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Stat label="Projects" value="0" />
              <Stat label="Issues" value="0" />
              <Stat label="Active" value="0" />
            </div>
          </Card>

          <Card title="Next step" subtitle="What we build next">
            <ol style={{ margin: 0, paddingLeft: 18, opacity: 0.85 }}>
              <li>Create Project CRUD (API + UI)</li>
              <li>Create Issue CRUD with status/priority</li>
              <li>Board view (TODO / IN_PROGRESS / DONE)</li>
            </ol>
          </Card>
        </div>
      </main>
    </div>
  );
}

function NavItem({ label, active }: { label: string; active?: boolean }) {
  return (
    <button
      style={{
        textAlign: "left",
        width: "100%",
        padding: "10px 12px",
        borderRadius: 12,
        border: "1px solid #2a2a2a",
        background: active ? "rgba(255,255,255,0.06)" : "transparent",
        cursor: "pointer",
      }}
    >
      <span
        style={{ fontWeight: active ? 800 : 600, opacity: active ? 1 : 0.85 }}
      >
        {label}
      </span>
    </button>
  );
}

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        padding: 16,
        borderRadius: 16,
        border: "1px solid #2a2a2a",
      }}
    >
      <div
        style={{ display: "flex", justifyContent: "space-between", gap: 12 }}
      >
        <div>
          <div style={{ fontWeight: 800 }}>{title}</div>
          {subtitle ? (
            <div style={{ fontSize: 12, opacity: 0.6 }}>{subtitle}</div>
          ) : null}
        </div>
      </div>
      <div style={{ marginTop: 12 }}>{children}</div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        padding: 12,
        borderRadius: 14,
        border: "1px solid #333",
        minWidth: 140,
      }}
    >
      <div style={{ fontSize: 12, opacity: 0.6 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 900 }}>{value}</div>
    </div>
  );
}
