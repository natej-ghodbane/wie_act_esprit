import React, { useEffect, useRef } from "react"

interface BlobPosition {
	x: number;
	y: number;
}

const AnimatedBackground: React.FC = () => {
	const blobRefs = useRef<(HTMLDivElement | null)[]>([])
	const initialPositions: BlobPosition[] = [
		{ x: -4, y: 0 },
		{ x: -4, y: 0 },
		{ x: 20, y: -8 },
		{ x: 20, y: -8 },
	]

	useEffect(() => {
		let currentScroll = 0
		let requestId: number

		const handleScroll = () => {
			const newScroll = window.pageYOffset
			const scrollDelta = newScroll - currentScroll
			currentScroll = newScroll

			blobRefs.current.forEach((blob, index) => {
				if (!blob) return; // Guard against null refs
				
				const initialPos = initialPositions[index]

				// Calculating movement in both X and Y direction
				const xOffset = Math.sin(newScroll / 100 + index * 0.5) * 340 // Horizontal movement
				const yOffset = Math.cos(newScroll / 100 + index * 0.5) * 40 // Vertical movement

				const x = initialPos.x + xOffset
				const y = initialPos.y + yOffset

				// Apply transformation with smooth transition
				blob.style.transform = `translate(${x}px, ${y}px)`
				blob.style.transition = "transform 1.4s ease-out"
			})

			requestId = requestAnimationFrame(handleScroll)
		}

		window.addEventListener("scroll", handleScroll)
		return () => {
			window.removeEventListener("scroll", handleScroll)
			if (requestId) {
				cancelAnimationFrame(requestId)
			}
		}
	}, [])

	return (
		<div className="fixed inset-0">
			{/* Main background gradient matching Home page */}
			<div className="absolute inset-0 bg-gradient-to-br from-pink-200 via-rose-200 to-orange-200"></div>
			
			{/* Animated gradient blobs */}
			<div className="absolute inset-0">
				<div
					ref={(ref) => { blobRefs.current[0] = ref; }}
					className="absolute top-0 -left-4 md:w-96 md:h-96 w-72 h-72 bg-gradient-to-br from-pink-300/40 to-rose-300/40 rounded-full blur-3xl"></div>
				<div
					ref={(ref) => { blobRefs.current[1] = ref; }}
					className="absolute top-0 -right-4 w-96 h-96 bg-gradient-to-br from-orange-300/40 to-yellow-300/40 rounded-full blur-3xl hidden sm:block"></div>
				<div
					ref={(ref) => { blobRefs.current[2] = ref; }}
					className="absolute -bottom-8 left-[-40%] md:left-20 w-96 h-96 bg-gradient-to-br from-rose-400/30 to-pink-400/30 rounded-full blur-3xl"></div>
				<div
					ref={(ref) => { blobRefs.current[3] = ref; }}
					className="absolute -bottom-10 right-20 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-rose-400/20 rounded-full blur-3xl hidden sm:block"></div>
			</div>
			
			{/* Subtle grid pattern */}
			<div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,182,193,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,182,193,0.1)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
		</div>
	)
}

export default AnimatedBackground

