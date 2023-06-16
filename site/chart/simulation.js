import {
	forceSimulation, forceManyBody, forceX, forceY,
	forceCollide, forceLink, select
} from "d3"
import {
	nodes, links, linkGroup, text, node
} from "./data.js"
import { getLinkCounts, clampToBoundary } from "./utilities.js"
import render from "./render.js"
import attractGroups from "./calculations/attract-groups.js"
import shapeLinks from "./calculations/shape-links.js"

import { chart, simulation as simulationOptions, forces } from "./options.js"

const linkCounts = getLinkCounts(links)
const simulation = getSimulation({ nodes, links })
runSimulation(simulation)
render({ linkGroup, node, text, linkCounts })

// Restart on resize
select(window).on("resize", () => {
	simulation.restart()
	render({ linkGroup, node, text, linkCounts })
})

function getSimulation({ nodes, links }) {
	return forceSimulation()
		.nodes(nodes)
		.force("charge", forceManyBody().strength(forces.charge.initial))
		.force("x", forceX(forces.positional.x))
		.force("y", forceY(forces.positional.y))
		.force("collision", forceCollide(forces.collision.initial))
		.force("link", forceLink()
			.id(({ id }) => id)
			.distance(forces.link.distance.initial)
			.strength(({ source, target }) => (
				source.group === target.group
					? forces.group.link.strength.initial
					: forces.link.strength.initial
			)).links(links)
		).stop()
}

function runSimulation(simulation) {
	let count = simulationOptions.tickCount
	while (count > 0) {
		simulation.tick()
		update(simulation)
		count--
	}
}

function update(simulation) {
	const nodes = simulation.nodes()
	const alpha = simulation.alpha()

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
