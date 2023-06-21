import { select, zoomIdentity, zoom } from "d3"
import { attachZoom } from "./zoom.js"
import { chart, focus, zoom as zoomOptions } from "./options.js"

const {
	height,
	width,
} = chart
const {
	duration,
	scale,
} = focus

select("#container")
	.append("svg")
	.attr("preserveAspectRatio", "xMinYMin meet")
	.attr("viewBox", [width / -2, height / -2, width, height])
	.attr("width", `${width}px`)
	.attr("height", `${height}px`)
	.call(attachFocus)
	.call(attachZoom)
	.append("g")
	.classed("bounds", true)
	.attr("width", `${width}`)
	.attr("height", `${height}`)

attachZoom({ bounds })

function attachFocus(svg) {
	svg
		.on("click", (event) => {
			if (event.target.tagName !== "use") {
				select("#container .details")
					.classed("open", false)
			}
		})
}

function attachZoom({ bounds }) {
	svg
		.call(zoom)
		.call(() => {
			zoom.on("zoom", ({ transform }) => {
				bounds.attr("transform", transform)
			})
		})
		.call(
			zoom.transform,
			zoomIdentity
				.translate(0, 0)
				.scale(initial)
		)
}
export const zoom = Zoom()
	.interpolate(interpolate)
	.scaleExtent([minimum, maximum])
	.translateExtent([
		[
			width / -constraintFactor, height / -constraintFactor
		], [
			width / constraintFactor, height / constraintFactor
		]
	])
