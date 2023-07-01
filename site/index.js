import data from "./data.json"
const { nodes, links, groups } = data
import runSimulation from "./chart/simulation/simulation.js"
import render from "./chart/rendering/render.js"

renderFilters(groups)

let simulation
rerender("all")

function rerender(groupId) {
	const currentNodeIds = nodes
		.filter(node => groupId === "all" || node.group === groupId)
		.map(({ id }) => id)

	const normalizedLinks = groupId === "all"
		? deepClone(links)
		: deepClone(links)
			.filter(({ source, target }) => {
				return [
					source,
					target,
				].some(node => currentNodeIds.includes(node))
			})

	const linkedNodeIds = normalizedLinks
		.flatMap(({ source, target }) => {
			return ([
				source,
				target,
			])
		})
	const normalizedNodes = getUnique(linkedNodeIds)
		.map(nodeId => nodes
			.find(({ id }) => id === nodeId)
		)

	simulation = runSimulation({
		simulation,
		nodes: deepClone(normalizedNodes),
		links: deepClone(normalizedLinks),
		groups: deepClone(groups),
	})

	render(simulation, {
		currentFilter: groupId,
	})
}

function renderFilters(groups) {
	const $nodeFiltersList = document.querySelector("#node-filters-list")

	const $allOption = document.createElement("option")
	$allOption.value = "all"
	$allOption.textContent = "All"
	$nodeFiltersList.append($allOption)

	groups
		.map(group => {
			const $option = document.createElement("option")
			$option.textContent = group.label
			$option.value = group.id
			return $option
		}).forEach($option => {
			$nodeFiltersList.append($option)
		})

	$nodeFiltersList
		.addEventListener("input", (event) => {
			rerender(event.target.value)
		})

	document
		.querySelector("#reset-filters")
		.addEventListener("click", () => {
			rerender("all")
		})

}

function getUnique(array) {
	return Array.from((new Set(array)))
}

function deepClone(object) {
	return JSON.parse(JSON.stringify(object))
}
