"use client";
import { useState } from "react";
import axios from 'axios';

export default function Home() {
    const [name, setName] = useState("");

    // Function to handle the creation of a new meeting
    const startMeeting = async () => {
        if (name.trim() === "") return;
    
        try {
            // Make the request using axios
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/create-meeting/${encodeURIComponent(name)}`);
            
            console.log("response", response);
    
            // Check if response is successful
            if (response.status !== 200) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = response.data;
            // Assuming the backend sends back the redirect URL
            window.location.href = data.redirectUrl; // Redirect to the new meeting
        } catch (error) {
            alert('Error creating meeting: ' + error.message);
        }
    };
     
  
  
    return (
        <div className="container">
            <h1>Start a Meeting</h1>
            <input
                type="text"
                placeholder="Enter Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <button onClick={startMeeting} disabled={name.trim() === ""}>
                Start Meeting
            </button>
        </div>
    );
}
