import { forceManyBody, forceLink, forceCollide } from "d3"

export default function shapeLinks(
	simulation,
	alpha,
	{
		alphaCutoff, chargeStrength, linkDistance,
		collisionStrength, linkStrength,
	}
) {
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
