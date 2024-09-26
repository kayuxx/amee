export default function Holder({
  children,
  className
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${className || ""} "font-[500] bg-gray-800 text-white dark:bg-gray-300 py-1 px-3 dark:text-black "`}
    >
      {children}
    </div>
  );
}
