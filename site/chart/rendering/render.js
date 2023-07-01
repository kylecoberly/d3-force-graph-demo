import { select } from "d3"
import options from "./options.js"
import { move, movePath, fadeIn } from "./animations.js"

import "./chart.js"
import "./elements/icons.js"
import renderLinks, { generateLinkPath } from "./elements/links.js"
import renderNodes from "./elements/nodes.js"
import renderGroups, { setActiveGroup } from "./elements/groups.js"
import { wrap } from "lodash"

const {
	chart: {
		transitionRate,
	},
} = options

export default function render(simulation, { currentFilter }) {
	const nodes = simulation.nodes()
	const links = simulation.force("link").links()
	const groups = simulation.groups

	select(".bounds").selectAll(".link")
		.data(links, ({ source, target }) => `${source}-${target}`)
		.join(
			enter => enter
				.append("g")
				.classed("link", true)
				.call(renderLinks),
			update => update
				.selectAll(".link")
				.transition()
				.duration(transitionRate)
				.attr("d", generateLinkPath),
			exit => exit.remove(),
		)

	select(".bounds").selectAll(".node")
		.data(nodes, ({ id }) => id)
		.join(
			enter => enter
				.append("g")
				.classed("node", true)
				.call(renderNodes, links)
				.call(fadeIn),
			update => update
				.call(node => node
					.select("text")
					.call(move)
				).call(node => node
					.select("use")
					.call(move)
				),
			exit => exit.remove(),
		)

	select(".bounds").selectAll(".domain")
		.data(groups, ({ id }) => id)
		.join(
			enter => enter
				.append("g")
				.classed("domain", true)
				.call(renderGroups, currentFilter)
				.lower(),
			update => update
				.call(setActiveGroup, currentFilter)
				.call(group => group
					.select("path")
					.call(movePath)
				).call(group => group
					.select("text")
					.call(move)
				),
			exit => exit.remove(),
		)
}
