// 1. Access the data
import data from "./data.json"
export const { nodes, links } = data
// const { nodes, links } = await d3.json("./data.json")

export const linkCounts = links.reduce((counts, link) => {
	counts[link.source] = counts[link.source] ?? { from: 0, to: 0 }
	counts[link.target] = counts[link.target] ?? { from: 0, to: 0 }
	counts[link.source].from = counts[link.source].from + 1
	counts[link.target].to = counts[link.target].to + 1
	return counts
}, {})
