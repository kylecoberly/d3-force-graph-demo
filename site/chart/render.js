import { toDegrees } from "./utilities.js"
import "./icons.js"
import { centerNode, showDetails } from "./focus.js"
import { select } from "d3"
import { groupBy, mapValues, map, flow } from "lodash/fp"

import data from "../data.json"
import getSmoothHull from "./hull.js"
const { groups: groupConfig } = data

export default function render({ linkGroup, node, linkCounts, text }) {
	addNeighborhoods(node)
	addLink(linkGroup)
	addMarchingAnts(linkGroup)

	addCircles(node, linkCounts)
	addTextLabel(text)
}

function addNeighborhoods(node) {
	const nodes = node.data()
	const groups = flow([
		groupBy("group"),
		mapValues(map(({ x, y }) => [x, y])),
	])(nodes)

	Object.entries(groups)
		.forEach(([group, points]) => {
			const hull = getSmoothHull(points, 5)
			const color = groupConfig[group].color
			select(".bounds")
				.append("path")
				.attr("d", hull)
				.attr("fill", color)
		})
}

function addCircles(node, linkCounts) {
	const offset = {
		x: 2,
		y: 2,
	}

	node
		.append("g")
		.classed("open", (d) => linkCounts[d.id]?.to === 0)
		.classed("closed", (d) => linkCounts[d.id]?.to !== 0)
		.classed("completed", (d) => d.complete)
		.classed("in-progress", (d) => d["in_progress"])
		.classed("critical", (d) => d.critical)
		.on("click", (_, d) => {
			centerNode(d.x, d.y)
			showDetails(d)
		}).append("use")
		.attr("width", 4)
		.attr("height", 4)
		.attr("x", d => Math.round(d.x - offset.x))
		.attr("y", d => Math.round(d.y - offset.y))
		.attr("href", "#circle")
}

function addTextLabel(node) {
	const offset = {
		x: 0,
		y: 4,
	}

	node
		.attr("x", ({ x }) => Math.round(x + offset.x))
		.attr("y", ({ y }) => Math.round(y + offset.y))
		.attr("text-anchor", "middle")
		.text(({ id }) => id)
}

function addLink(link) {
	return link
		.append("path")
		.classed("link", true)
		.attr("id", ({ source, target }) => `link-${source.id}${target.id}`.replaceAll(" ", ""))
		.attr("d", ({ source, target }) => `M${source.x},${source.y} ${target.x},${target.y}`)
}

function addMarchingAnts(link) {
	link
		.append("g")
		.append("use")
		.attr("href", "#arrow")
		.attr("width", 2)
		.attr("height", 2)
		.classed("ant", true)
		.attr("transform", ({ target, source }) => {
			const dx = target.x - source.x
			const dy = target.y - source.y
			const angle = toDegrees(Math.atan2(dy, dx))
			return `rotate(${angle}) translate(0, -1)`
		})
		.append("animateMotion")
		.attr("dur", "0.5s")
		.attr("repeatCount", "indefinite")
		.append("mpath")
		.attr("href", ({ source, target }) => {
			const id = `${source.id}${target.id}`.replaceAll(" ", "")
			return `#link-${id}`
		})
}
