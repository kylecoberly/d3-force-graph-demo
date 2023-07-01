import { moveLink, fadeIn } from "../animations.js"

export default function addLinks(link) {
	link
		.call(renderArrows)
		.append("path")
		.attr("id", ({ source, target }) => (
			`link-${generateLinkId({ source, target })}`
		)).attr("d", generateLinkPath)
		.call(fadeIn)
}

function renderArrows(link) {
	link
		.append("g")
		.append("use")
		.attr("href", "#arrow")
		.attr("width", 2)
		.attr("height", 2)
		.classed("ant", true)
		.call(moveLink)

	link
		.append("animateMotion")
		.attr("dur", "0.5s")
		.attr("repeatCount", "indefinite")
		.append("mpath")
		.attr("href", ({ source, target }) => (
			`#link-${generateLinkId({ source, target })}`
		))
}

export function generateLinkPath({ source, target }) {
	return `M${source.x},${source.y} ${target.x},${target.y}`
}

function generateLinkId({ source, target }) {
	return `${source.id}${target.id}`.replaceAll(" ", "").trim()
}
