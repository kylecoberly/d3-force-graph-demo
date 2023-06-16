import { bounds } from "./chart.js"
import data from "../data.json"
export const { nodes, links } = data

export const node = bounds
	.selectAll(".node")
	.data(nodes)
	.join("g")
	.classed("node", true)

export const text = node
	.append("text")
	.classed("label", true)

export const linkGroup = bounds
	.selectAll(".link")
	.data(links)
	.join("g")
