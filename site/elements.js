import { nodes, links } from "./data"
import { bounds } from "./chart"

export const link = bounds.selectAll(".link")
	.data(links)
	.join("polyline")
	.attr("stroke", "black")
	.attr("marker-start", "url(#arrow)")
	.attr("marker-mid", "url(#arrow)")
	.attr("marker-end", "url(#arrow)")
	.attr("fill", "none")
	.attr("class", "link")

export const node = bounds.selectAll(".node")
	.data(nodes)
	.join("g")
	.attr("class", "node")

export const circle = node.append("circle")
	.attr("r", 2)
	.attr("fill", "white")

export const text = node.append("text")
	.attr("class", "label")
