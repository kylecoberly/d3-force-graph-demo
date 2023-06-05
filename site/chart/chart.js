import { select, zoom } from "d3"
import simulation from "./simulation.js"

// Canvas
export const {
	width, height, boundedWidth, boundedHeight, margin,
} = getDimensions({
	// width: d3.min([window.innerWidth * 0.9, window.innerHeight * 0.9]),
	width: window.innerWidth,
	height: window.innerHeight,
	margin: {
		top: 10,
		right: 10,
		bottom: 10,
		left: 10,
	},
})
export const { top, right, bottom, left } = margin

export const container = select("#container")
	.append("svg")
	.attr("preserveAspectRatio", "xMinYMin meet")
	.attr("viewBox", [-50, -50, 100, 100])

export const bounds = container
	.append("g")
	.classed("bounds", true)

// Link arrow
addArrow(container)

function addArrow(container) {
	container
		.append("defs")
		.append("marker")
		.attr("id", "arrow")
		.attr("viewBox", [0, 0, 10, 10])
		.attr("refX", 5)
		.attr("refY", 5)
		.attr("markerWidth", 7)
		.attr("markerHeight", 7)
		.attr("orient", "auto")
		.attr("class", "arrow")
		.append("path")
		.attr("d", `
			M 0 0
			L 10 5
			L 0 10
			z
		`)
}

// Static and dynamic dimensions
function getDimensions({ height, width, margin }) {
	const { top, bottom, left, right } = margin

	return {
		height,
		width,
		margin,
		boundedHeight: height - top - bottom,
		boundedWidth: width - left - right,
	}
}

// Restart on resize
select(window).on("resize", () => {
	simulation.restart()
})

// Enable Zoom
function zoomed({ transform }) {
	bounds.attr("transform", transform)
}

export const zoomer = zoom().scaleExtent([1 / 2, 3])

container.call(zoomer.on("zoom", zoomed))
