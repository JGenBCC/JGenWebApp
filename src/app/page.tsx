import Link from "next/link";
import { signInWithGoogle } from '../lib/firebase/auth';

export default function Home() {
  const message = process.env["MESSAGE"] || "Welcome to J-Gen Youth Group!";

  const handleLogin = async () => {
    try {
      const response = await signInWithGoogle();
      console.log("Login Success:", response);
    } catch (error) {
      console.log("Login Failed:", error);
    }
  };

  return (
    <main className="content">
      <h1 className="heading">J-Gen Youth Group Activities</h1>
      <p>{message}</p>

      <button onClick={handleLogin}>Sign in with Google</button>

      <section className="features">
        <article className="card">
          <h2>Community Events</h2>
          <p>
            Join us for exciting community events and activities. Learn more about our upcoming events{" "}
            <Link href="/events">
              <code>/events</code>
            </Link>.
          </p>
        </article>
        <article className="card">
          <h2>Volunteer Opportunities</h2>
          <p>
            Get involved and make a difference! Check out our volunteer opportunities{" "}
            <Link href="/volunteer">
              <code>/volunteer</code>
            </Link>.
          </p>
        </article>
      </section>
    </main>
  );
}
