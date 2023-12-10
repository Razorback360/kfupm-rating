import Image from "next/image";
import { MenuIcon, LogoutIcon, LoginIcon } from "@heroicons/react/outline";
import { signIn, signOut, useSession } from "next-auth/react";
import logo from "@public/no-text-white-logo.png";
import { usePathname } from "next-intl/client";
import { useLocale } from "next-intl";
import React from "react";
import Loading from "~/components/Loading";
import { useRouter } from "next/router";
import Link from "next/link";
import { AlertDialogTrigger } from "~/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Skeleton } from "~/components/ui/skeleton";

const Navbar = () => {
  const {data: session} = useSession();

  const { locale, asPath } = useRouter();

  return (
    <div
      className="align-center absolute top-0 z-50 flex h-16 w-screen max-w-[100%] items-center justify-between space-x-4 bg-[#008540] p-4 pr-8 overflow-hidden"
      style={{ minWidth: "calc(100vw-3rem)" }}
    >
      <Link
        href={`${
          session && session.user.role === "admin"
            ? "/admin/dashboard"
            : "/dashboard"
        }`}
      >
        <div className="hovercard cursor-pointer">
          <Image
            src={logo}
            height={65}
            width={65}
            alt="kfupm white round logo"
          />
        </div>
      </Link>

      <Link href={asPath} locale={locale === "ar" ? "en" : "ar"}>
        <div className="hovercard hidden md:flex">
          <p className="cursor-pointer text-white">
            {locale === "ar" ? "EN" : "AR"}
          </p>
        </div>
      </Link>
      {session ? 
      <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={session?.user?.image ?? undefined} />
            <AvatarFallback>
              <Skeleton className="group-hover:border" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {session?.user?.name ?? "_NAME_NOT_FOUND_"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {session?.user?.email ?? "_EMAIL_NOT_FOUND_"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={signOut}>
            <LogoutIcon width={25} className="mr-1"/>Logout
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        
      </DropdownMenuContent>
    </DropdownMenu>

      <MenuIcon className="h-7 w-7 cursor-pointer text-white md:hidden" />
    </div>
  );
};

export default Navbar;
