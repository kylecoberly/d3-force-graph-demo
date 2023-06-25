export function addArrow(defs) {
	defs
		.append("symbol")
		.attr("id", "arrow")
		.attr("viewBox", "0 0 10 10")
		.append("path")
		.classed("arrow", true)
		.attr("d", `
			M 0 0
			L 10 5
			L 0 10
			L 5 5
			z
		`)
}

export function addCircle(defs) {
	defs
		.append("symbol")
		.attr("id", "circle")
		.attr("viewBox", "-5 -5 10 10")
		.append("circle")
		.attr("r", 4)
		.attr("cx", 0)
		.attr("cr", 0)
}
