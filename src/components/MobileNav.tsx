"use client";
import { Sheet, SheetContent, SheetTrigger ,SheetClose} from "@/components/ui/sheet";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import Footer from "./Footer";
const MobileNav = ({ user }: MobileNavProps) => {
  const pathName = usePathname();
  const SideBarLinks = sidebarLinks.map((item) => {
    const ActiveState =
      pathName === item.route || pathName.startsWith(`${item.label}/`);
    return (
      <SheetClose asChild key={item.label}>
      <Link
        href={item.route}
        key={item.label}
        className={cn("flex py-3 rounded-lg gap-4 items-center justify-center", { "bg-bank-gradient": ActiveState })}
      >
        <div className="relative size-6">
          <Image
            src={item.imgURL}
            fill
            alt={item.label}
            className={cn({ "brightness-[3] invert-0": ActiveState })}
          />
        </div>
        <p className={cn("text-black-1", { "!text-white": ActiveState })}>
          {item.label}
        </p>
      </Link>
      </SheetClose>
    );
  });

  return (
    <section className="w-full max-w-[264px]">
      <Sheet>
        <SheetTrigger>
          <Image
            src={"/icons/hamburger.svg"}
            height={30}
            width={30}
            alt="menu"
            className="cursor-pointer"
          />
        </SheetTrigger>
        <SheetContent className="border-none bg-white">
          <nav className="flex flex-col gap-4">
            <Link
              href={"/"}
              className="cursor-pointer flex gap-8 items-center justify-center mb-10"
            >
              <Image
                src={"icons/logo.svg"}
                height={34}
                width={34}
                alt="Horizon"
                className="size-[24px] max-xl:size-14 max-2xl:size-16"
              />
              <h1 className="font-ibm-plex-serif font-bold text-26">Horizan</h1>
            </Link>
            {SideBarLinks}
            USER
          </nav>
          <Footer user={user} type="mobile"/>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNav;
