import { select, zoomIdentity, zoom as Zoom, interpolate } from "d3"
import { addArrow, addCircle } from "./icons.js"
import options from "./options.js"

const {
	chart: { width, height, resetScalingFactor },
	zoom: {
		initialScale,
		initialCoordinates,
		minimum,
		maximum,
		constraintFactor,
	},
	focus: focusSettings,
} = options

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
	.call(attachFocusListener)
	.call(zoom)
	.append("g")
	.classed("bounds", true)
	.attr("width", `${width}`)
	.attr("height", `${height}`)
	.call(attachZoomListener, zoom)

svg.call(initializeZoom)

svg.append("defs")
	.call(addArrow)
	.call(addCircle)

function initializeZoom(svg) {
	const { x, y } = initialCoordinates
	const initialTransform = zoomIdentity
		.translate(x, y)
		.scale(initialScale)

	svg.call(zoom.transform, initialTransform)
}

export function resetZoom(currentWidth) {
	const widthRatio = currentWidth / width
	const newScale = widthRatio * (resetScalingFactor)
	const initialTransform = zoomIdentity
		.scale(newScale)

	svg.call(zoom.transform, initialTransform)
}

function attachZoomListener(bounds, zoom) {
	zoom.on("zoom", ({ transform }) => {
		bounds.attr("transform", transform)
	})
}

function attachFocusListener(svg) {
	svg.on("click", (event) => {
		if (event.target.tagName !== "use") {
			select("#container .details")
				.classed("open", false)
		}
	})
}

export function centerNode(x, y) {
	const { scale, duration } = focusSettings
	const transform = zoomIdentity
		.scale(scale)
		.translate(-x, -y)

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
