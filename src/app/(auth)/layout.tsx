export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-gray-100 h-screen overflow-y-hidden flex justify-center items-center">
      <div className="w-[35%] rounded-xl bg-white flex flex-col p-6 gap-y-9 shadow-xl shadow-gray-300 max-h-[90%] overflow-y-auto">
        <p className="text-4xl font-bold text-center">
          Project<span className="text-indigo-600">Partner</span>
        </p>
        {children}
      </div>
    </div>
  );
}
