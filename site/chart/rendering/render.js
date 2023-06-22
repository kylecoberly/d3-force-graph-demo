import { select } from "d3"
import "./icons.js"
import options from "./options.js"
import { getCentroids, move } from "../utilities.js"
import {
	addLinks,
	addArrows,
	addCircles,
	addNodes,
	addGroups,
	addLabels,
} from "./elements"
import getSmoothHull from "../simulation/hull.js"

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
				.call(addLinks)
				.call(addArrows),
			update => update
				.selectAll(".link")
				.transition()
				.duration(transitionRate)
				.attr("d", ({ source, target }) => `
					M${source.x},${source.y} ${target.x},${target.y}
				`),
			exit => exit.remove(),
		)

	select(".bounds").selectAll(".node")
		.data(nodes, ({ id }) => id)
		.join(
			enter => enter
				.append("g")
				.classed("node", true)
				.call(addCircles)
				.call(addNodes, links)
				.call(addLabels),
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
				.call(addGroups, groups)
				.lower(),
			update => update
				.each(setGroupData)
				.call(group => {
					group.select("path")
						.transition()
						.duration(transitionRate)
						.attr("d", ({ points }) => getSmoothHull(points, hullPadding))
				})
				.call(group => group.select("text").call(move)),
			exit => exit.remove(),
		)
}
