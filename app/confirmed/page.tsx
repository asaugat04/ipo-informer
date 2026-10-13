export default function ConfirmedPage({
  searchParams,
}: {
  searchParams: { ok?: string };
}) {
  const ok = searchParams.ok !== "0";

  return (
    <main>
      <h1>{ok ? "Subscription confirmed" : "Link invalid"}</h1>
      <p>
        {ok
          ? "You're in — we'll email you the moment a new IPO opens."
          : "That confirmation link is invalid or already used."}
      </p>
    </main>
  );
}
