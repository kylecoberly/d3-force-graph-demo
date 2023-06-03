import {
	forceSimulation, forceManyBody, forceX,
	forceY, forceCollide, forceLink,
} from "d3"
import { nodes, node, links, link, circle, text } from "./data.js"
import ticked from "./draw.js"

const chargeForce = forceManyBody()
	.strength(-100)
const xForce = forceX(0)
const yForce = forceY(0)
const collisionForce = forceCollide(3)
const linkForce = forceLink()
	.id(({ id }) => id)
	.distance(3)
	.strength(({ source, target }) => source.group === target.group ? 1 : 0.1)

export default simulation = forceSimulation()
	.nodes(nodes)
	.force("charge", chargeForce)
	.force("x", xForce)
	.force("y", yForce)
	.force("collision", collisionForce)
	.force("link", linkForce.links(links))

simulation.on("tick", ticked({ node, circle, link, text }))
