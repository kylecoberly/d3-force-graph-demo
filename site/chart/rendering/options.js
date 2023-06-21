const options = {
	chart: {
		height: 600,//window.innerHeight * 0.8,
		width: 1000,//window.innerWidth * 0.8,
		boundary: 400,//window.innerWidth * 0.7,
		resetScalingFactor: 5,
	},
	zoom: {
		initialScale: 4,
		initialCoordinates: { x: 0, y: 0 },
		minimum: 4,
		maximum: 30,
		constraintFactor: 7,
	},
	focus: {
		duration: 500,
		scale: 18,
	},
}

export default options
