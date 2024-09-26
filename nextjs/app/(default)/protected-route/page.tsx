export default function Page() {
  return (
    <div className="flex items-center flex-col">
      <h1>This is a Protected Route</h1>
      <p>You are seeing this page because you have been authenticated!</p>
    </div>
  );
}
