import {
	forceSimulation, forceManyBody, forceX, forceY, forceCollide
} from "d3"
import setGroups from "./set-groups.js"
import attractGroups from "./forces/attract-groups.js"
import shapeLinks from "./forces/shape-links.js"
import createLinkForce from "./forces/links.js"
import simulationOptions from "./options.js"

const {
	simulation: {
		tickCount,
	},
	forces: {
		positional: positionalForce,
		charge,
		collision,
	},
} = simulationOptions

export default function runSimulation({ nodes, links, groups, simulation = initializeSimulation() }) {
	simulation.groups = simulation.groups || groups
	const linkForce = createLinkForce().links(links)
	simulation.restart()
	simulation
		.nodes(nodes)
		.force("link", linkForce)
		.stop()
	let count = tickCount
	simulation.alpha(1)

	while (count > 0) {
		simulation.tick()
		count--
		[setGroups, attractGroups, shapeLinks]
			.forEach(simulationUpdater => simulationUpdater(simulation))
	}

	return simulation
}

function initializeSimulation() {
	return forceSimulation()
		.force("charge", forceManyBody().strength(charge.initial))
		.force("x", forceX(positionalForce.x))
		.force("y", forceY(positionalForce.y))
		.force("collision", forceCollide(collision.initial))
}
