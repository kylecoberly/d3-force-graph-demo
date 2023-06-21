import { centerNode, showDetails } from "./chart.js"
import { getLinkCounts, toDegrees } from "../utilities.js"
import getSmoothHull from "../simulation/hull.js"

export function addGroups(group, groups) {
	group
		.append("path")
		.attr("d", ({ points }) => getSmoothHull(points, 5))
		.attr("fill", ({ id }) => groups[id]["background-color"])

	group
		.append("text")
		.classed("group-label", true)
		.attr("x", ({ center }) => Math.round(center.x))
		.attr("y", ({ center }) => Math.round(center.y))
		.attr("text-anchor", "middle")
		.attr("fill", ({ id }) => groups[id]["foreground-color"])
		.text(({ id }) => groups[id].label)
}

export function addNodes(node, links) {
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
}

export function addCircle(node) {
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

export function addLabel(node) {
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

export function addLink(link) {
	link
		.append("path")
		.classed("link", true)
		.attr("id", ({ source, target }) => `link-${source.id}${target.id}`.replaceAll(" ", ""))
		.attr("d", ({ source, target }) => `M${source.x},${source.y} ${target.x},${target.y}`)
}

export function addArrows(link) {
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
