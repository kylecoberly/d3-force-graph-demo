export const {
	chart,
	zoom,
	focus,
} = {
	chart: {
		height: 600,//window.innerHeight * 0.8,
		width: 1000,//window.innerWidth * 0.8,
		boundary: 400,//window.innerWidth * 0.7,
	},
	zoom: {
		initial: 4,
		minimum: 4,
		maximum: 30,
		constraintFactor: 7,
	},
	focus: {
		duration: 500,
		scale: 18,
	},
}
