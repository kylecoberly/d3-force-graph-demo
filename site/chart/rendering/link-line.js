export default function getLinkLine(d) {
	const radius = 4
	const angle = Math.atan2(d.target.y - d.source.y, d.target.x - d.source.x)
	const cosine = Math.cos(angle) * radius
	const sine = Math.sin(angle) * radius
	return [
		// x1
		d.source.x + cosine,
		// y1
		d.source.y + sine,
		// Midpoint
		(d.source.x / 2) + (d.target.x / 2), (d.source.y / 2) + (d.target.y / 2),
		// x2
		d.target.x - cosine,
		// y2
		d.target.y - sine,
	]
}
