import { bounds } from "./chart.js"
import data from "../data.json"
export const { nodes, links } = data

export const node = bounds
	.selectAll(".node")

export const text = node
	.append("text")
	.classed("label", true)

export const linkGroup = bounds
	.selectAll(".link")
