import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main id="main-content" className="not-found-page">
      <div>
        <h1>That page is out of bounds.</h1>
        <p>The page may have moved, but your next lesson is still easy to find.</p>
        <Link className="button" href="/"><ArrowLeft size={18} /> Back to home</Link>
      </div>
    </main>
  );
}
