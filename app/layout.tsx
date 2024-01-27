import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ToasterContext from "./context/ToasterContext";
import AuthContext from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import getCurrentUser from "./actions/getCurrentUser";
import ActiveStatus from "./components/ActiveStatus";
import SettingsModals from "./components/modals/SettingsModals";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Discord Clone",
  description: "Discord Clone",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser();
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContext>
          <ToasterContext/>
          {currentUser && <SettingsModals currentUser={currentUser}/>}
          <ActiveStatus/>
          {children}
        </AuthContext>
        </body>
    </html>
  );
}
