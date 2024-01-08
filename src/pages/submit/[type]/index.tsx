import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import { useTranslations } from "next-intl"
import { type GetServerSidePropsContext} from "next";
import Card from "~/components/Card";
import { useRouter } from "next/router";

export default function SubmitAccess() {
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
            <div className="flex w-auto md:w-1/2 bg-white rounded-xl h-auto md:h-[30vw] flex-wrap justify-center p-5 ">
                <p className="text-3xl font-extrabold border-black border-b w-full text-center pt-5 mb-5 h-1/6 items-center justify-center">
                    {translation("Header")}
                </p>
                <Card
                    cardTitle={translation("SubmitRatingAnon")}
                    onClick={async () => {
                        await router.push(`/submit/${router.query.type as string}/anonymous`)
                    }}
                />
                <Card
                    cardTitle={translation("SubmitRatingUser")}
                    onClick={async () => {
                        if (session.status === "authenticated") {
                            await router.push(`/submit/${router.query.type as string}/user`)
                        } else {
                            await signIn()
                        }
                    }}
                />
            </div>
        </>
    );
}


export async function getServerSideProps({ locale }: GetServerSidePropsContext) {
    return {
        props: {
            messages: (await import(`~/messages/${locale}.json`)).default,
            fallback: true
        }
    };
}
