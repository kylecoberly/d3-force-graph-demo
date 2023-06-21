import {
	forceSimulation, forceManyBody, forceX, forceY,
	forceCollide, forceLink
} from "d3"
import { clampToBoundary } from "../utilities.js"
import render from "../rendering/render.js"
import attractGroups from "./attract-groups.js"
import shapeLinks from "./shape-links.js"
import simulationOptions from "./options.js"
import chartOptions from "../rendering/options.js"

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
			link: {
				strength: groupLinkStrength,
			},
			distance: groupDistance,
		},
	},
} = simulationOptions

const {
	chart: {
		boundary: chartBoundary,
	}
} = chartOptions

const linkForce = forceLink()
	.id(({ id }) => id)
	.distance(linkDistance.initial)
	.strength(({ source, target }) => (
		source.group === target.group
			? groupLinkStrength.initial
			: linkStrength.initial
	))

export function renderSimulation({ simulation, nodes, links, groups }) {
	runSimulation(simulation, { nodes, links })
	render({ nodes, links, groups })
}

export function initializeSimulation() {
	const { x, y } = positionalForce

	return forceSimulation()
		.force("charge", forceManyBody().strength(charge.initial))
		.force("x", forceX(x))
		.force("y", forceY(y))
		.force("collision", forceCollide(collision.initial))
}

function runSimulation(simulation, { nodes, links }) {
	simulation
		.nodes(nodes)
		.force("link", linkForce.links(links))
		.stop()

	let count = tickCount
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
		alphaCutoff,
		chargeStrength: groupCharge.initial,
		distanceCutoff: groupDistance.cutoff,
		distanceRate: groupDistance.rate,
	})
	clampToBoundary(nodes, chartBoundary)
	shapeLinks(simulation, alpha, {
		alphaCutoff,
		chargeStrength: charge.final,
		collisionStrength: collision.final,
		linkDistance: linkDistance.final,
		linkStrength: linkStrength.final,
	})
}
