import Link from "next/link";

export const QuickAddButton = () => {
  return (
    <Link
      href="/notes/new"
      className="fixed bottom-8 right-8 bg-blue-500 text-white rounded-full p-4 shadow-lg"
    >
      +
    </Link>
  );
};
