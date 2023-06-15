import {
	positionArrow, addLink, addMarchingAnts,
	addTextLabel, addCircles
} from "./elements.js"

export default function render({ linkGroup, node, linkCounts, text }) {
	node
		.each((_, i, nodes) => {
			addCircles(nodes[i], linkCounts)
		})

	text
		.each((_, i, nodes) => {
			addTextLabel(nodes[i])
		})

	linkGroup
		.each(({ source, target }, i, nodes) => {
			addLink(nodes[i])
			addMarchingAnts(nodes[i], { source, target })
		})
}
