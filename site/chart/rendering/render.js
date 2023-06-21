import { select } from "d3"
import "./icons.js"
import { centerNode, showDetails } from "./chart.js"
import { getLinkCounts, getCentroids, toDegrees } from "../utilities.js"
import getSmoothHull from "../simulation/hull.js"

import data from "../../data.json"
const { groups: groupData } = data

export default function render({ groups, nodes, links }) {
	select(".bounds").selectAll(".link")
		.data(links, ({ source, target }) => `${source}-${target}`)
		.join(
			enter => enter
				.append("g")
				.classed("link", true)
				.call(addLink)
				.call(addArrows),
			update => update
				.transition()
				.duration(1000)
				// This line is a placeholder:
				.attr("transform", ({ source, target }) => `translate(${source.x},${target.y})`),
			exit => exit.remove()
		)

	select(".bounds").selectAll(".node")
		.data(nodes, ({ id }) => id)
		.join(
			enter => enter
				.append("g")
				.classed("node", true)
				.call(addCircle)
				.call(addNodes, links)
				.call(addLabel),
			update => update
				.transition()
				.duration(1000)
				.attr("transform", ({ x, y }) => `translate(${x},${y})`),
			exit => exit.remove(),
		)

	const groupCenters = getCentroids(nodes)
	select(".bounds").selectAll(".domain")
		.data(Object.values(groups), ({ id }) => id)
		.join(
			enter => enter
				.append("g")
				.classed("domain", true)
				.each((d) => {
					d.center = groupCenters[d.id]
					d.points = nodes
						.filter(node => node.group === d.id)
						.map(({ x, y }) => [x, y])
				})
				.call(addGroups)
				.lower(),
			update => update
				.each(({ center, points, id }) => {
					center = groupCenters[id]
					points = nodes
						.filter(node => node.group === id)
						.map(({ x, y }) => [x, y])
				})
				.transition()
				.duration(1000)
				.attr("transform", ({ center }) => `translate(${center.x},${center.y})`),
			exit => exit.remove(),
		)
}

function addGroups(group) {
	group
		.append("path")
		.attr("d", ({ points }) => getSmoothHull(points, 5))
		.attr("fill", ({ id }) => groupData[id]["background-color"])

	group
		.append("text")
		.classed("group-label", true)
		.attr("x", ({ center }) => Math.round(center.x))
		.attr("y", ({ center }) => Math.round(center.y))
		.attr("text-anchor", "middle")
		.attr("fill", ({ id }) => groupData[id]["foreground-color"])
		.text(({ id }) => groupData[id].label)
}

function addNodes(node, links) {
	const linkCounts = getLinkCounts(links)

	node
		.classed("open", ({ id }) => linkCounts[id]?.to === 0)
		.classed("closed", ({ id }) => linkCounts[id]?.to !== 0)
		.classed("completed", ({ complete }) => complete)
		.classed("in-progress", ({ in_progress }) => in_progress)
		.classed("critical", ({ critical }) => critical)
		.on("click", (_, d) => {
			centerNode(d.x, d.y)
			showDetails(d)
		})

	node

}

function addCircle(node) {
	const offset = {
		x: 2,
		y: 2,
	}

	node
		.append("use")
		.attr("width", 4)
		.attr("height", 4)
		.attr("x", ({ x }) => Math.round(x - offset.x))
		.attr("y", ({ y }) => Math.round(y - offset.y))
		.attr("href", "#circle")
}

function addLabel(node) {
	const offset = {
		x: 0,
		y: 4,
	}

	node
		.append("text")
		.classed("label", true)
		.attr("x", ({ x }) => Math.round(x + offset.x))
		.attr("y", ({ y }) => Math.round(y + offset.y))
		.attr("text-anchor", "middle")
		.text(({ id }) => id)
}

function addLink(link) {
	link
		.append("path")
		.classed("link", true)
		.attr("id", ({ source, target }) => `link-${source.id}${target.id}`.replaceAll(" ", ""))
		.attr("d", ({ source, target }) => `M${source.x},${source.y} ${target.x},${target.y}`)
}

function addArrows(link) {
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
