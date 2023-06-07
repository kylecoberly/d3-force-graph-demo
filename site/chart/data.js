// import data from "../data.json"
import { bounds } from "./chart.js"

// export const { nodes, links } = data

const tempData = {
	"nodes": [
		{
			"id": "Quality",
			"group": "quality",
			"critical": true,
			"complete": true
		},
		{
			"id": "Naming",
			"group": "quality",
			"critical": true,
			"complete": true
		},
	],
	"links": [
		{
			"source": "Quality",
			"target": "Naming"
		},
	],
}
export const { nodes, links } = tempData

export const link = bounds.selectAll(".link")
	.data(links)
	.join("polyline")
	.attr("marker-mid", "url(#arrow)")
	.attr("marker-end", "url(#arrow)")
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
