import React from "react"

export default function Notification({
	cardTitle = "",
	onClick = () => {},
	layout = "",
}) {
	return (
		<div
			onClick={onClick}
			className={`shrink-0 rounded-xl w-auto h-auto relative cursor-pointe bg-kfupm-dark-green m-5 mb-0 justify-center flex flex-col items-center hover:border-white hover:cursor-pointer border border-transparent hovercard ${layout}`}
		>
			<p className="m-2 text-lg md:text-xl text-white">{cardTitle}</p>
		</div>
	)
}
