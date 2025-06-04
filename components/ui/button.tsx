export default function Button({
  onClick,
  text,
}: {
  onClick: () => void;
  text: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-fit p-4 flex items-center justify-center rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors cursor-pointer`}
    >
      {text}
    </button>
  );
}
