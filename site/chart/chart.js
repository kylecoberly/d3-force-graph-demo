import { select, zoom } from "d3"

export const svg = select("#container")
	.append("svg")
	.attr("preserveAspectRatio", "xMinYMin meet")
	.attr("viewBox", [-50, -50, 100, 100])
	.attr("width", "100%")
	.attr("height", "100%")

export const bounds = svg
	.append("g")
	.classed("bounds", true)

const defs = svg.append("defs")

// Link arrow
defs
	.append("marker")
	.classed("arrow", true)
	.attr("refX", 5)
	.attr("refY", 5)
	.attr("markerWidth", 7)
	.attr("markerHeight", 7)
	.attr("orient", "auto-start-reverse")
	.attr("class", "arrow")
	.append("path")
	.attr("d", `
		M 0 0
		L 10 5
		L 0 10
		L 5 5
		z
	`)

// Circle Node
defs
	.append("symbol")
	.attr("id", "circle")
	.attr("viewBox", "-5 -5 10 10")
	.attr("width", 5)
	.attr("height", 5)
	.attr("r", 4)
	.attr("cx", 0)
	.attr("cr", 0)

// Enable Zoom
export const zoomer = zoom().scaleExtent([1 / 2, 3])

svg.call(zoomer.on("zoom", ({ transform }) => {
	bounds.attr("transform", transform)
}))


////////////

function centerNode(x, y) {
	const transform = bounds.node().attributes?.transform?.value
	const offset = transform
		? transform.match(/translate\((.+?)\)/)[1].split(",").map(match => +match)
		: [0, 0]
	const differential = [
		offset[0] - x,
		offset[1] - y,
	]

	const interpolator = interpolateZoom([offset[0], offset[1], 1], [x, y, 2])
	const zoomAndPan = (t) => {
		const view = interpolator(t)
		const box = bounds.node().getBoundingClientRect()
		const w = box.width
		const h = box.height
		// const k = Math.min(w, h) / view[2]; // scale
		const k = view[2]; // scale
		const translate = [
			w / 2 - view[0] * k,
			h / 2 - view[1] * k
		]; // translate
		console.log(w, h, k, translate)
		return `translate(${translate[0]},${translate[1]}) scale(${k})`
		// `translate(${differential[0]},${differential[1]}) scale(2)`
	}

	bounds.transition().duration(1000).attrTween("transform", () => zoomAndPan)
}
