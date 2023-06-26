import {
	forceSimulation, forceManyBody, forceX, forceY, forceCollide
} from "d3"
import attractGroups from "./forces/attract-groups.js"
import shapeLinks from "./forces/shape-links.js"
import createLinkForce from "./forces/links.js"
import simulationOptions from "./options.js"

const {
	simulation: {
		tickCount,
		alphaCutoff,
	},
	forces: {
		positional: positionalForce,
		charge,
		collision,
		link: {
			distance: linkDistance,
			strength: linkStrength,
		},
		group: {
			charge: groupCharge,
			distance: groupDistance,
		},
	},
} = simulationOptions

export default function runSimulation({ nodes, links, simulation = initializeSimulation() }) {
	const linkForce = createLinkForce().links(links)
	simulation
		.nodes(nodes)
		.force("link", linkForce)
		.stop()

	let count = tickCount
	simulation.alpha(1)
	while (count > 0) {
		simulation.tick()
		count--
		updateSimulation(simulation)
	}
	simulation.restart()
	return simulation
}

function initializeSimulation() {
	const { x, y } = positionalForce

	return forceSimulation()
		.force("charge", forceManyBody().strength(charge.initial))
		.force("x", forceX(x))
		.force("y", forceY(y))
		.force("collision", forceCollide(collision.initial))
}

function updateSimulation(simulation) {
	attractGroups(simulation, {
		alphaCutoff,
		chargeStrength: groupCharge.initial,
		distanceCutoff: groupDistance.cutoff,
		distanceRate: groupDistance.rate,
	})
	shapeLinks(simulation, {
		alphaCutoff,
		chargeStrength: charge.final,
		collisionStrength: collision.final,
		linkDistance: linkDistance.final,
		linkStrength: linkStrength.final,
	})
}
