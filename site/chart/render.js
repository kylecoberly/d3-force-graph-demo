import { getLinkCounts, getCentroids, toDegrees } from "./utilities.js"
import "./icons.js"
import { centerNode, showDetails } from "./focus.js"
import data from "../data.json"
const { groups: groupData } = data
import getSmoothHull from "./hull.js"
import { select } from "d3"

export default function render({ groups, nodes, links }) {
	const groupCenters = getCentroids(nodes)

	select(".bounds")
		.selectAll(".link")
		.data(links, ({ source, target }) => `${source}-${target}`)
		.join(
			enter => enter
				.append("g")
				.classed("link", true)
				.call(addLink)
				.call(addMarchingAnts),
			update => update
				.transition()
				.duration(1000)
				// This line is a placeholder:
				.attr("transform", ({ source, target }) => `translate(${source.x},${target.y})`),
			exit => exit
				.remove()
		)

	select(".bounds").selectAll(".node")
		.data(nodes, d => d.id)
		.join(
			enter => enter
				.append("g")
				.classed("node", true)
				.call(addCircles, links)
				.append("text")
				.classed("label", true)
				.call(addTextLabel),
			update => update
				.transition()
				.duration(1000)
				.attr("transform", (d) => `translate(${d.x},${d.y})`),
			exit => exit
				.remove(),
		)

	select(".bounds").selectAll(".domain")
		.data(Object.values(groups), d => d.id)
		.join(
			enter => enter
				.append("g")
				.classed("domain", true)
				.each(d => {
					d.center = groupCenters[d.id]
					d.points = nodes
						.filter(node => node.group === d.id)
						.map(({ x, y }) => [x, y])
				})
				.call(addNeighborhoods)
				.lower(),
			update => update
				.each(d => {
					d.center = groupCenters[d.id]
					d.points = nodes
						.filter(node => node.group === d.id)
						.map(({ x, y }) => [x, y])
				})
				.transition()
				.duration(1000)
				.attr("transform", (d) => `translate(${d.center.x},${d.center.y})`),
			exit => {
				return exit.remove()
			},
		)
}

function addNeighborhoods(group) {
	group
		.append("path")
		.attr("d", d => getSmoothHull(d.points, 5))
		.attr("fill", d => groupData[d.id]["background-color"])

	group
		.append("text")
		.classed("group-label", true)
		.attr("x", d => Math.round(d.center.x))
		.attr("y", d => Math.round(d.center.y))
		.attr("text-anchor", "middle")
		.attr("fill", d => groupData[d.id]["foreground-color"])
		.text(d => groupData[d.id].label)
}

function addCircles(node, links) {
	const linkCounts = getLinkCounts(links)
	const offset = {
		x: 2,
		y: 2,
	}

	node
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
