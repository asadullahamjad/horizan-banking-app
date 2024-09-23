import React from "react";
import Header from "@/components/Header";
import TotalBalanceBox from "@/components/TotalBalanceBox";
import RightSideBar from "@/components/RightSideBar";
import '../globals.css'
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { getAccount, getAccounts } from "@/lib/actions/bank.actions";
import RecentTransactions from "@/components/RecentTransactions";
const Home = async({searchParams:{id,page}}:SearchParamProps) => {
  const currentPage=Number(page as string)|| 1;
  const loggedInUser = await getLoggedInUser()
  // console.log("🚀 ~ Home line 12 ~ loggedInUser from appwrite:", loggedInUser)
  //  get banks accounts 
  const accounts= await getAccounts({userId:loggedInUser?.$id})
  // console.log("🚀 ~ Home line 15 ~  get bank accounts for user:", accounts)
  if(!accounts) return ;
  const accountsData= accounts.data;
  // console.log("🚀 ~ Home ~ getting user accountsData: line 18 ", accountsData)
 const appWriteItemID=(id as string)||accountsData[0]?.appwriteItemId;
//  console.log("🚀 ~ Home ~ appWriteItemID line 20 for getting user Account:", appWriteItemID)
 const account= await getAccount(appWriteItemID);
//  console.log("🚀 ~ Home ~ get bank account line 20 root:", account)

//  console.log("accounts home information",{account,accounts})
  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <Header
            type="greeting"
            title="Welcome"
            user={loggedInUser?.firstName}
            subtext="Access and Manage you Bank Account Transactions efficiently"
          />
          <TotalBalanceBox
            accounts={accountsData}
            totalBanks={accounts?.totalBanks}
            totalCurrentBalance={accounts?.totalCurrentBalance}
          />
        </header>
        <RecentTransactions 
        accounts={accountsData}
        transactions={account?.transactions}
        appwriteItemId={appWriteItemID}
        page={currentPage}
        />
      </div>
      <div>
        <RightSideBar 
        transactions={accounts?.transactions}
        banks={accountsData?.slice(0,2)}
        user={loggedInUser}
        />
      </div>
    </section>
  );
};

export default Home;
