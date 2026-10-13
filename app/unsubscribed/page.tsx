export default function UnsubscribedPage({
  searchParams,
}: {
  searchParams: { ok?: string };
}) {
  const ok = searchParams.ok !== "0";

  return (
    <main>
      <h1>{ok ? "Unsubscribed" : "Link invalid"}</h1>
      <p>
        {ok
          ? "You won't get any more IPO emails from us."
          : "That unsubscribe link is invalid or already used."}
      </p>
    </main>
  );
}
