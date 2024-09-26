export function ShowDetails({ rawData }: { rawData: object }) {
  return (
    <details className="group w-full max-w-[600px] border py-1 cursor-pointer mt-4">
      <summary className="marker:ml-2 group-open:border-b py-1 pl-4">
        Show User Session
      </summary>
      <pre className="max-w-full overflow-auto break-words">
        <code>{JSON.stringify(rawData, null, 2)}</code>
      </pre>
    </details>
  );
}
