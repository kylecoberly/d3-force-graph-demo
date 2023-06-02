import * as d3 from "d3"
import addArrow from "./arrow"

// 2. Create chart dimensions
export const { width, height, margin } = getDimensions({
	// width: d3.min([window.innerWidth * 0.9, window.innerHeight * 0.9]),
	width: window.innerWidth * 0.9,
	height: window.innerHeight * 0.9,
	margin: {
		top: 10,
		right: 10,
		bottom: 10,
		left: 10,
	},
})
export const { top, right, bottom, left } = margin

// Get dimensions, including dynamic ones
function getDimensions(baseDimensions) {
	const { height, width, margin } = baseDimensions
	const { top, bottom, left, right } = margin
	const boundedDimensions = {
		boundedHeight: height - top - bottom,
		boundedWidth: width - left - right,
	}

	return {
		...baseDimensions,
		...boundedDimensions,
	}
}

// 3. Draw canvas (chart and bounds)
export const container = d3.select("#container")
	.append("svg")
	.attr("width", width)
	.attr("preserveAspectRatio", "xMinYMin meet")
	.attr("viewBox", [-50, -50, 100, 100])

export const bounds = container
	.append("g")
// 	.style("transform", `translate(
// 	${left}px,
// 	${top}px
// )`)

const zoomCover = container.append("rect")
	.attr("width", width)
	.attr("height", height)
	.style("fill", "none")
	.style("pointer-events", "all")

// Enable Zoom
const zoom = d3.zoom()
	.scaleExtent([1 / 3, 6])
	.on("zoom", ({ transform }) => bounds.attr("transform", transform))

zoomCover
	.call(zoom)
	.call(zoom.translateTo, 0, 0);

d3.select(window).on("resize", () => {
	simulation.restart()
})

// Add arrow
addArrow(container)
