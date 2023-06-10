import { select, zoom } from "d3"

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


// Enable Zoom
const minimumZoom = 4
const maximumZoom = 30
const defaultZoom = 4

export const zoomer = zoom().scaleExtent([minimumZoom, maximumZoom])
bounds.attr("transform", `scale(${defaultZoom})`)
svg.call(zoomer.on("zoom", ({ transform }) => {
	bounds.attr("transform", transform)
}))


////////////

// function centerNode(x, y) {
// 	const transform = bounds.node().attributes?.transform?.value
// 	const offset = transform
// 		? transform.match(/translate\((.+?)\)/)[1].split(",").map(match => +match)
// 		: [0, 0]
// 	const differential = [
// 		offset[0] - x,
// 		offset[1] - y,
// 	]
//
// 	const interpolator = interpolateZoom([offset[0], offset[1], 1], [x, y, 2])
// 	const zoomAndPan = (t) => {
// 		const view = interpolator(t)
// 		const box = bounds.node().getBoundingClientRect()
// 		const w = box.width
// 		const h = box.height
// 		// const k = Math.min(w, h) / view[2]; // scale
// 		const k = view[2]; // scale
// 		const translate = [
// 			w / 2 - view[0] * k,
// 			h / 2 - view[1] * k
// 		]; // translate
// 		console.log(w, h, k, translate)
// 		return `translate(${translate[0]},${translate[1]}) scale(${k})`
// 		// `translate(${differential[0]},${differential[1]}) scale(2)`
// 	}
//
// 	bounds.transition().duration(1000).attrTween("transform", () => zoomAndPan)
// }
