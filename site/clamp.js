export default function clampToBoundary(nodes, size) {
	nodes.forEach(d => {
		d.x = d3.max([d.x, -size])
		d.y = d3.max([d.y, -size])
		d.x = d3.min([d.x, size])
		d.y = d3.min([d.y, size])
	})
}
