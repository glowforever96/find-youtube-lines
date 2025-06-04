export default function Input({
  onChange,
  value,
  placeholder,
}: {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  placeholder: string;
}) {
  return (
    <input
      type="text"
      onChange={onChange}
      value={value}
      placeholder={placeholder}
      className="w-[600px] px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  );
}
