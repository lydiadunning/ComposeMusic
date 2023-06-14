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
  const STAFF_COLOR = 'thistle'
  const NOTE_COLOR = 'black'
  const CARD_WIDTH = '300'
  const CARD_HEIGHT = '200'
  const BLACK_NOTE_RADIUS = '9'
  const HALF_NOTE_RADIUS = '7'
  const CIRCLE_STROKE_WIDTH = STEM_STROKE_WIDTH = '4'
  const X_AXES = [60, 120, 180, 240]
  const CENTER = 30
  const X_AXIS_E_OFFSET = 15 // distance eighth note pairs shift from center.
  const STEM_LENGTH = 65
  const NOTE_SIDE = 7
  const COLUMNS = ['30', '90', '150', '210', '270']
  const QUARTER_NOTE_WIDTH = '60'
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
        'stroke': 'red',
      }
    )
  }

  // returns the y axis for the top of a note's stem.
  function stemAdjustY (y, stemUp, change = 0) {
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
    const yStemStart = stemAdjustY(y, stemUp)
    return makeSvgWithAttributes(
      'line', 
      {
        'x1': x,
        'x2': x, 
        'y1': yStemStart, 
        'y2': yStemEnd, 
        'stroke': STAFF_COLOR,
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
          'stroke': STAFF_COLOR,
          'stroke-width': CIRCLE_STROKE_WIDTH,
          ...coords
        }
      )
        
    } else {
      return makeSvgWithAttributes(
        'circle',
        {
          'r': BLACK_NOTE_RADIUS,
          'fill': STAFF_COLOR,
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
        'stroke': STAFF_COLOR,
        'stroke-width': STEM_STROKE_WIDTH,
        'stroke-linejoin': 'round',
      }
    )
  }

  function drawEighthNotePair (loc1, loc2, stemUp) {
    const yStemEnd1 = stemAdjustY(loc1.y, stemUp, STEM_LENGTH)
    const yStemEnd2 = stemAdjustY(loc2.y, stemUp, STEM_LENGTH)
    const head1 = drawNotehead(loc1.x, loc1.y, 'e')
    const head2 = drawNotehead(loc2.x, loc2.y, 'e')
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

  function drawStaff (width) {
    const staff = []
    for (let i = 0; i < 5; i++) { // There will always be five lines on a staff.
      const line = makeSvgWithAttributes(
        'line',
        {
          'x1': '0',
          'x2': width,
          'y1': STAFF_LINES[i],
          'y2': STAFF_LINES[i],
          'stroke': STAFF_COLOR,
          'stroke-width': STAFF_STROKE_WIDTH,
        }
      )
      staff.push(line)
    }
    return staff
  }


  //note = {pitch: intNote, duration: ['half', 'quarter', 'eighth']}
  // range of notes = 1-7.  center = 4
  return (note, note2 = false) => {

    const drawnNotes = []
    // loops through quarter note sized chunks, 4 to a card. 
    // i correlates to the current chunk:  | : : : |
    // noteCount correlates to the current note: '4h' or '2q' or '1e' 
    // pitch is the first character in a note, duration is the second.

    const {pitch, duration} = note
    const yAxis = VISUAL_STAFF[pitch]
    let stemUp = pitch < 4 // boolean- false for notes on top of staff
    if (duration === 'eighth') {
      if (note2 && note2.duration =='eighth') {
        const {pitch2, duration2} = note2
        const xAxis1 = CENTER - X_AXIS_E_OFFSET
        const xAxis2 = CENTER + X_AXIS_E_OFFSET
        const yAxis2 = VISUAL_STAFF[pitch2]
        if (Math.abs(4 - pitch2) < Math.abs(4 - pitch2)) { // stem orientation
          stemUp = pitch2 < 4
        }
        drawnNotes.push(drawEighthNotePair({
          x: xAxis1.toString(),
          y: yAxis.toString()
        },
        {
          x: xAxis2.toString(),
          y: yAxis2.toString()
        },
        stemUp))
      }
    } else {
      drawnNotes.push(drawHalfOrQuarterNote({
        x: CENTER.toString(),
        y: yAxis.toString()
      }, duration, stemUp))
    }
    let svgWidth = duration == 'half' ? QUARTER_NOTE_WIDTH * 2 : QUARTER_NOTE_WIDTH

    const svg = makeSvgWithAttributes(
      'svg',
      {
        // 'width': svgWidth,
        // 'height': CARD_HEIGHT,
        'viewBox': `0 0 ${svgWidth} ${CARD_HEIGHT}`
      }
    )
    svg.appendChild(drawStaff(svgWidth))
    const svgComponents = [
      drawStaff(svgWidth),
      drawnNotes
    ].flat()
    svgComponents.forEach(item => svg.appendChild(item))
    return svg
  }
})()

