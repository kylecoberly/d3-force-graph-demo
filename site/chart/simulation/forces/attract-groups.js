import { getDistance, getCentroids } from "../../utilities.js"

export default function attractGroups(simulation, {
	alphaCutoff,
	chargeStrength,
	distanceCutoff,
	distanceRate,
}) {
	const nodes = simulation.nodes()
	const alpha = simulation.nodes()

	const centroids = getCentroids(nodes)
	nodes.forEach(d => {
		const groupCenter = {
			x: centroids[d.group].x,
			y: centroids[d.group].y,
		}
		const nodePosition = {
			x: d.x,
			y: d.y,
		}
		const distanceToGroup = getDistance(groupCenter, nodePosition)

		let adjustedDistanceCutoff = (alpha < alphaCutoff)
			? distanceCutoff + (distanceRate * (alphaCutoff - alpha))
			: distanceCutoff

		const charge = 1 - chargeStrength
		if (distanceToGroup > adjustedDistanceCutoff) {
			d.x = (nodePosition.x * charge) + (groupCenter.x * charge)
			d.y = (nodePosition.y * charge) + (groupCenter.y * charge)
		}
	})
}

function getDistance({ x: x1, y: y1 }, { x: x2, y: y2 }) {
	const positionDifferential = {
		x: x1 > x2 ? x1 - x2 : x2 - x1,
		y: y1 > y2 ? y1 - y2 : y2 - y1,
	}

	return Math.sqrt(
		positionDifferential.x ** 2
		+ positionDifferential.y ** 2
	)
}
