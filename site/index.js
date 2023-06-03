import { ticked } from "./draw"
import { node, link, circle, text } from "./elements"
import simulation from "./simulation"

simulation.on("tick", ticked({ node, circle, link, text }))
