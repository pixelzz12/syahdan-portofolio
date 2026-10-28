import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./redesign.css";
import "./expansion.css";
import "./boot.css";
import "./ev-guide.css";
import "./profile-terminal.css";
import "./facility-expansion.css";

export const metadata: Metadata = {
  title: "SYAHDAN — Creative Website Developer",
  icons: { icon: "/icon.svg" },
  // NOVA NODE already provides a dark palette; prevent extension rewrites before hydration.
  other: { "darkreader-lock": "true" },
  description: "Portfolio Muhammad Syahdan Herdhiyanta. Jelajahi web development, fotografi, dan eksperimen teknologi dalam fasilitas 3D interaktif.",
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#171b20", colorScheme: "dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body>{children}</body></html>;
}
