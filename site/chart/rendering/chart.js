import { select, zoomIdentity, zoom as Zoom, interpolate } from "d3"
import { chart, focus, zoom as zoomOptions } from "./options.js"
import { addArrow, addCircle } from "./icons.js"

const {
	height,
	width,
} = chart
const {
	initialScale,
	initialCoordinates,
	minimum,
	maximum,
	constraintFactor,
} = zoomOptions
const {
	duration,
	scale,
} = focus

const zoom = Zoom()
	.interpolate(interpolate)
	.scaleExtent([minimum, maximum])
	.translateExtent([
		[width / -constraintFactor, height / -constraintFactor],
		[width / constraintFactor, height / constraintFactor]
	])

const svg = select("#container")
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
	.call(listenForZoom)

const defs = svg.append("defs")
addArrow(defs)
addCircle(defs)


function attachZoom(svg) {
	const { x, y } = initialCoordinates

	svg
		.call(zoom)
		.call(
			zoom.transform,
			zoomIdentity
				.translate(x, y)
				.scale(initialScale)
		)
}

function listenForZoom(bounds) {
	bounds
		.call(() => {
			zoom.on("zoom", ({ transform }) => {
				bounds.attr("transform", transform)
			})
		})
}

function attachFocus(svg) {
	svg
		.on("click", (event) => {
			if (event.target.tagName !== "use") {
				select("#container .details")
					.classed("open", false)
			}
		})
}

export function centerNode(x, y) {
	const transform = zoomIdentity.scale(scale).translate(-x, -y)
	select("#container svg")
		.transition()
		.duration(duration)
		.call(zoom.transform, transform)
}

export function showDetails({ id }) {
	select("#container .details")
		.classed("open", true)
		.html(`
			<h2>${id}</h2>
			<p>${id}</p>
		`)
}
