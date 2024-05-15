import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'
import "./globals.css";
import Nav from "@/app/components/Nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
<ClerkProvider>
    <html lang="en">
        <body data-theme="sunset" className={`${inter.className} h-screen`}>
          <div className="drawer h-full">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content h-full">{children}</div>
            <div className="drawer-side z-20">
              <label
                htmlFor="my-drawer"
                aria-label="close sidebar"
                className="drawer-overlay"></label>
              <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
                <Nav />
              </ul>
            </div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}