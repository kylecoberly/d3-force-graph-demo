import { forceLink } from "d3"
import options from "../options.js"

const {
	forces: {
		link: {
			distance: linkDistance,
			strength: linkStrength,
		},
		group: {
			link: {
				strength: groupLinkStrength,
			},
		},
	},
} = options

export default function createLinkForce() {
	return forceLink()
		.id(({ id }) => id)
		.distance(linkDistance.initial)
		.strength(({ source, target }) => (
			source.group === target.group
				? groupLinkStrength.initial
				: linkStrength.initial
		))
}
