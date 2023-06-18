import { getCentroids, toDegrees } from "./utilities.js"
import "./icons.js"
import { centerNode, showDetails } from "./focus.js"
import { select } from "d3"
import { groupBy, toPairs, mapValues, map, flow, forEach } from "lodash/fp"
import data from "../data.json"
import getSmoothHull from "./hull.js"

export default function render({ linkGroup, node, linkCounts, text }) {
	addNeighborhoods(node)
	addLink(linkGroup)
	addMarchingAnts(linkGroup)

	addCircles(node, linkCounts)
	addTextLabel(text)
}

function addNeighborhoods(node) {
	const groupCenters = getCentroids(node.data())
	flow([
		groupBy("group"),
		mapValues((nodes) => ({
			center: groupCenters[nodes[0].group],
			points: map(
				({ x, y }) => [x, y]
			)(nodes),
		})),
		toPairs,
		forEach(([group, { center, points }]) => {
			const { groups: groupData } = data
			const bounds = select(".bounds")

			bounds
				.append("path")
				.attr("d", getSmoothHull(points, 5))
				.attr("fill", groupData[group]["background-color"])
				.lower()

			bounds
				.append("text")
				.classed("group-label", true)
				.attr("x", Math.round(center.x))
				.attr("y", Math.round(center.y))
				.attr("text-anchor", "middle")
				.attr("fill", groupData[group]["foreground-color"])
				.text(groupData[group].label)
				.lower()
		}),
	])(node.data())
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
