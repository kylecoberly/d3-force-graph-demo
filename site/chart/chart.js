import { select } from "d3"
import { attachZoom } from "./zoom.js"
import { chart } from "./options.js"

const { height, width } = chart

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

attachZoom({ svg, bounds })
