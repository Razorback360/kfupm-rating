"use client"

import Image from "next/image"
import { MenuIcon, LogoutIcon } from "@heroicons/react/outline"
import { signOut, useSession } from "next-auth/react"
import logo from "@public/no-text-white-logo.png"
import { usePathname } from "next-intl/client"
import Link from "next-intl/link"
import { useLocale } from "next-intl"
import React from "react"
import Loading from "@components/Loading"

const Navbar = () => {
	const session = useSession()


	const locale = useLocale()
	const pathname = usePathname()
	if (session.status === "loading") {
		return <Loading />
	}

		return (
			<div
				className="top-0 flex w-screen h-16 align-center space-x-4 items-center justify-between p-4 pr-8 bg-[#008540] z-50 absolute"
				style={{ minWidth: "calc(100vw-3rem)" }}
			>
				<Link href={`${ session && session.data?.user.role === "admin" ? "/admin/dashboard" : "/dashboard"}`}>
					<div className="cursor-pointer hovercard">
						<Image
							src={logo}
							height={65}
							width={65}
							alt="kfupm white round logo"
						/>
					</div>
				</Link>
				<Link href={pathname} locale={locale === "ar" ? "en" : "ar"}>
					<div className="hidden md:flex hovercard">
						<p className="cursor-pointer text-white">
							{locale === "ar" ? "EN" : "AR"}
						</p>
					</div>
				</Link>
				<div className="hidden md:flex">
					<p className="cursor-pointer text-white" onClick={() => signOut()}>
						<LogoutIcon className="h-7 cursor-pointer w-7 text-white hovercard" />
					</p>
				</div>

				<MenuIcon className="h-7 cursor-pointer w-7 md:hidden text-white" />
			</div>
		)
}

export default Navbar
