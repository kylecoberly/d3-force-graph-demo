import { forceManyBody, forceLink, forceCollide } from "d3"
import simulationOptions from "../options.js"
const {
	simulation: {
		alphaCutoff,
	},
	forces: {
		charge,
		collision,
		link: {
			distance: linkDistance,
			strength: linkStrength,
		},
	},
} = simulationOptions

export default function shapeLinks(simulation) {
	const alpha = simulation.alpha()

	if (alpha < alphaCutoff) {
		simulation
			.force("charge", forceManyBody()
				.strength(charge.final)
			).force("link", forceLink()
				.id(({ id }) => id)
				.distance(linkDistance.final)
				.strength(linkStrength.final)
			).force("collision", forceCollide(collision.final))
	}
}
