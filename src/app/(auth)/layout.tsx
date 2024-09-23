import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-full w-full flex items-center justify-between font-inter">
        {children}
        <div className="auth-asset ">
          <div>

          <Image src={'/icons/auth-image.svg'} alt="auth image" width={500} height={500}/>
          </div>
        </div>
    </main>
  );
}
