import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { NextIntlClientProvider } from 'next-intl';

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { useRouter } from "next/router";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const { locale } = useRouter()
  return (
    <SessionProvider session={session}>
      <NextIntlClientProvider messages={pageProps.messages}>
        <div dir={locale === "ar" ? "rtl" : "ltr"} className="flex justify-center items-center min-h-screen bg-[#D9DAE4] flex-row flex-wrap w-screen">
          <Component {...pageProps} />
        </div>
      </NextIntlClientProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
