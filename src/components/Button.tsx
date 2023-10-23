import React from "react"

export default function Button({
	children,
	onClick = () => {},
	className = "",
	type = "button",
}) {
	return (
		<button
			onClick={onClick}
			className={`px-6 py-1 rounded-md ${className}`}
			type={type}
			onSubmit={(e) => {
				onClick()
				e.preventDefault}}
		>
			{children}
		</button>
	)
}
