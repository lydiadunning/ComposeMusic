// For drawing card images using svg.
// placeCard() accepts the desired card's number code, notes,
// and the DOM element where it should appear.

// this file might be improved with object orientation

// inputs:
// locations on STAFF
// information about notes
// card number

// drawCard is an immediately invoked function expression. It contains all
// the information used to draw a card, and returns a function for drawing
// the card.
const drawCard = (function () {
  // many constants, to simplify shifts in layout.
  const COLOR = 'thistle'
  const CARD_WIDTH = '300'
  const CARD_HEIGHT = '200'
  const BLACK_NOTE_RADIUS = '9'
  const HALF_NOTE_RADIUS = '7'
  const CIRCLE_STROKE_WIDTH = STEM_STROKE_WIDTH = '4'
  const X_AXES = [60, 120, 180, 240]
  const X_AXIS_E_OFFSET = 15 // distance eighth note pairs shift from center.
  const STEM_LENGTH = 65
  const NOTE_SIDE = 7
  const COLUMNS = ['30', '90', '150', '210', '270']
  const STAFF_LINES = ['40', '70', '100', '130', '160']
  const STAFF_STROKE_WIDTH = '3'
  // the VISUAL_STAFF represents the y axes of notes.
  const VISUAL_STAFF = [160, 145, 130, 115, 100, 85, 70, 55, 40]

  // a function to set attributes of an svg component.
  // the attributes parameter expects an object
  function makeSvgWithAttributes (type, attributes) {
    newSvgElement = document.createElementNS('http://www.w3.org/2000/svg', type)
    Object.keys(attributes).forEach(key => newSvgElement.setAttribute(key, attributes[key]))
    return newSvgElement
  }

  // debug. places a red dot in the given location.
  function debugDot (x, y) {
    return makeSvgWithAttributes(
      'circle',
      {
        'cx': x,
        'cy': y,
        'r': '1',
        'fill': 'red',
        'stroke-color': 'red',
      }
    )
  }

  // returns the y axis for the top of a note's stem.
  function stemAdjustY (y, stemUp, change) {
    let y1 = Number(y)
    if (stemUp) {
      y1 -= change
    } else {
      y1 += change
    }
    return y1.toString()
  }

  // returns the x axis on the side of a note
  function stemAdjustX (x, stemUp) {
    if (stemUp) {
      return (parseFloat(x) + NOTE_SIDE).toString()
    } else {
      return (parseFloat(x) - NOTE_SIDE).toString()
    }
  }

  function drawStem (x, y, stemUp) {
    const yStemEnd = stemAdjustY(y, stemUp, STEM_LENGTH)
    const yStemStart = stemAdjustY(y, stemUp, 0)
    return makeSvgWithAttributes(
      'line', 
      {
        'x1': x,
        'x2': x, 
        'y1': yStemStart, 
        'y2': yStemEnd, 
        'stroke': 'black',
        'stroke-width': STEM_STROKE_WIDTH,
        'stroke-linecap': 'round'
      }
    )
  }

  function drawNotehead (x, y, type) {
    const coords = {'cx': x, 'cy': y}
    if (type === 'half') {
      return makeSvgWithAttributes(
        'circle',
        {
          'r': HALF_NOTE_RADIUS,
          'fill': 'transparent',
          'stroke': 'black',
          'stroke-width': CIRCLE_STROKE_WIDTH,
          ...coords
        }
      )
        
    } else {
      return makeSvgWithAttributes(
        'circle',
        {
          'r': BLACK_NOTE_RADIUS,
          'fill': 'black',
          ...coords
        }
      )
    }
  }

  function drawBeam (x1, x2, y1, y2, yStemEnd1, yStemEnd2) {
    return makeSvgWithAttributes(
      'polyline',
      {
        'points': `${x1},${y1} ${x1},${yStemEnd1} ${x2},${yStemEnd2} ${x2},${y2}`,
        'fill': 'none',
        'stroke': 'black',
        'stroke-width': STEM_STROKE_WIDTH,
        'stroke-linejoin': 'round',
      }
    )
  }

  function drawEighthNotePair (loc1, loc2, stemUp) {
    const yStemEnd1 = stemAdjustY(loc1.y, stemUp, STEM_LENGTH)
    const yStemEnd2 = stemAdjustY(loc2.y, stemUp, STEM_LENGTH)
    const head1 = drawNotehead(loc1.x, loc1.y, 'eighth')
    const head2 = drawNotehead(loc2.x, loc2.y, 'eighth')
    const beam1 = drawBeam(stemAdjustX(loc1.x, stemUp), stemAdjustX(loc2.x, stemUp), loc1.y, loc2.y, yStemEnd1, yStemEnd2)

    return [head1, head2, beam1]
  }

  function drawHalfOrQuarterNote (loc, type, stemUp) {
    const notehead = drawNotehead(loc.x, loc.y, type)
    // moves stem to the side of the note
    loc.x = stemAdjustX(loc.x, stemUp)
    const stem = drawStem(loc.x, loc.y, stemUp)
    return [notehead, stem]
  }

  function drawStaff () {
    const staff = []
    for (let i = 0; i < 5; i++) { // There will always be five lines on a staff.
      const line = makeSvgWithAttributes(
        'line',
        {
          'x1': '0',
          'x2': CARD_WIDTH,
          'y1': STAFF_LINES[i],
          'y2': STAFF_LINES[i],
          'stroke': COLOR,
          'stroke-width': STAFF_STROKE_WIDTH,
        }
      )
      staff.push(line)
    }
    return staff
  }

  function drawColumns () {
    const columns = []
    for (let i = 0; i < 5; i++) {
      const line = makeSvgWithAttributes(
        'line',
        {
          'x1': COLUMNS[i],
          'x2': COLUMNS[i],
          'y1': 0,
          'y2': CARD_HEIGHT,
          'stroke': COLOR,
          'stroke-dasharray': '3, 5',
        }
      )
      columns.push(line)
    }
    return columns
  }

  function drawCardOutline () {
    return makeSvgWithAttributes(
      'rect',
      {
        'width': CARD_WIDTH,
        'height': CARD_HEIGHT,
        'fill': 'white',
        'stroke': COLOR,
        'stroke-width': '5',
        'rx': '15',
      }
    )
  }

  // drawAllNotes iterates through notes from the cardNotes array, calling
  // functions to create svg elements for each part of each note
  function drawAllNotes (cardNotes) {
    const drawnNotes = []
    let noteCount = 0
    // loops through quarter note sized chunks, 4 to a card
    for (let i = 0; i < 4; i++) {
      const currentNote = cardNotes[noteCount]
      let xAxis = X_AXES[i]
      const yAxis = VISUAL_STAFF[currentNote.pitch]
      let stemUp = currentNote.pitch < 4 // boolean- false for notes on top of staff
      const duration = currentNote.duration
      if (duration === 'eighth') {
        const xAxis1 = xAxis - X_AXIS_E_OFFSET
        // increments noteCount to draw two eighth notes
        noteCount++
        const xAxis2 = xAxis + X_AXIS_E_OFFSET
        const secondNote = cardNotes[noteCount].pitch
        const yAxis2 = VISUAL_STAFF[secondNote]
        if (Math.abs(4 - currentNote.pitch) < Math.abs(4 - secondNote)) {
          stemUp = secondNote < 4
        }
        // range of notes = 1-7.  center = 4
        // stemUp = stemUp || cardNotes[noteCount].note < 4 // just in case

        drawnNotes.push(drawEighthNotePair({
          x: xAxis1.toString(),
          y: yAxis.toString()
        },
        {
          x: xAxis2.toString(),
          y: yAxis2.toString()
        },
        stemUp))
      } else {
        drawnNotes.push(drawHalfOrQuarterNote({
          x: xAxis.toString(),
          y: yAxis.toString()
        }, duration, stemUp))
        if (duration === 'half') {
          i++
        }
      }
      noteCount++
    }
    return drawnNotes.flat()
  }

  // DEBUG - remove
  // function drawNumber (cardNumber) {
  //   const number = makeSvgWithAttributes(
  //     'text',
  //     {
  //       'x': '10',
  //       'y': '20',
  //       'fill': 'black',
  //       'font-family': 'Courier',
  //       'font-weight': 'bold',
  //     }
  //   )
  //   number.textContent = cardNumber
  //   return number
  // }

  // drawCard calls all of the other functions for creating svg elements
  // and combines them into an svg.
  return (cardNotes) => {
    const svg = makeSvgWithAttributes(
      'svg',
      {
        // 'width': CARD_WIDTH,
        // 'height': CARD_HEIGHT,
        'viewBox': `0 0 ${CARD_WIDTH} ${CARD_HEIGHT}`
      }
    )
    const svgComponents = [
      drawCardOutline(),
      // drawNumber(cardNumber),
      drawColumns(),
      drawStaff(),
      drawAllNotes(cardNotes)
    ].flat()
    svgComponents.forEach(item => svg.appendChild(item))
    return svg
  }
})()

