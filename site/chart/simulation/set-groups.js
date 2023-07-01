export default function setGroups(simulation) {
	const nodes = simulation.nodes()

	simulation.groups
		.forEach(group => {
			const groupCenters = getCentroids(nodes)
			const { id } = group

			group.x = groupCenters[id].x
			group.y = groupCenters[id].y
			group.points = nodes
				.filter(({ group }) => group === id)
				.map(({ x, y }) => [x, y])

			return group
		})
}

function getCentroids(nodes) {
	const groupCoordinates = getGroupCoordinates(nodes)

	const centroids = Object
		.entries(groupCoordinates)
		.reduce((centroids, [group, coordinates]) => {
			const count = coordinates.length;
			let tx = 0;
			let ty = 0;

			coordinates.forEach(([x, y]) => {
				tx += x;
				ty += y;
			})

			const cx = tx / count;
			const cy = ty / count;

			centroids[group] = { x: cx, y: cy }

			return centroids
		}, {})

	return centroids
}

function getGroupCoordinates(nodes) {
	return nodes.reduce((groupCoordinates, node) => {
		groupCoordinates[node.group] = groupCoordinates[node.group] || []
		groupCoordinates[node.group].push([node.x, node.y])
		return groupCoordinates
	}, {})
}
