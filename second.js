'use strict'
var _elems = [
  'congrats',
  'sumleft',
  'sumright',
  'sumquestion',
  'suminput',
  'left',
  'leftnumber',
  'leftinput',
  'leftarc',
  'right',
  'rightnumber',
  'rightinput',
  'rightarc',
  'footer'
]
var elems = {}
_elems.forEach(id => elems[id] = document.getElementById(id))

// random numbers
function randomNumber (min, max, exept=[]) {
  let n = Math.floor(Math.random() * max) + min
  return exept.indexOf(n) < 0 ? n : randomNumber(min, max, exept)
}
// set element style
function ses (id, obj) {
  Object.entries(obj).forEach(p => elems[id].style[p[0]] = p[1])
}
var leftNumber = 1
var rightNumber = 1

var svgLeft = d3.select("#leftarc").append("svg")
var svgRight = d3.select("#rightarc").append("svg")
var lline = svgLeft.append("path")
var rline = svgRight.append("path")
var lineFunction = d3.line()
  .x(function(d, i) { return d.x })
  .y(function(d) { return d.y })
  .curve(d3.curveBundle)

var markerLeft = svgLeft.append('defs')
  .append('marker').attr('id', 'arrow')
  .attr('viewBox', '0 0 30 30')
  .attr('refX', 20)
  .attr('refY', 5)
  .attr('markerWidth', 10)
  .attr('markerHeight', 20)
  .attr('orient', 'auto')
  .attr("stroke", "#cc6292")
  .attr("stroke-width", 2)
  .attr("fill", "none")
  .append('path').attr("d", 'M 0 0 L 20 5 L 0 10')

var markerRight = svgRight.append('defs')
  .append('marker').attr('id', 'arrow')
  .attr('viewBox', '0 0 30 30')
  .attr('refX', 20)
  .attr('refY', 5)
  .attr('markerWidth', 10)
  .attr('markerHeight', 20)
  .attr('orient', 'auto')
  .attr("stroke", "#cc6292")
  .attr("stroke-width", 2)
  .attr("fill", "none")
  .append('path').attr("d", 'M 0 0 L 20 5 L 0 10')

var state = 'initDone'
var states = {
  initDone: {
    congrats: {display: 'none'},
    sumleft: {background: 'orange'},
    sumright: {background: 'none'},
    sumquestion: {display: 'block', background: 'none'},
    suminput: {display: 'none'},
    leftinput: {display: 'block', color: 'red'},
    leftnumber: {display: 'none'},
    right: {display: 'none'},
    rightinput: {display: 'none'},
    rightnumber: {display: 'none'},
    job: function () {
      console.log('initDone!')
      // ? the sum
      elems.sumquestion.innerHTML = '?'
      // get numbers
      let randSum = randomNumber(11, 4)
      console.log('randSum: ', randSum)
      leftNumber = randomNumber(1, 9, [1,2,3,4,5])
      rightNumber = randSum - leftNumber
      elems.sumleft.innerHTML = leftNumber
      elems.sumright.innerHTML = rightNumber
      // set wrong inputs and update arcs
      // leftSteps = randomNumber(1, 9, [leftNumber])
      // rightSteps = randomNumber(1, 9, [rightNumber])
      elems.leftinput.value = ''
      elems.rightinput.value = ''
      updateArcs(leftNumber, rightNumber)
      // focus on left input
      elems.leftinput.focus()
    }
  },
  firstmatchDone: {
    sumleft: {background: 'none'},
    sumright: {background: 'orange'},
    sumquestion: {display: 'block'},
    suminput: {display: 'none'},
    leftinput: {display: 'none'},
    leftnumber: {display: 'block'},
    right: {display: 'block'},
    rightinput: {display: 'block'},
    rightnumber: {display: 'none'},
    job: function () {
      console.log('firstmatchDone!')
      elems.leftnumber.innerHTML = leftNumber
      elems.rightinput.focus()
    }
  },
  secondmatchDone: {
    sumleft: {background: 'none'},
    sumright: {background: 'none'},
    sumquestion: {display: 'none'},
    suminput: {display: 'block', color: 'red'},
    leftinput: {display: 'none'},
    leftnumber: {display: 'block'},
    rightinput: {display: 'none'},
    rightnumber: {display: 'block'},
    job: function () {
      console.log('secondmatchDone!')
      elems.rightnumber.innerHTML = rightNumber
      elems.suminput.focus()
    }
  },
  sumDone: {
    congrats: {display: 'block'},
    sumleft: {background: 'none'},
    sumright: {background: 'none'},
    sumquestion: {display: 'block', background: 'green'},
    suminput: {display: 'none', color: 'black'},
    leftinput: {display: 'none'},
    leftnumber: {display: 'block'},
    rightinput: {display: 'none'},
    rightnumber: {display: 'block'},
    job: function () {
      console.log('sumDone!')
      // hightlight the sum
      elems.sumquestion.innerHTML = elems.suminput.value
      // clear sum input
      elems.suminput.value = ''
      // start new game...
      setTimeout(() => {
        updateState('initDone')
      }, 1500)
    }
  }
}
// add listeners
elems.leftinput.addEventListener('input', (e) => {
  if (e.data > 0) {
    elems.leftinput.value = e.data
    if (e.data == leftNumber) updateState('firstmatchDone')
  } else {
    elems.leftinput.value = ''
  }
})
elems.rightinput.addEventListener('input', (e) => {
  if (e.data > 0) {
    elems.rightinput.value = e.data
    if (e.data == rightNumber) updateState('secondmatchDone')
  } else {
    elems.rightinput.value = ''
  }
})
elems.suminput.addEventListener('input', (e) => {
  let sum = leftNumber + rightNumber
  console.log(`${sum} == ${elems.suminput.value}???`)
  if (elems.suminput.value == sum) updateState('sumDone')
  if (elems.suminput.value.length > 2) elems.suminput.value = ''
})
updateState('initDone')

function updateArcs (l, r) {
  var ldata = [
    { "x": 0,   "y": 25+l*5},
    { "x": (l*39)/2,  "y": -10},
    { "x": l*39+2,  "y": 25+l*5}
  ]
  var rdata = [
    { "x": 0,   "y": 25+r*5},
    { "x": (r*39)/2,  "y": -10},
    { "x": r*39+2,  "y": 25+r*5}
  ]

  svgLeft
    .attr("width", l*39+2)
    .attr("height", 28+l*5)

  svgRight
    .attr("width", r*39+2)
    .attr("height", 28+r*5)

  lline
    .attr("d", lineFunction(ldata))
    .attr("stroke", "#cc6292")
    .attr("stroke-width", 2)
    .attr("fill", "none")

  rline
    .attr("d", lineFunction(rdata))
    .attr("stroke", "#cc6292")
    .attr("stroke-width", 2)
    .attr("fill", "none")

  svgLeft.selectAll('path')
    .attr("marker-end", 'url(#arrow)')
  svgRight.selectAll('path')
    .attr("marker-end", 'url(#arrow)')

  ses('left', {
    position: 'absolute',
    width: `${l*39+3}px`,
    height: `${60+l*5}px`,
    left: '0px',
    bottom: '0px',
  })
  ses('right', {
    position: 'absolute',
    width: `${r*39+3}px`,
    height: `${60+r*5}px`,
    left: `${l*39}px`,
    bottom: '0px'
  })
}

function updateState (s) {
  if (states[s]) {
    // update styles
    Object.entries(states[s]).forEach(p => {
      ses(p[0], p[1])
    })
    // then do the job
    states[s].job()
  }
}
