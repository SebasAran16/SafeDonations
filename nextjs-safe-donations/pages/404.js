import Link from "next/link";

export default function NoPage() {
  return (
    <div>
      <div>
        <h1>Oh, we got a problem...</h1>
        <h2>The page you are searching for does not exist</h2>
        <p>
          Go back to the <Link href="/">home page</Link>
        </p>
      </div>
    </div>
  );
}
