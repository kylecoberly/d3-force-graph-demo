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
				.call(addGroups, groups)
				.lower(),
			update => update
				.each(({ id }) => {
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

