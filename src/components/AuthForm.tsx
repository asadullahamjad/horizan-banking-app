"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { authFormSchema } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CustomInput from "./CustomInput";
import { Loader2 } from "lucide-react";
import { SignIn, SignUp } from "@/lib/actions/user.actions";
import { toast } from "react-hot-toast";
import PlaidLinks from './PlaidLinks';


const AuthForm = ({ type }: { type: string }) => {
  const [user, setUser] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const schema = authFormSchema("sign-in");
  const router = useRouter();
  // 1. Define your form.
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      address: "",
      state: "",
      postalCode: "",
      dateOfBirth: "",
      email: "",
      password: "",
      ssn: "",
      city: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      if (type === "Sign Up") {
        setIsLoading(true);
        const newUser = {
          firstName: data.firstName!,
          lastName: data.lastName!,
          address: data.address!,
          city:data.city!,
          state: data.state!,
          postalCode: data.postalCode!,
          dateOfBirth: String(data.dateOfBirth),
          email: data.email!,
          password: data.password!,
          ssn: data.ssn!,
        };
        const user = await SignUp(newUser);
        if (user?.status) {
          setUser(user);
          // form.reset();
          setIsLoading(false);
          localStorage.setItem("user", JSON.stringify(user));
          toast.success("User Registered Successfully");
          console.log("🚀 ~ onSubmit ~ Sginup user:", user);
          // router.push("/");
        } else {
          toast.error("Failed to Register");
          // form.reset();
        }
      } else if (type === "Sign in") {
        setIsLoading(true);
        const user = await SignIn(data);
        if (user.error) {
          toast.error(user.message);
          form.reset();
        } else if (user) {
            console.log("user is successfully logged in", user)
          localStorage.setItem("user", JSON.stringify(user));
          toast.success("Login Success");
          router.push("/");
          setIsLoading(false);
          form.reset();
        } else {
          toast.error("failed to Login");
        }
      } else {
        console.log("else part excute");
      }
    } catch (error: any) {
      console.log("form errors", error.message);
      // form.reset();
      toast.error(error.message);
    } finally {
      setIsLoading(false);
      // form.reset();
    }
  };
  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <nav className="flex flex-col">
          <div
            className=" flex gap-3 cursor-pointer  items-center mb-10"
          >
            <Image
              src={"icons/logo.svg"}
              height={50}
              width={50}
              alt="Horizon"
              className="size-[54px] max-xl:size-14 max-2xl:size-16 cursor-pointer"
            />
            <h1 className="font-ibm-plex-serif font-bold text-4xl text-black-1">
              Horizan
            </h1>
          </div>
        </nav>
        <div>
          <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
            {user ? "Link Account" : type === "Sign in" ? "Sign In" : "Sign UP"}
            <p className="text-16 font-normal text-gray-600">
              {user ? "Link Your Account " : "Please Enter Your Details"}
            </p>
          </h1>
        </div>
      </header>
      {user ? (
        <div className="flex flex-col gap-3">
          <PlaidLinks user={user} variants="primary" />
        </div>
      ):(
        <>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {type === "Sign Up" && (
              <>
                <div className="flex gap-2">
                  <CustomInput
                    control={form.control}
                    placeholder={"Enter First Name"}
                    type="text"
                    name="firstName"
                    label="First Name"
                  />
                  <CustomInput
                    control={form.control}
                    placeholder={"Enter Last Name"}
                    type="text"
                    name="lastName"
                    label="Last Name"
                  />
                </div>
                <CustomInput
                  control={form.control}
                  placeholder={"Enter Address"}
                  type="text"
                  name="address"
                  label="Your Address"
                />
                <CustomInput
                    control={form.control}
                    placeholder={"Enter City"}
                    type="text"
                    name="city"
                    label="City"
                  />
                <div className="flex gap-2">
                  <CustomInput
                    control={form.control}
                    placeholder={"Enter State"}
                    type="text"
                    name="state"
                    label="State"
                  />
                  <CustomInput
                    control={form.control}
                    placeholder={"Enter Postal Code "}
                    type="text"
                    name="postalCode"
                    label="Postal Code"
                  />
                </div>
                <div className="flex gap-2">
                  <CustomInput
                    control={form.control}
                    placeholder={"YYYY-MM-DD"}
                    type="date"
                    name="dateOfBirth"
                    label="Date Of Birth"
                  />
                  <CustomInput
                    control={form.control}
                    placeholder={"ex : 1234"}
                    type="text"
                    name="ssn"
                    label="SSN"
                  />
                </div>
              </>
            )}
            <CustomInput
              control={form.control}
              placeholder={"Enter Your Email"}
              type="email"
              name="email"
              label="Email"
            />
            <CustomInput
              control={form.control}
              placeholder={"Enter Your Password"}
              type="password"
              name="password"
              label="Password"
            />
            <div className="flex flex-col">
              <Button
                type="submit"
                className="form-btn tracking-wide	"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin " />
                    &nbsp; Please Wait...
                  </>
                ) : type === "Sign in" ? (
                  "Sign In "
                ) : (
                  "Sign Up"
                )}
              </Button>
            </div>
          </form>
        </Form>
        <footer className="flex justify-center gap-2">
          <p className="font-normal text-14 text-gray-700">
            {type === "Sign in"
              ? "Don't have an Account ?"
              : "Already have an Account ?"}
          </p>
          <Link
            href={type === "Sign in" ? "/sign-up" : "/sign-in"}
            className="form-link"
          >
            {type === "Sign in" ? "Sign Up" : "Sign In"}
          </Link>
        </footer>
      </>
       )} 
    </section>
  );
};

export default AuthForm;
