'use strict';

var SimCL = require("./SimCL.js")
var forceAtlas = require('./forceatlas.js'),
    gaussSeidel = require('./gaussseidel.js'),
    edgeBundling = require('./edgebundling.js'),
    barnesHut = require('./BarnesHut.js');

var defaultControls = {
    simulator: SimCL,
    layoutAlgorithms: [
        {   
            algo: gaussSeidel,
            params: {
                charge: -0.000029360001841802474, 
                gravity: 0.020083175556898723, 
                edgeStrength: 4.292198241799153,
                edgeDistance: 0.0000158
            }
        },{
            algo: edgeBundling,
            params: {
                charge: -0.000029360001841802474, 
                gravity: 0.020083175556898723, 
                edgeStrength: 4.292198241799153,
                edgeDistance: 0.0000158,
            }
        }
    ],
    locks: {
        lockPoints: true,
        lockEdges: true,
        lockMidpoints: false,
        lockMidedges: false  
    }
}

var testControls = {
    simulator: SimCL,
    layoutAlgorithms: [
        {   
            algo: forceAtlas,
            params: {
                gravity: 0.020083175556898723, 
                scalingRatio: 1.0,
                edgeInfluence: 0,
                preventOverlap: false,
                strongGravity: false,
                dissuadeHubs: false,
                linLog: false
            }
        }
    ],
    locks: {
        lockPoints: false,
        lockEdges: false,
        lockMidpoints: false,
        lockMidedges: false  
    }
}

exports.default = defaultControls;
