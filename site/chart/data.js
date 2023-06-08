import data from "../data.json"
import { bounds, addMarchingAnts } from "./chart.js"
import { select } from "d3"

export const { nodes, links } = data

export const linkGroup = bounds.selectAll(".link")
	.data(links)
	.join("g")

export const link = linkGroup
	.append("polyline")
	.attr("marker-mid", "url(#arrow)")
	.classed("link", true)

export const node = bounds.selectAll(".node")
	.data(nodes)
	.join("g")
	.attr("class", "node")

export const circle = node.append("circle")
	.attr("r", 2)

export const text = node.append("text")
	.attr("class", "label")

export const linkCounts = links.reduce((counts, link) => {
	counts[link.source] = counts[link.source] ?? { from: 0, to: 0 }
	counts[link.target] = counts[link.target] ?? { from: 0, to: 0 }
	counts[link.source].from = counts[link.source].from + 1
	counts[link.target].to = counts[link.target].to + 1
	return counts
}, {})
