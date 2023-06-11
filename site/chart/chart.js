import { select, zoom as _zoom, zoomIdentity, interpolateZoom } from "d3"

const height = 800
const width = 1500

// Enable Zoom
const minimumZoom = 1
const maximumZoom = 30
export const zoom = _zoom().scaleExtent([minimumZoom, maximumZoom])

export const svg = select("#container")
	.append("svg")
	.attr("preserveAspectRatio", "xMinYMin meet")
	.attr("viewBox", [width / -4, height / -2, width, height])
	.attr("width", `${width}px`)
	.attr("height", `${height}px`)

export const bounds = svg
	.append("g")
	.classed("bounds", true)
	.attr("width", `${width}`)
	.attr("height", `${height}`)

const defaultZoom = 4
svg
	.call(zoom)
	.call(zoom.on("zoom", ({ transform }) => {
		bounds.attr("transform", transform)
	}))
	.call(zoom.transform, zoomIdentity.scale(defaultZoom))


export function centerNode(cx, cy) {
	// console.log("cxy", cx, cy)
	// const currentTranslate = bounds.attr("transform").match(/translate\((.+?),(.+?)\)/)
	// const currentScale = bounds.attr("transform").match(/scale\((.+?)\)/)[1]
	// // const transform = d3.zoomIdentity.translate(x, y).scale(k);
	// const viewport = {
	// 	width: +bounds.attr("width") / currentScale,
	// 	height: +bounds.attr("height") / currentScale,
	// }
	// const source = {
	// 	cx: +currentTranslate[1] || 0,
	// 	cy: +currentTranslate[2] || 0,
	// 	// width: viewport.width / currentScale,
	// 	width: 400,
	// }
	// const target = { cx, cy, width: 50 }
	// console.log({ source, target })

	// g.attr("transform", transform)
	const t = zoomIdentity.scale(20).translate(cx, cy)
	console.log(t)

	bounds
		.transition()
		.duration(1000)
		.call(zoom.transform, zoomIdentity.scale(1).translate(cx, cy)).scale(20)
	// .attrTween("transform", () => ((step) => {
	// const [currentX, currentY, currentWidth] = interpolateZoom([
	// 	+source.cx,
	// 	+source.cy,
	// 	+source.width,
	// ], [
	// 	+target.cx,
	// 	+target.cy,
	// 	+target.width,
	// ])(step)

	// const currentScale = source.width / currentWidth
	// console.log("scale", currentX, currentY, currentWidth, source.width, currentScale)
	// return `translate(${currentX},${currentY}) scale(${currentScale})`
	// }))
}
