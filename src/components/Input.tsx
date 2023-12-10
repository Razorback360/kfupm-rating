import React from "react"

//@ts-ignore
export default function Input({ icon: Icon, ...props }) {
	return (
		<div className={"relative block w-full " + props.className}>
			{Icon && <Icon className="w-5 h-5 absolute ml-[14px] mt-[13px] text-black"/>}

			<input
				{...props}
				className="w-full p-3 border-kfupm-dark-green border-opacity-60 border-2 focus:bg-opacity-50 transition outline-none rounded-md"
			/>
		</div>
	)
}
