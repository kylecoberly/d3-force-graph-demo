import * as d3 from "d3"

export const chargeForce = d3.forceManyBody()
	.strength(-100)
export const xForce = d3.forceX(0)
export const yForce = d3.forceY(0)
export const collisionForce = d3.forceCollide(3)
export const linkForce = d3.forceLink()
	.id(d => d.id)
	.distance(3)
	.strength(link => {
		if (link.source.group === link.target.group) {
			return 1
		} else {
			return 0.1
		}
	})
