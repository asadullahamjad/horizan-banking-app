import MobileNav from "@/components/MobileNav";
import SideBar from "@/components/SideBar";
import Image from "next/image";
import '../globals.css'
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const LoggedIn= await getLoggedInUser();
  console.log("🚀 ~ LoggedIn Home Page :", LoggedIn)
  if(!LoggedIn) redirect('/sign-in')
  return (
    <main className="flex h-screen w-full font-inter">
        <SideBar user={LoggedIn}/>
        <div className="flex flex-col size-full ">
        <div className="root-layout">
          <Image src={'/icons/logo.svg'} height={34} width={34} alt="Menu" className="cursor-pointer"/>
          <div>
          <MobileNav user={LoggedIn}/>
          </div>
        </div>
        {children}
        </div>
    </main>
  );
}
