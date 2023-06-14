import { select, zoom as _zoom, zoomIdentity, interpolate } from "d3"

const height = 800
const width = 1500

export const svg = select("#container")
	.append("svg")
	.attr("preserveAspectRatio", "xMinYMin meet")
	.attr("viewBox", [width / -2, height / -2, width, height])
	.attr("width", `${width}px`)
	.attr("height", `${height}px`)

export const bounds = svg
	.append("g")
	.classed("bounds", true)
	.attr("width", `${width}`)
	.attr("height", `${height}`)

// Enable Zoom
const defaultZoom = 4
const minimumZoom = 4
const maximumZoom = 30
const constraintFactor = 6

export const zoom = _zoom()
	.interpolate(interpolate)
	.scaleExtent([minimumZoom, maximumZoom])
	.translateExtent([
		[
			width / -constraintFactor, height / -constraintFactor
		], [
			width / constraintFactor, height / constraintFactor
		]
	]).on("zoom", ({ transform }) => {
		bounds.attr("transform", transform)
	})

svg
	.call(zoom)
	.call(zoom.transform, zoomIdentity.scale(defaultZoom))

export function centerNode(x, y) {
	const duration = 1000
	const scale = 18
	const transform = zoomIdentity.scale(scale).translate(-x, -y)

	svg
		.transition()
		.duration(duration)
		.call(zoom.transform, transform)
}
