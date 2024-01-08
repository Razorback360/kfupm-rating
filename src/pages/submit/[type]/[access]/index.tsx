import { useSession } from "next-auth/react";
import Head from "next/head";
import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import { api } from "~/utils/api";
import { type GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import Input from "~/components/Input";
import Button from "~/components/Button";
import { useState } from "react";
import { StarIcon } from "@heroicons/react/outline";

export default function SubmitAccess() {
  const [inputs, setInputs] = useState({
    title: "",
    area: "",
    description: "",
    name: "",
    phone: "",
    email: "",
  });
  const [count, setCount] = useState(0);
  const mutationLoggedIn = api.submission.submitLoggedIn.useMutation();
  const mutation = api.submission.submit.useMutation();
  const handleChange = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };
  const router = useRouter();
  const handleSubmit = () => {
    if (
      inputs.area &&
      inputs.title &&
      inputs.description &&
      (router.query.type as string) !== "evaluation"
    ) {
      session.status === "authenticated" && router.query.access !== "anonymous"
        ? mutationLoggedIn.mutate({
            ...inputs,
            type: router.query.type as string,
          })
        : mutation.mutate({ ...inputs, type: router.query.type as string });
    } else if (inputs.area && inputs.title && inputs.description && count > 0) {
      session.status === "authenticated" && router.query.access !== "anonymous"
        ? mutationLoggedIn.mutate({
            ...inputs,
            type: router.query.type as string,
            rating: count,
          })
        : mutation.mutate({
            ...inputs,
            type: router.query.type as string,
            rating: count,
          });
    }
  };
  // HOOKS
  const translation = useTranslations("Submit");
  // const locale = useLocale()
  const session = useSession();

  if (session.status === "loading") {
    return <p>Loading...</p>
  }

  if (session.status === "unauthenticated" && router.query.access !== "anonymous") {
    return signIn()
  }
  return (
    <>
      <Head>
        <title>Landing</title>
        <meta name="description" content="Landing page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className=" mb-3 mt-20 flex h-auto w-auto flex-wrap justify-center rounded-xl bg-white p-5 md:w-1/2">
        <p className="mb-5 h-1/6 w-full items-center justify-center border-b border-black pt-5 text-center text-3xl font-extrabold">
          {translation("Header")}
        </p>
        <div className="flex w-full flex-col">
          <div className="m-3 mb-1 flex w-full flex-col">
            <p className="m-1 mb-1 font-extrabold">
              {translation("Mandatory")}
            </p>
            <p className="m-1 mb-1 font-extrabold">{translation("Title")}*</p>
            <Input
              className="h-1/4 w-1/2 md:w-1/4"
              name="title"
              onChange={handleChange}
            ></Input>
          </div>
          <div className="m-3 mb-1 flex w-full flex-col">
            <p className="m-1 mb-1 items-center font-extrabold">
              {translation("Area")}*
            </p>
            <Input
              className="h-1/4 w-3/4 md:w-1/2"
              name="area"
              onChange={handleChange}
            ></Input>
          </div>
          <div className="m-3 mb-1 flex w-full flex-col">
            <p className="m-1 mb-1 items-center font-extrabold">
              {translation("Description")}*
            </p>
            <div className={"relative block w-full"}>
              <textarea
                name="description"
                onChange={handleChange}
                className="border-kfupm-dark-green w-full rounded-md border-2 border-opacity-60 p-3 outline-none transition focus:bg-opacity-50"
              />
            </div>
          </div>
          <div className={`m-3 mb-1 mt-1 flex w-full flex-col ${router.query.type as string !== "evaluation" ? "hidden" : ""}`}>
            <p className="m-1 mb-1 font-extrabold">{translation("Rating")}</p>
            <div className="flex flex-row-reverse justify-end">
              <StarIcon
                onClick={() => {
                  setCount(5);
                }}
                id="star1"
                className={`peer h-7 w-7 hover:fill-yellow-400 peer-hover:fill-yellow-400 ${
                  count >= 5 ? "fill-yellow-400" : ""
                }`}
              ></StarIcon>
              <StarIcon
                onClick={() => {
                  setCount(4);
                }}
                id="star2"
                className={`peer h-7 w-7 hover:fill-yellow-400 peer-hover:fill-yellow-400 ${
                  count >= 4 ? "fill-yellow-400" : ""
                }`}
              ></StarIcon>
              <StarIcon
                onClick={() => {
                  setCount(3);
                }}
                id="star3"
                className={`peer h-7 w-7 hover:fill-yellow-400 peer-hover:fill-yellow-400 ${
                  count >= 3 ? "fill-yellow-400" : ""
                }`}
              ></StarIcon>
              <StarIcon
                onClick={() => {
                  setCount(2);
                }}
                id="star4"
                className={`peer h-7 w-7 hover:fill-yellow-400 peer-hover:fill-yellow-400 ${
                  count >= 2 ? "fill-yellow-400" : ""
                }`}
              ></StarIcon>
              <StarIcon
                onClick={() => {
                  setCount(1);
                }}
                id="star5"
                className={`peer h-7 w-7 hover:fill-yellow-400 peer-hover:fill-yellow-400 ${
                  count >= 1 ? "fill-yellow-400" : ""
                }`}
              ></StarIcon>
            </div>
          </div>
        </div>
        {session.status === "unauthenticated" || router.query.access === "anonymous" ? (
          <div className="flex w-full flex-col">
            <p className="m-1 mt-3 font-extrabold">{translation("Info")}</p>
            <div className="m-3 mb-1 flex w-full flex-col">
              <p className="m-1 font-extrabold">{translation("Name")}</p>
              <Input
                className=" h-1/4 w-1/2 md:w-1/4"
                name="name"
                onChange={handleChange}
              ></Input>
            </div>
            <div className="m-3 mb-1 flex w-full flex-col">
              <p className="m-1 mb-1 items-center font-extrabold">
                {translation("Phone")}
              </p>
              <Input
                className="h-1/4 w-1/2 md:w-1/4"
                name="phone"
                onChange={handleChange}
              ></Input>
            </div>
            <div className="m-3 flex w-full flex-col">
              <p className="m-1 items-center font-extrabold">
                {translation("Email")}
              </p>
              <Input
                className="h-1/4 w-1/2 md:w-1/4"
                name="email"
                onChange={handleChange}
              ></Input>
            </div>
          </div>
        ) : (
          ""
        )}

        <Button
          className="bg-kfupm-dark-green m-3 w-full py-3 text-white"
          onClick={async() => {
            handleSubmit()
            await router.push("/")
          }}
        >
          {translation("Button")}
        </Button>
      </div>
    </>
  );
}

export async function getServerSideProps({
  locale,
}: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`~/messages/${locale}.json`)).default,
      fallback: true,
    },
  };
}
