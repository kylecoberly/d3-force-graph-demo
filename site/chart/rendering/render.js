import { select } from "d3"
import "./icons.js"
import options from "./options.js"
import { getCentroids, move } from "../utilities.js"
import getSmoothHull from "../simulation/hull.js"

import renderArrows from "./elements/arrows.js"
import renderLinks from "./elements/links.js"
import renderNodes from "./elements/nodes.js"
import renderCircles from "./elements/circles.js"
import renderGroups from "./elements/groups.js"
import renderLabels from "./elements/labels.js"

const {
	chart: {
		transitionRate,
		hullPadding,
	},
} = options

export default function render({ groups, nodes, links }) {
	select(".bounds").selectAll(".link")
		.data(links, ({ source, target }) => `${source}-${target}`)
		.join(
			enter => enter
				.append("g")
				.classed("link", true)
				.call(renderLinks)
				.call(renderArrows),
			update => update
				.selectAll(".link")
				.transition()
				.duration(transitionRate)
				.attr("d", ({ source, target }) => `
					M${source.x},${source.y} ${target.x},${target.y}
				`.join("")),
			exit => exit.remove(),
		)

	select(".bounds").selectAll(".node")
		.data(nodes, ({ id }) => id)
		.join(
			enter => enter
				.append("g")
				.classed("node", true)
				.call(renderCircles)
				.call(renderNodes, links)
				.call(renderLabels),
			update => update
				.call(node => node.select("text").call(move))
				.call(node => node.select("use").call(move)),
			exit => exit.remove(),
		)

	function setGroupData(d) {
		const { id } = d
		d.x = groupCenters[id].x
		d.y = groupCenters[id].y
		d.points = nodes
			.filter(({ group }) => group === id)
			.map(({ x, y }) => [x, y])
	}

	const groupCenters = getCentroids(nodes)
	select(".bounds").selectAll(".domain")
		.data(Object.values(groups), ({ id }) => id)
		.join(
			enter => enter
				.append("g")
				.classed("domain", true)
				.each(setGroupData)
				.call(renderGroups, groups)
				.lower(),
			update => update
				.each(setGroupData)
				.call(group => group
					.select("path")
					.transition()
					.duration(transitionRate)
					.attr("d", ({ points }) => getSmoothHull(points, hullPadding))
				)
				.call(group => group.select("text").call(move)),
			exit => exit.remove(),
		)
}
