import React from "react"

export default function Alert({ text = "", className = ""}) {
	return (
		<div className={` flex gap-2 items-center justify-center p-3 rounded-md text-white w-full ${className}`}>
			{text}
		</div>
	)
}
