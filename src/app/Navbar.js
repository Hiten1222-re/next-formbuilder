"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [client, setClient] = useState("");
  const router=useRouter()
  const cookie = Cookies.get("client");

  useEffect(() => {
    if (cookie) {
      try {
        const cook = JSON.parse(cookie);
        setClient(cook.id);
      } catch (err) {
        console.error("Invalid cookie format:", err);
      }
    }
  }, [cookie]);

  return (
<nav className="navbar navbar-expand-lg navbar-light bg-white bg-opacity-80 backdrop-blur border-bottom">
        <div className="container">
          <div className="navbar-brand d-flex align-items-center">
            <div className="bg-gradient-primary rounded-2 p-1 me-4">
              <Sparkles className="text-white" size={20} />
            </div>
            <Link href='/' className="fs-5 text-gradient-primary me-4">Home</Link>
            <Link href='/my-forms' className="fs-5 text-gradient-primary me-4">My Forms</Link>
            <Link href='/builder' className="fs-5 text-gradient-primary me-4">Create Form</Link>
            {/* <Link href='/' className="fs-5 text-gradient-primary me-4">My Forms</Link> */}
          </div>
          <div className="d-flex align-items-center gap-3">
            {client?(<button onClick={()=>{Cookies.remove('client');setClient("");router.push('/')}} className="btn btn-danger">Logout</button>):(<Link href='/login' className="btn btn-outline-primary">Login</Link>)}
            
            <Link href='/premium' className="btn btn-primary">Premium 💲</Link>
          </div>
        </div>
      </nav>
  );
}
