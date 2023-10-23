import React from "react"

export default function Card({ cardTitle = "", onClick = () => {} }) {
	return (
		<div
			onClick={onClick}
			className={`shrink-0 rounded-xl w-64 text-center md:w-80 md:h-28 h-24 relative cursor-pointer bg-kfupm-dark-green m-5 justify-center flex flex-col items-center hover:border-white hover:cursor-pointer border border-transparent hovercard`}
		>
			<p className="m-2 text-lg md:text-xl text-white">{cardTitle}</p>
		</div>
	)
}
