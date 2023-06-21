import {
	forceSimulation, forceManyBody, forceX, forceY,
	forceCollide, forceLink, select
} from "d3"
import { clampToBoundary } from "./utilities.js"
import render from "./render.js"
import attractGroups from "./calculations/attract-groups.js"
import shapeLinks from "./calculations/shape-links.js"
import { chart, simulation as simulationOptions, forces } from "./options.js"

const linkForce = forceLink()
	.id(({ id }) => id)
	.distance(forces.link.distance.initial)
	.strength(({ source, target }) => (
		source.group === target.group
			? forces.group.link.strength.initial
			: forces.link.strength.initial
	))

export function rerun({ simulation, nodes, links, groups }) {
	runSimulation(simulation, { nodes, links })
	render({ nodes, links, groups })
}

export function initializeSimulation() {
	return forceSimulation()
		.force("charge", forceManyBody().strength(forces.charge.initial))
		.force("x", forceX(forces.positional.x))
		.force("y", forceY(forces.positional.y))
		.force("collision", forceCollide(forces.collision.initial))
}

function runSimulation(simulation, { nodes, links }) {
	simulation
		.nodes(nodes)
		.force("link", linkForce.links(links))
		.stop()
	let count = simulationOptions.tickCount
	simulation.alpha(1).restart()
	while (count > 0) {
		simulation.tick()
		update(simulation)
		count--
	}
}

function update(simulation) {
	const alpha = simulation.alpha()
	const nodes = simulation.nodes()

	attractGroups(nodes, alpha, {
		alphaCutoff: simulationOptions.alphaCutoff,
		chargeStrength: forces.group.charge,
		distanceCutoff: forces.group.distance.cutoff,
		distanceRate: forces.group.distance.rate,
	})
	clampToBoundary(nodes, chart.boundary)
	shapeLinks(simulation, alpha, {
		alphaCutoff: simulationOptions.alphaCutoff,
		chargeStrength: forces.charge.final,
		collisionStrength: forces.collision.final,
		linkDistance: forces.link.distance.final,
		linkStrength: forces.link.strength.final,
	})
}
