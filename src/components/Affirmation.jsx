
import React, { useEffect, useState } from "react";

export default function Affirmation() {
  const [quote, setQuote] = useState("");

  useEffect(() => {
  const today = new Date().toISOString().split("T")[0];

  fetch("/affirmations.json")
    .then((res) => res.json())
    .then((data) => {
      const todayAffirmation = data.find((item) => item.date === today);
      setQuote(todayAffirmation?.quote || "You are doing great!");
    })
    .catch(() => setQuote("You are doing great!"));
}, []);


  return (
    <div className=" rounded-xl  p-6 text-center">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Daily Affirmation</h2>
      <p className="text-gray-500 italic">"{quote}"</p>
    </div>
  );
}
