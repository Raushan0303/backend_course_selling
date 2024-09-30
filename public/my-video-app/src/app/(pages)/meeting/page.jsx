"use client"

import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [name, setName] = useState("");

  return (
    <div className="container">
      <h1>Start a Meeting</h1>
      <input
        type="text"
        placeholder="Enter Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      {name.trim() !== "" && ( // Only show the link if the name is not empty
        <Link href={`/room/${name}`}>
          <button>Start Meeting</button>
        </Link>
      )}
    </div>
  );
}
