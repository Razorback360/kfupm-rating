import React from "react"

//@ts-ignore
export default function Modal({ hidden = true, onClick = () => {}, children }) {
	return (
		<div
			className={`fixed top-0 bottom-0 left-0 right-0 h-[100vh] min-h-screen bg-black bg-opacity-50 w-screen z-50 flex flex-col md:flex-row justify-center items-center ${
				hidden ? "hidden" : ""
			} flex-grow`}
			onClick={(e) => {
				if (e.target !== e.currentTarget) return
				onClick()
			}}
		>
			<div
				className="flex w-auto bg-white rounded-xl h-auto flex-col text-center p-5 justify-center"
				onClick={() => {
					console.log("clicked")
				}}
			>
				{children}
			</div>
		</div>
	)
}
