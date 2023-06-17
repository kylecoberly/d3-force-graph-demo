import getSmoothHull from "../site/chart/hull.js"

test("#getSmoothHull 1 point", () => {
	const rawPoints = [
		[0, 0]
	]
	const hullPoints = getSmoothHull(rawPoints, 1)
	expect(hullPoints).toEqual(`
		M 0,-1
		A 1,1,0,0,0,0,1
		A 1,1,0,0,0,0,-1
	`.trim())
})

test("#getSmoothHull 2 points", () => {
	const rawPoints = [
		[0, 0],
		[1, 1],
	]
	const hullPoints = getSmoothHull(rawPoints, 1)
	expect(hullPoints).toEqual(`
		M -0.7071067811865475,-0.7071067811865475
		C 0.14142135623730945,-1.5556349186104044,2.555634918610404,0.8585786437626906,1.7071067811865475,1.7071067811865475
		S -1.5556349186104044,0.14142135623730945,-0.7071067811865475,-0.7071067811865475
		Z
	`.trim())
})

test("#getSmoothHull 3 points", () => {
	const rawPoints = [
		[0, 0],
		[1, 1],
		[2, 2],
	]
	const hullPoints = getSmoothHull(rawPoints, 1)
	expect(hullPoints).toEqual(`
		M 2.7071067811865475,2.7071067811865475
		C 1.8585786437626906,3.555634918610404,-1.5556349186104044,0.14142135623730945,-0.7071067811865475,-0.7071067811865475
		S 3.555634918610404,1.8585786437626906,2.7071067811865475,2.7071067811865475
		Z
	`.trim())
})
