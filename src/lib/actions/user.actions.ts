"use server";
import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { cookies } from "next/headers";
import { encryptId, extractCustomerIdFromUrl, parseStringify } from "../utils";
import {
  CountryCode,
  ProcessorTokenCreateRequestProcessorEnum,
  Products,
  ProcessorTokenCreateRequest,
} from "plaid";
import { plaidClient } from "../plaid";
import { revalidatePath } from "next/cache";
import { addFundingSource, createDwollaCustomer } from "./dwolla.actions";

//  get data from env file
const {
  APPWRITE_DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID,
  APPWRITE_BANK_COLLECTION_ID,
  APPWRITE_TRANSACTION_COLLECTION_ID,
} = process.env;

export const getUserInfo = async ({ userId }: getUserInfoProps) => {
  console.log("🚀 ~ getUserInfo ~ userId:", userId)
  try {
    const { database } = await createAdminClient();

    const user = await database.listDocuments(
      APPWRITE_DATABASE_ID!,
      APPWRITE_USER_COLLECTION_ID!,
      [Query.equal("userId", [userId])]
    );
    console.log("🚀 ~ getUserInfo ~ user from database using query :", user);
    return parseStringify(user.documents[0]);
  } catch (error: any) {
    console.log("error while fetching User-information: ", error.message);
  }
};
export const SignIn = async ({ email, password }: signInProps) => {
  try {
    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);
    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    console.log("🚀 ~ SignIn ~ ession.userId:", session.userId);
    const user = await getUserInfo({ userId: session.userId });
    console.log("🚀 ~ SignIn ~ get user data from database >>>:", user)
    return parseStringify(user);
  } catch (error: any) {
    console.log("eSign in error ", error.message);
    return { error: true, message: error.message };
  }
};
export const SignUp = async (data: SignUpParams) => {
  const { email, password, firstName, lastName } = data;
  let newUserAccount;
  try {
    const { account, database } = await createAdminClient();
    newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`
    );
    // throw error if any error occurs in user Creation
    if (!newUserAccount) throw Error("Error While creating user");
    // Now create Dwolla customer url
    const dwollaCustomerUrl = await createDwollaCustomer({
      ...data,
      address1: data.address,
      type: "personal",
    });
    if (!dwollaCustomerUrl)
      throw new Error("Error while creating dwolla customer url");
    // Now create dwolla Customer Id
    const dwollaCustomerId = await extractCustomerIdFromUrl(dwollaCustomerUrl);

    // create user in database
    const newUser = await database.createDocument(
      APPWRITE_DATABASE_ID!,
      APPWRITE_USER_COLLECTION_ID!,
      ID.unique(),
      {
        ...data,
        userId: newUserAccount.$id,
        dwollaCustomerId,
        dwollaCustomerUrl,
      }
    );
    console.log("🚀 ~ newUser ~ SignUP User:", newUser);
    const session = await account.createEmailPasswordSession(email, password);
    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
    console.log("create user", newUser);
    return parseStringify({ ...newUser, status: true });
  } catch (error: any) {
    console.log("Sign Up error ", error.message);
    return null;
  }
};
export const getLoggedInUser = async () => {
  try {
    const { account } = await createSessionClient();
    const results = await account.get();
    // console.log("🚀 ~ getLoggedInUser ~ Account session results:", results);
    const user = await getUserInfo({ userId: results?.$id });
    // console.log("🚀 ~ getLoggedInUser ~Login user:", user);
    return parseStringify(user);
  } catch (error: any) {
    console.log("error while getting logged in user", error.message);
    return null;
  }
};
export const logout = async () => {
  try {
    const { account } = await createSessionClient();
    cookies().delete("appwrite-session");
    const logout = await account.deleteSession("current");
    return logout;
  } catch (error: any) {
    console.log("Error while logout", error.message);
    return null;
  }
};
export const CreateLinkToken = async (user: User) => {
  try {
    const tokenParams = {
      user: {
        client_user_id: user.$id,
      },
      client_name: `${user.firstName} ${user.lastName}`,
      products: ["auth"] as Products[],
      language: "en",
      country_codes: ["US"] as CountryCode[],
    };
    const response = await plaidClient.linkTokenCreate(tokenParams);
    console.log("🚀 ~ CreateLinkToken ~  function => response:", response);
    return parseStringify({ linkToken: response.data.link_token });
  } catch (error: any) {
    console.log("🚀 ~ CreateLinkToken ~ error:", error.message);
    return null;
  }
};
export const createBankAccount = async ({
  accessToken,
  userId,
  accountId,
  bankId,
  fundingSourceUrl,
  shareableId,
}: createBankAccountProps) => {
  try {
    const { database } = await createAdminClient();
    const bankAccount = await database.createDocument(
      APPWRITE_DATABASE_ID!,
      APPWRITE_BANK_COLLECTION_ID!,
      ID.unique(),
      {
        accessToken,
        userId,
        accountId,
        bankId,
        fundingSourceUrl,
        shareableId,
      }
    );
    return parseStringify(bankAccount);
  } catch (error: any) {
    console.log("error while creating bank account ", error);
  }
};

export const exchangePublicToken = async ({
  publicToken,
  user,
}: ExchangePublicTokenParams) => {
  try {
    console.log("exchange funciton console ", user);
    // Exchange public token to access token
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });
    const accessToken = response.data.access_token;
    const itemID = response.data.item_id;

    //  getting accounts information from palid
    const accountResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });
    const accountData = accountResponse.data.accounts[0];

    //  Generate processer token for dwolla using access token and account id
    const request: ProcessorTokenCreateRequest = {
      access_token: accessToken,
      account_id: accountData.account_id,
      processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
    };

    const processerTokenResponse = await plaidClient.processorTokenCreate(
      request
    );
    const processorToken = processerTokenResponse.data.processor_token;

    // create a funding source url for account using dwolla customer id processorToken and bankName
    const fundingSourceUrl = await addFundingSource({
      dwollaCustomerId: user?.dwollaCustomerId,
      processorToken,
      bankName: accountData.name,
    });
    // if funding source url is not create throw an Error
    if (!fundingSourceUrl) throw Error;

    // create a bank account using user ID account ID item ID funding source url access token and shareable id
    const createdBankAccount = await createBankAccount({
      userId: user["$id"] || user.userId,
      bankId: itemID,
      accountId: accountData.account_id,
      accessToken,
      fundingSourceUrl,
      shareableId: encryptId(accountData.account_id),
    });
    console.log(
      "created Bank Account in exchange token function",
      createdBankAccount
    );
    // revalidate the path to reflect the changes
    revalidatePath("/");
    return parseStringify({
      publicTokenExchange: "complete",
    });
  } catch (error: any) {
    console.log("🚀 ~ CreateLinkToken ~ error:", error.message);
    return null;
  }
};

// get Banks
export const getBanks = async ({userId} : getBanksProps) => {
  console.log("🚀 ~ getBanks ~ userId:", userId)
  try {
    const { database } = await createAdminClient();

    const banks = await database.listDocuments(
      APPWRITE_DATABASE_ID!,
      APPWRITE_BANK_COLLECTION_ID!,
      [Query.equal("userId", [userId])]
    );
    return parseStringify(banks.documents);
  } catch (error: any) {
    console.log("error while fetching banks details", error.message);
  }
};
//  get bank
export const getBank = async ({documentId}:getBankProps ) => {
  try {
    const { database } = await createAdminClient();

    const bank = await database.listDocuments(
      APPWRITE_DATABASE_ID!,
      APPWRITE_BANK_COLLECTION_ID!,
      [Query.equal("$id", [documentId])]
    );
    return parseStringify(bank.documents[0]);
  } catch (error: any) {
    console.log("error while fetching single bank details", error.message);
  }
};
export const getBankByAccountId = async ({
  accountId,
}: getBankByAccountIdProps) => {
  try {
    const { database } = await createAdminClient();

    const bank = await database.listDocuments(
      APPWRITE_DATABASE_ID!,
      APPWRITE_BANK_COLLECTION_ID!,
      [Query.equal("accountId", [accountId])]
    );

    if (bank.total !== 1) return null;

    return parseStringify(bank.documents[0]);
  } catch (error) {
    console.log(error);
  }
};
