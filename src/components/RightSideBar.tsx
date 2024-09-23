import Image from "next/image";
import Link from "next/link";
import React from "react";
import BankCard from "./BankCard";

const RightSideBar = ({ user, transactions, banks }: RightSidebarProps) => {
  return (
    <aside className="right-sidebar">
      <section className="flex flex-col pb-8">
        <div className="profile-banner"></div>
        <div className="profile">
          <div className="profile-img">
            <span className="text-5xl text-blue-600 font-bold">
              {user?.firstName[0].toUpperCase()}
            </span>
          </div>

          <div className="profile-details">
            <h1 className="profile-name">
              {user?.firstName} {user?.lastName}
            </h1>
            <p className="profile-email">{user?.email}</p>
          </div>
        </div>
      </section>
      {/* banks sections */}
      <section className="banks">
        <div className="flex justify-between w-full">
          <h2 className="header-2">My Banks</h2>
          <Link href={"/"} className="flex gap-2">
            <Image src={"/icons/plus.svg"} width={20} height={20} alt="Plus " />
            <h3 className="text-14 text-gray-500">Add Banks</h3>
          </Link>
        </div>
        {banks.length > 0 && (
          <div className="relative flex flex-col justify-center items-center gap-5">
            <div className="relative z-10">
              <BankCard
                key={banks[0]?.$id}
                account={banks[0]}
                userName={`${user?.firstName} ${user?.lastName}`}
                showBalance={false}
              />
            </div>
            {banks[1] && (
              <div className="absolute right-0 top-8  z-0 w-[90%]">
                <BankCard
                  key={banks[1]?.$id}
                  account={banks[1]}
                  userName={`${user?.firstName} ${user?.lastName}`}
                  showBalance={false}
                />
              </div>
            )}
          </div>
        )}
      </section>
    </aside>
  );
};

export default RightSideBar;
