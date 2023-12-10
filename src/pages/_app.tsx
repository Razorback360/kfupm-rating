import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { NextIntlClientProvider } from "next-intl";
import Navbar from "~/components/Navbar";
import { api } from "~/utils/api";

import "~/styles/globals.css";
import { useRouter } from "next/router";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const { locale } = useRouter();
  return (
    <SessionProvider session={session}>
      <NextIntlClientProvider messages={pageProps.messages}>
      <Navbar></Navbar>
        <div
          dir={locale === "ar" ? "rtl" : "ltr"}
          className="flex min-h-screen w-screen max-w-[100%] flex-row flex-wrap items-center justify-center overflow-x-hidden  whitespace-nowrap bg-[#D9DAE4]"
        >
          <Component {...pageProps} />
        </div>
      </NextIntlClientProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
