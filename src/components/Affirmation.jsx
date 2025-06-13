import React from "react";

const affirmations = [
  "I am growing every day in my career and mindset.",
  "Challenges are opportunities for growth.",
  "My efforts are building a better future.",
  "Every step I take brings me closer to my goals.",
];

export default function Affirmation() {
    const [affirmation, setAffirmation] = useState("");

   useEffect(() => {
    const index = new Date().getDate() % affirmations.length;
    setAffirmation(affirmations[index]);
  }, []);

  return (
    <div className="alert alert-info shadow-lg mb-4">
      <span>{affirmation}</span>
    </div>
  );
}