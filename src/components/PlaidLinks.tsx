import React, { useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  PlaidLinkOnSuccess,
  usePlaidLink,
  PlaidLinkOptions,
} from "react-plaid-link";
import {
  CreateLinkToken,
  exchangePublicToken,
} from "@/lib/actions/user.actions";
import Image from "next/image";
const PlaidLinks = ({ user, variants }: PlaidLinkProps) => {
  const [token, settoken] = useState("");

  const onSuccess = useCallback<PlaidLinkOnSuccess>(
    async (public_token: string) => {
      await exchangePublicToken({
        publicToken: public_token,
        user,
      });
    },
    [user]
  );

  useEffect(() => {
    const getLinkToken = async () => {
      const data = await CreateLinkToken(user);
      // console.log("🚀 ~ getLinkToken ~ data <PlaidLinks ></PlaidLinks>:", data);
      settoken(data?.linkToken);
    };
    getLinkToken();
  }, [user]);
  const config: PlaidLinkOptions = {
    token,
    onSuccess,
  };
  const { open, ready } = usePlaidLink(config);
  return (
    <div>
      {variants === "primary" ? (
        <Button
          className="plaidlink-primary"
          onClick={() => open()}
          disabled={!ready}
        >
          Connect Bank
        </Button>
      ) : variants === "ghost" ? (
        <Button
          className="plaidlink-ghost"
          variant={"ghost"}
          onClick={() => open()}
        >
          <Image
            src="/icons/connect-bank.svg"
            alt="connect bank"
            height={24}
            width={24}
          />
          <p className=" hidden text-[16px] font-semibold text-black-2 xl:block">
            Connect Bank
          </p>
        </Button>
      ) : (
        <Button className="plaidlink-default" onClick={() => open()}>
          <Image
            src="/icons/connect-bank.svg"
            alt="connect bank"
            height={24}
            width={24}
          />
          <p className="text-[16px] font-semibold text-black-2">Connect Bank</p>
        </Button>
      )}
    </div>
  );
};

export default PlaidLinks;
