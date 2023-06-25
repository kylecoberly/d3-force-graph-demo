import { fadeIn } from "../../utilities.js"
import options from "../options.js"
import { toDegrees } from "../../utilities.js"
const {
	chart: {
		transitionRate,
	},
} = options


export default function addLinks(link) {
	link
		.append("path")
		.attr("id", ({ source, target }) => `
			link-${source.id}${target.id}
		`.replaceAll(" ", "").trim())
		.attr("d", ({ source, target }) => `
			M${source.x},${source.y} ${target.x},${target.y}
		`.trim())
		.call(fadeIn)

	link.call(renderArrows)
}

function renderArrows(link) {
	const offset = {
		x: 0,
		y: -1,
	}

	link
		.append("g")
		.append("use")
		.attr("href", "#arrow")
		.attr("width", 2)
		.attr("height", 2)
		.classed("ant", true)
		.transition()
		.duration(transitionRate)
		.attr("transform", ({ target, source }) => {
			const dx = target.x - source.x
			const dy = target.y - source.y
			const angle = toDegrees(Math.atan2(dy, dx))
			return `rotate(${angle}) translate(${offset.x}, ${offset.y})`
		})

	link
		.append("animateMotion")
		.attr("dur", "0.5s")
		.attr("repeatCount", "indefinite")
		.append("mpath")
		.attr("href", ({ source, target }) => {
			const id = `${source.id}${target.id}`.replaceAll(" ", "")
			return `#link-${id}`
		})
}
