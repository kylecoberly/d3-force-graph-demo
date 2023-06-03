import * as d3 from "d3"
import { collisionForce, xForce, yForce, linkForce, chargeForce } from "./forces"
import { nodes, links } from "./data"

export default simulation = d3.forceSimulation()
	.nodes(nodes)
	.force("charge", chargeForce)
	.force("x", xForce)
	.force("y", yForce)
	.force("collision", collisionForce)
	.force("link", linkForce.links(links))
