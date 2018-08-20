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
var leftSteps = 1
var rightSteps = 1
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
      // get random numbers
      leftNumber = randomNumber(1, 9)
      rightNumber = randomNumber(1, 9)
      elems.sumleft.innerHTML = leftNumber
      elems.sumright.innerHTML = rightNumber
      // set wrong inputs and update arcs
      leftSteps = randomNumber(1, 9, [leftNumber])
      rightSteps = randomNumber(1, 9, [rightNumber])
      elems.leftinput.value = leftSteps
      elems.rightinput.value = rightSteps
      updateArcs(leftSteps, rightSteps)
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
    suminput: {display: 'block'},
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
    suminput: {display: 'none'},
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
    leftSteps = e.data
    updateArcs(leftSteps, rightSteps)
    if (leftSteps == leftNumber) updateState('firstmatchDone')
  } else {
    elems.leftinput.value = ''
  }
})
elems.rightinput.addEventListener('input', (e) => {
  if (e.data > 0) {
    elems.rightinput.value = e.data
    rightSteps = e.data
    updateArcs(leftSteps, rightSteps)
    if (rightSteps == rightNumber) updateState('secondmatchDone')
  } else {
    elems.rightinput.value = ''
  }
})
elems.suminput.addEventListener('input', (e) => {
  if (e.data > 0) {
    
    let sum = leftNumber + rightNumber
    console.log(`${sum} == ${elems.suminput.value}???`)
    if (elems.suminput.value == sum) updateState('sumDone')
  }
  if (elems.suminput.value.length > 2) elems.suminput.value = ''
})
elems.footer.addEventListener('click', (e) => {
  updateState('initDone')
})
updateState('initDone')

function updateArcs (l, r) {
  ses('leftarc', {
    height: `${21+l*5}px`,
    borderWidth: '3px',
    borderColor: '#cc6292 #cc6292 transparent #cc6292',
    borderRadius: `${21+l*5}px ${21+l*5}px 0px 0px`
  })
  ses('left', {
    position: 'absolute',
    width: `${l*39+3}px`,
    height: `${60+l*5}px`,
    left: '0px',
    bottom: '0px',
  })
  ses('rightarc', {
    height: `${21+r*5}px`,
    borderWidth: '3px',
    borderColor: '#cc6292 #cc6292 transparent #cc6292',
    borderRadius: `${21+l*5}px ${21+l*5}px 0px 0px`
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
