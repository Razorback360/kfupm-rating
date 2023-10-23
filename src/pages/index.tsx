import { useSession } from "next-auth/react";
import Head from "next/head";
import { useTranslations } from "next-intl"

import { api } from "~/utils/api";
import { type GetStaticPropsContext } from "next";
import Card from "~/components/Card";
import { useRouter } from "next/router";

export default function Landing() {
  const hello = api.post.hello.useQuery({ text: "from tRPC" });
  // HOOKS
  const translation = useTranslations("Landing")
  // const locale = useLocale()
  const session = useSession()
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Landing</title>
        <meta name="description" content="Landing page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex w-auto md:w-1/2 bg-white rounded-xl h-auto md:h-[30vw] flex-wrap justify-center p-5 md:mt-5 mt-20 mb-5 m-5 ">
        <p className="text-3xl font-extrabold border-black border-b w-full text-center pt-5 mb-5 h-1/6 items-center justify-center">
          {translation("Header")}
        </p>
        <Card
          cardTitle={translation("Evaluation")} 
          onClick={async() => {
            await router.push("/submit/evaluation")
          }}
        />
        <Card
          cardTitle={translation("Note")}
          onClick={async() => {
            await router.push("/submit/note")
          }}
        />
        <Card
          cardTitle={translation("Complaint")}
          onClick={async() => {
            await router.push("/submit/complaint")
          }}
        />
        <Card
          cardTitle={translation("Suggestion")}
          onClick={async() => {
            await router.push("/submit/suggestion")
          }}
        />
        <Card
          cardTitle={translation("Other")}
          onClick={async() => {
            await router.push("/submit/other")
          }}
        />
      </div>
    </>
  );
}


export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: (await import(`~/messages/${locale}.json`)).default
    }
  };
}
