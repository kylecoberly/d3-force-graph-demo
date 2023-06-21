import { select } from "d3"
import "./icons.js"
import { getCentroids } from "../utilities.js"
import {
	addLink,
	addArrows,
	addCircle,
	addNodes,
	addGroups,
	addLabel,
} from "./elements"
import getSmoothHull from "../simulation/hull.js"

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
				.selectAll(".link")
				.transition()
				.duration(1000)
				.attr("d", ({ source, target }) => `M${source.x},${source.y} ${target.x},${target.y}`),
			exit => exit.remove(),
		)
	const offset = {
		x: 2,
		y: 2,
	}

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
				.call(node => {
					node.select("text")
						.transition()
						.duration(1000)
						.attr("x", ({ x }) => Math.round(x + offset.x))
						.attr("y", ({ y }) => Math.round(y + offset.y))
				})
				.call(node => {
					node.select("use")
						.transition()
						.duration(1000)
						.attr("x", ({ x }) => Math.round(x - offset.x))
						.attr("y", ({ y }) => Math.round(y - offset.y))
				}),
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
				.call(addGroups, groups)
				.lower(),
			update => update
				.each((d) => {
					d.center = groupCenters[d.id]
					d.points = nodes
						.filter(node => node.group === d.id)
						.map(({ x, y }) => [x, y])
				})
				.call(group => {
					group.select("path")
						.transition()
						.duration(1000)
						.attr("d", ({ points }) => getSmoothHull(points, 5))
				})
				.call(group => {
					group.select("text")
						.transition()
						.duration(1000)
						.attr("x", ({ center }) => Math.round(center.x))
						.attr("y", ({ center }) => Math.round(center.y))
				}),
			exit => exit.remove(),
		)
}

