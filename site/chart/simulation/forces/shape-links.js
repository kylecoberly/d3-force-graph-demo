import { forceManyBody, forceLink, forceCollide } from "d3"

export default function shapeLinks(
	simulation,
	{
		alphaCutoff, chargeStrength, linkDistance,
		collisionStrength, linkStrength,
	}
) {
	const alpha = simulation.alpha()
	if (alpha < alphaCutoff) {
		simulation
			.force("charge", forceManyBody()
				.strength(chargeStrength)
			).force("link", forceLink()
				.id(d => d.id)
				.distance(linkDistance)
				.strength(linkStrength)
			).force("collision", forceCollide(collisionStrength))
	}
}
