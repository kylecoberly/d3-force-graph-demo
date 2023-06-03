import {
	forceSimulation, forceManyBody, forceX,
	forceY, forceCollide, forceLink,
} from "d3"
import { nodes, links, link, circle, text } from "./data.js"
import simulation from "./simulation.js"
import clampToBoundary from "./rendering/clamp.js"
import getLinkLine from "./rendering/link-line.js"
import attractGroups from "./rendering/attract-groups.js"
import shapeLinks from "./rendering/shape-links.js"

const {
	chartBoundary,
	textOffset,
	alphaCutoff,
	positionalForce,
	chargeStrength,
	collisionStrength,
	linkDistance,
	linkStrength,
	groupLinkStrength,
	groupChargeStrength,
	groupDistanceCutoff,
	groupDistanceCutoffSpeed,
} = {
	chartBoundary: 300,
	textOffset: 6,
	alphaCutoff: 0.3,
	positionalForce: {
		x: 0,
		y: 0,
	},
	chargeStrength: {
		initial: -100,
		final: -10,
	},
	collisionStrength: {
		initial: 0,
		final: 0,
	},
	linkDistance: {
		initial: 0.1,
		final: 1,
	},
	linkStrength: {
		initial: 0.2,
		final: 0.9,
	},
	groupLinkStrength: {
		initial: 1,
		final: 0.2,
	},
	groupChargeStrength: 0,
	groupDistanceCutoff: 5,
	groupDistanceCutoffSpeed: 100,
}

const chargeForce = forceManyBody()
	.strength(chargeStrength.initial)
const xForce = forceX(positionalForce.x)
const yForce = forceY(positionalForce.y)
const collisionForce = forceCollide(collisionStrength.initial)
const linkForce = forceLink()
	.id(({ id }) => id)
	.distance(linkDistance.initial)
	.strength(({ source, target }) => (
		source.group === target.group
			? groupLinkStrength.initial
			: linkStrength.initial
	))

export default simulation = forceSimulation()
	.nodes(nodes)
	.force("charge", chargeForce)
	.force("x", xForce)
	.force("y", yForce)
	.force("collision", collisionForce)
	.force("link", linkForce.links(links))
	.on("tick", ticked({ circle, link, text }))

function ticked({ circle, link, text }) {
	return () => {
		const nodes = simulation.nodes()
		const alpha = simulation.alpha()

		attractGroups(nodes, alpha, {
			alphaCutoff,
			groupChargeStrength,
			groupDistanceCutoff,
			groupDistanceCutoffSpeed,
		})
		clampToBoundary(nodes, chartBoundary)
		shapeLinks(simulation, alpha, {
			alphaCutoff,
			chargeStrength: chargeStrength.final,
			collisionStrength: collisionStrength.final,
			linkDistance: linkDistance.final,
			linkStrength: linkStrength.final,
		})

		circle
			.attr("cx", d => d.x)
			.attr("cy", d => d.y)

		link
			.attr("points", getLinkLine)

		text
			.attr("x", d => d.x)
			.attr("y", d => d.y + textOffset)
			.attr("text-anchor", "middle")
			.text(d => d.id)
	}
}
