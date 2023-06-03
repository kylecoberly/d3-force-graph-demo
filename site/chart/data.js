import data from "../data.json"
import { bounds } from "./chart.js"

export const { nodes, links } = data

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

export const linkCounts = links.reduce((counts, link) => {
	counts[link.source] = counts[link.source] ?? { from: 0, to: 0 }
	counts[link.target] = counts[link.target] ?? { from: 0, to: 0 }
	counts[link.source].from = counts[link.source].from + 1
	counts[link.target].to = counts[link.target].to + 1
	return counts
}, {})
