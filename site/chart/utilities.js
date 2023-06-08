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

export function getSine(nodeRadius, { target, source }) {
	const angle = Math.atan2(target.y - source.y, target.x - source.x)
	const cosine = Math.cos(angle) * nodeRadius
	const sine = Math.sin(angle) * nodeRadius

	return { sine, cosine }
}

export function getSegmentCount(segmentLength, { source, target }) {
	const distance = getDistance(source, target)
	return Math.ceil(distance / segmentLength)
}

export function generateMidPoints(count, { source, target }) {
	const midPoints = []
	// if (count % 2 === 0) count--

	for (let proportion = 2; count > 0; proportion *= 2, count -= 2) {
		if (count % 2 !== 0) {
			// Pivot value
			midPoints.push(...getMidPoint(proportion, { source, target }))
			// Since 2 will be taken off at increment
			count++
			continue
		}

		const [x1, y1, x2, y2] = getMidPointPairs(proportion, { source, target })

		midPoints.unshift(x1, y1)
		midPoints.push(x2, y2)
	}

	return midPoints
}

export function getMidPointPairs(proportion, { source, target }) {
	const [x1, y1] = getMidPoint(proportion, { source, target })
	const dx1 = x1 - source.x
	const dy1 = y1 - source.y

	const [x2, y2] = [
		target.x === source.x
			? target.x
			: target.x - dx1,
		target.y === source.y
			? target.y
			: target.y - dy1,
	]

	return [x1, y1, x2, y2]
}

export function getMidPoint(proportion, { source, target }) {
	return [
		((target.x - source.x) * (1 / proportion)) + source.x,
		((target.y - source.y) * (1 / proportion)) + source.y,
	]
}

export function centerToRadius(radius, { source, target }) {
	const { sine, cosine } = getSine(radius, { target, source })
	source = {
		...source,
		x: source.x + cosine,
		y: source.y + sine,
	}
	target = {
		...target,
		x: target.x - cosine,
		y: target.y - sine,
	}

	return { source, target }
}

export function clampToLowerBound(limit, value) {
	return (value < limit) ? limit : value
}

export function generateMidPointsAlt(count, { source, target }) {
	const dx = target.x - source.x
	const dy = target.y - source.y

	const segmentLengthX = dx / count
	const segmentLengthY = dy / count

	const midPoints = []
	for (let iteration = 1; iteration <= count; iteration++) {
		midPoints.push(source.x + (segmentLengthX * iteration))
		midPoints.push(source.y + (segmentLengthY * iteration))
	}

	return midPoints
}
