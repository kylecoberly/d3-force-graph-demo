import {
	forceSimulation, forceManyBody, forceX,
	forceY, forceCollide, forceLink,
	interpolateZoom,
} from "d3"
import { nodes, links, link, circle, text, linkCounts } from "./data.js"
import simulation from "./simulation.js"
import clampToBoundary from "./rendering/clamp.js"
import getLinkLine from "./rendering/link-line.js"
import attractGroups from "./rendering/attract-groups.js"
import shapeLinks from "./rendering/shape-links.js"
import { zoomer, bounds } from "./chart.js"

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
	textOffset: 4,
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
	.stop()

let count = 300
while (count > 0) {
	simulation.tick()
	ticked()
	count--
}
render({ circle, link, text })

function ticked() {
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
}

function render({ circle, link, text }) {
	circle
		.attr("cx", d => d.x)
		.attr("cy", d => d.y)
		.classed("open", (d) => linkCounts[d.id]?.to === 0)
		.classed("closed", (d) => linkCounts[d.id]?.to !== 0)
		.classed("completed", (d) => d.complete)
		.classed("in-progress", (d) => d["in_progress"])
		.classed("critical", (d) => d.critical)
		.on("click", (event) => {
			const { cx, cy } = event.target.attributes
			// centerNode(cx.value, cy.value)
		})

	link
		.attr("points", getLinkLine)

	text
		.attr("x", d => d.x)
		.attr("y", d => d.y + textOffset)
		.attr("text-anchor", "middle")
		.text(d => d.id)
}

function centerNode(x, y) {
	const transform = bounds.node().attributes?.transform?.value
	const offset = transform
		? transform.match(/translate\((.+?)\)/)[1].split(",").map(match => +match)
		: [0, 0]
	const differential = [
		offset[0] - x,
		offset[1] - y,
	]

	const interpolator = interpolateZoom([offset[0], offset[1], 1], [x, y, 2])
	const zoomAndPan = (t) => {
		const view = interpolator(t)
		const box = bounds.node().getBoundingClientRect()
		const w = box.width
		const h = box.height
		// const k = Math.min(w, h) / view[2]; // scale
		const k = view[2]; // scale
		const translate = [
			w / 2 - view[0] * k,
			h / 2 - view[1] * k
		]; // translate
		console.log(w, h, k, translate)
		return `translate(${translate[0]},${translate[1]}) scale(${k})`
		// `translate(${differential[0]},${differential[1]}) scale(2)`
	}

	bounds.transition().duration(1000).attrTween("transform", () => zoomAndPan)
}
