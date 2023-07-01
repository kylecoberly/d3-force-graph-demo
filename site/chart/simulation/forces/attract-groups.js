import simulationOptions from "../options.js"

const {
	simulation: {
		alphaCutoff,
	},
	forces: {
		group: {
			charge: groupCharge,
			distance: groupDistance,
		},
	},
} = simulationOptions

export default function attractGroups(simulation) {
	const nodes = simulation.nodes()
	const alpha = simulation.alpha()
	const groupCenters = simulation.groups.reduce((centers, group) => {
		centers[group.id] = {
			x: group.x,
			y: group.y,
		}
		return centers
	}, {})

	nodes.forEach(node => {
		node.groupCenter = {
			x: groupCenters[node.group].x,
			y: groupCenters[node.group].y,
		}

		const distanceToGroup = getDistance(node.groupCenter, { x, y } = node)
		const adjustedDistanceCutoff = (alpha < alphaCutoff)
			? groupDistance.cutoff + (groupDistance.rate * (alphaCutoff - alpha))
			: groupDistance.cutoff
		const charge = 1 - groupCharge.initial
		if (distanceToGroup > adjustedDistanceCutoff) {
			node.x = (node.x * charge) + (node.groupCenter.x * charge)
			node.y = (node.y * charge) + (node.groupCenter.y * charge)
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
