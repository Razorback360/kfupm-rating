import { type Session } from "next-auth";
import { SessionProvider, signIn } from "next-auth/react";
import { type AppType } from "next/app";
import { NextIntlClientProvider } from "next-intl";
import Navbar from "~/components/Navbar";
import { api } from "~/utils/api";

import "~/styles/globals.css";
import { useRouter } from "next/router";
import Button from "~/components/Button";

const SetupPage = () => {
  return(
    <>
      <div className="m-5 mb-5 mt-20 flex h-auto w-auto flex-wrap justify-center rounded-xl bg-white p-5 md:mt-5 md:w-1/2 flex-col">
        <p className="mb-5 h-1/6 w-full items-center justify-center border-b border-black pt-5 text-center text-3xl font-extrabold">
          Initial Setup
        </p>
        <div className="flex flex-col justify-center items-center m-10">
        <p className="flex flex-col m-10 w-auto md:w-1/2 flex-wrap h-auto whitespace-normal text-center">
          Please sign in with a university associated account to set the account as a system adminstrator: 
        </p>
        <Button className="bg-kfupm-dark-green text-white" onClick={() => {signIn("azure-ad")}}>Sign In</Button>
        </div>
      </div>
    </>
  )
}

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const { locale } = useRouter();
  const setupStatus = api.setup.status.useQuery();
  return (
    <SessionProvider session={session}>
      <NextIntlClientProvider messages={pageProps.messages}>
      <Navbar></Navbar>
        <div
          dir={locale === "ar" ? "rtl" : "ltr"}
          className="flex min-h-screen w-screen max-w-[100%] flex-row flex-wrap items-center justify-center overflow-x-hidden  whitespace-nowrap bg-[#D9DAE4]"
        >
          {setupStatus.data?.status? <Component {...pageProps} /> : <SetupPage></SetupPage>}
        </div>
      </NextIntlClientProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
