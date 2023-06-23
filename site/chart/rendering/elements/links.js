import { fadeIn } from "../../utilities.js"

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
}
