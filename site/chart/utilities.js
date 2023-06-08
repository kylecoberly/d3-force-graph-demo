export function getCentroids(nodes) {
	const groupCoordinates = getGroupCoordinates(nodes)

	return Object
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
}

export function getGroupCoordinates(nodes) {
	return nodes.reduce((groupCoordinates, node) => {
		groupCoordinates[node.group] = groupCoordinates[node.group] || []
		groupCoordinates[node.group].push([node.x, node.y])
		return groupCoordinates
	}, {})
}

export function getDistance({ x: x1, y: y1 }, { x: x2, y: y2 }) {
	const positionDifferential = {
		x: x1 > x2 ? x1 - x2 : x2 - x1,
		y: y1 > y2 ? y1 - y2 : y2 - y1,
	}

	return Math.sqrt(
		positionDifferential.x ** 2
		+ positionDifferential.y ** 2
	)
}

export function getSegmentCount(segmentLength, { source, target }) {
	const distance = getDistance(source, target)
	return Math.ceil(distance / segmentLength)
}

export function clampToLowerBound(limit, value) {
	return (value < limit) ? limit : value
}

export function centerToRadius(radius, { source, target }) {
	const { sine, cosine } = getSine(radius, { target, source })

	return {
		source: {
			...source,
			x: source.x + cosine,
			y: source.y + sine,
		}, target: {
			...target,
			x: target.x - cosine,
			y: target.y - sine,
		}
	}
}

export function getMidPoint({ source, target }, proportion = 2) {
	return [
		((target.x - source.x) * (1 / proportion)) + source.x,
		((target.y - source.y) * (1 / proportion)) + source.y,
	]
}

export function getSine(nodeRadius, { target, source }) {
	const angle = Math.atan2(target.y - source.y, target.x - source.x)
	const cosine = Math.cos(angle) * nodeRadius
	const sine = Math.sin(angle) * nodeRadius

	return { sine, cosine }
}

export function generateMidPoints(count, { source, target }) {
	const dx = target.x - source.x
	const dy = target.y - source.y

	const segmentLengthX = dx / count
	const segmentLengthY = dy / count

	const midPoints = []
	for (let iteration = 1; iteration <= count - 1; iteration++) {
		midPoints.push(
			source.x + (segmentLengthX * iteration),
			source.y + (segmentLengthY * iteration),
		)
	}

	return midPoints
}
