import React from "react"
import logo from "@public/no-text-white-logo.png"
import Image from "next/image"

export default function Logo({ scale = 0.5 }) {
	return (
		<div style={{ marginTop: -10 }}>
			<Image
				style={{ transform: `scale(${scale + 0.5})` }}
				src={logo}
				objectFit="scale-down"
				alt="white round kfupm logo"
			/>
		</div>
	)
}
