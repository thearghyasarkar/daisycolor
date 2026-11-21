import type { Metadata, Viewport } from "next";
import { GameProvider } from "@/lib/game-context";
import { AppShell } from "@/components/AppShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "A Little World of Her Own",
  description: "A quiet little world to colour, whenever the world feels a little too loud.",
  applicationName: "A Little World of Her Own",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#fbf7ee",
};

export default function RootLayout() {
  return (
    <html lang="en">
      <body>
        <GameProvider>
          <AppShell />
        </GameProvider>
      </body>
    </html>
  );
}
