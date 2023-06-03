import { forceManyBody, forceLink } from "d3"

export default function shapeLinks(simulation, alpha) {
	if (alpha < 0.2) {
		simulation.force("charge", forceManyBody()
			.strength(-20)
		).force("link", forceLink()
			.id(d => d.id)
			.distance(3)
			.strength(1)
		)
	}
}
