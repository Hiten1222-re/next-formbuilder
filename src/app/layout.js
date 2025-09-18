'use client'
import { Inter } from "next/font/google"
import "./globals.css"
import { usePathname } from "next/navigation"
import Navbar from "./Navbar"


const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isPreview = pathname.startsWith("/preview");

  return (
    <html lang="en">
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
          crossOrigin="anonymous"
        />
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL"
          crossOrigin="anonymous"
          async
        />
      </head>
      <body className={inter.className}>
        <div className="min-vh-100 bg-gradient-custom">
          {!isPreview && <Navbar/>}
          {children}</div>
      </body>
    </html>
  )
}
