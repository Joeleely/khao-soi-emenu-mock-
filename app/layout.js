import { Kanit } from "next/font/google";
import GlobalMenuShortcuts from "./components/GlobalMenuShortcuts";
import "./globals.css";

const kanit = Kanit({
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-kanit",
  display: "swap",
});

export const metadata = {
  title: "Fresh Khao-Soi — eMenu",
  description: "Digital menu — Fresh Khao-Soi noodles",
};

export default function RootLayout({ children }) {
  return (
    <html lang="th" className={kanit.variable}>
      <body className={`${kanit.className} antialiased`}>
        <GlobalMenuShortcuts />
        {children}
      </body>
    </html>
  );
}
