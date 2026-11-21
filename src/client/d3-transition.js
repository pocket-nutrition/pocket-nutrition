// Mermaid's flowcharts call selection.transition() whenever the pointer leaves a node. That method
// is added to d3's selection prototype as a side effect of loading d3-transition, but Mermaid only
// imports `select` through the `d3` barrel, which declares "sideEffects": false: webpack skips
// d3-transition and each mouseout throws. Loading it here, for its side effect, restores the method.
import 'd3-transition';
