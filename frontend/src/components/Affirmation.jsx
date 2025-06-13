import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Affirmation() {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/quote").then((res) => setQuote(res.data.quote));
  }, []);

  return (
    <div className="alert alert-info shadow-lg mb-4">
      <span>{quote}</span>
    </div>
  );
}