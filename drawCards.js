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
  const CARD_WIDTH = '300'
  const CARD_HEIGHT = '200'
  const BLACK_NOTE_RADIUS = '9'
  const HALF_NOTE_RADIUS = '7'
  const CIRCLE_STROKE_WIDTH = '4'
  const STEM_STROKE_WIDTH = '4'
  const X_AXES = [60, 120, 180, 240]
  const X_AXIS_Q_OFFSET = 15
  const X_AXIS_H_OFFSET = 30
  const STEM_LENGTH = 65
  const STEM_ADJUST = 7
  const COLUMNS = ['30', '90', '150', '210', '270']
  const STAFF_LINES = ['40', '70', '100', '130', '160']
  const STAFF_STROKE_WIDTH = '3'
  // the VISUAL_STAFF represents the y axes of notes.
  const VISUAL_STAFF = [160, 145, 130, 115, 100, 85, 70, 55, 40]

  function debugDot (x, y) {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    circle.setAttribute('cx', x)
    circle.setAttribute('cy', y)
    circle.setAttribute('r', '1')
    circle.setAttribute("fill", 'red')
    circle.setAttribute("stroke-color", 'red')
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
      return (parseFloat(x) + STEM_ADJUST).toString()
    } else {
      return (parseFloat(x) - STEM_ADJUST).toString()
    }
  }

  function drawStem (x, y, stemUp) {
    debugDot(x, y)
    const yStemEnd = stemAdjustY(y, stemUp, STEM_LENGTH)
    const yStemStart = stemAdjustY(y, stemUp, 0)
    const stem = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    stem.setAttribute('x1', x)
    stem.setAttribute('x2', x)
    stem.setAttribute('y1', yStemStart)
    stem.setAttribute('y2', yStemEnd)
    stem.setAttribute('stroke', 'black')
    stem.setAttribute('stroke-width', STEM_STROKE_WIDTH)
    stem.setAttribute('stroke-linecap', 'round')

    return stem
  }

  function drawNotehead (x, y, type) {
    // console.log(y)
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    circle.setAttribute('cx', x)
    circle.setAttribute('cy', y)
    if (type === 'half') {
      circle.setAttribute('r', HALF_NOTE_RADIUS)
      circle.setAttribute('fill', 'transparent')
      circle.setAttribute('stroke', 'black')
      circle.setAttribute('stroke-width', CIRCLE_STROKE_WIDTH)
    } else {
      circle.setAttribute('r', BLACK_NOTE_RADIUS)
      circle.setAttribute('fill', 'black')
    }
    return circle
  }

  function drawBeam (x1, x2, y1, y2, yStemEnd1, yStemEnd2) {
    const beam = document.createElementNS('http://www.w3.org/2000/svg', 'polyline')
    beam.setAttribute('points', `${x1},${y1} ${x1},${yStemEnd1} ${x2},${yStemEnd2} ${x2},${y2}`)
    beam.setAttribute('fill', 'none')
    beam.setAttribute('stroke', 'black')
    beam.setAttribute('stroke-width', STEM_STROKE_WIDTH)
    beam.setAttribute('stroke-linejoin', 'round')
    return beam
  }

  function drawEighthNotePair (loc1, loc2, stemUp) {
    const yStemEnd1 = stemAdjustY(loc1.y, stemUp, STEM_LENGTH)
    const yStemEnd2 = stemAdjustY(loc2.y, stemUp, STEM_LENGTH)
    const head1 = drawNotehead(loc1.x, loc1.y, 'eighth')
    const head2 = drawNotehead(loc2.x, loc2.y, 'eighth')
    // const yA1 = stemAdjustY(location1.y, stemUp, STEM_ADJUST)
    // const yA2 = stemAdjustY(location2.y, stemUp, STEM_ADJUST)
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
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      line.setAttribute('x1', '0')
      line.setAttribute('x2', CARD_WIDTH)
      line.setAttribute('y1', STAFF_LINES[i])
      line.setAttribute('y2', STAFF_LINES[i])
      line.setAttribute('stroke', 'lightblue')
      line.setAttribute('stroke-width', STAFF_STROKE_WIDTH)
      staff.push(line)
    }
    return staff
  }

  function drawColumns () {
    const columns = []
    for (let i = 0; i < 5; i++) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      line.setAttribute('x1', COLUMNS[i])
      line.setAttribute('x2', COLUMNS[i])
      line.setAttribute('y1', 0)
      line.setAttribute('y2', CARD_HEIGHT)
      line.setAttribute('stroke', 'lightblue')
      line.setAttribute('stroke-dasharray', '3, 5')
      columns.push(line)
    }
    return columns
  }

  function drawCardOutline () {
    const cardOutline = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    cardOutline.setAttribute('width', CARD_WIDTH)
    cardOutline.setAttribute('height', CARD_HEIGHT)
    cardOutline.setAttribute('fill', 'transparent')
    cardOutline.setAttribute('stroke', 'lightblue')
    cardOutline.setAttribute('stroke-width', '5')
    cardOutline.setAttribute('rx', '15')
    return cardOutline
  }

  // drawAllNotes iterates through notes from the cardNotes array, calling
  // functions to create svg elements for each part of each note
  function drawAllNotes (cardNotes) {
    //console.log(cardNotes)
    const drawnNotes = []
    let noteCount = 0
    for (let i = 0; i < 4; i++) {
      const currentNote = cardNotes[noteCount]
      let xAxis = X_AXES[i]
      //console.log(currentNote, currentNote.pitch)
      const yAxis = VISUAL_STAFF[currentNote.pitch]
      let stemUp = currentNote.pitch < 4 // boolean- false for notes on top of staff
      const duration = currentNote.duration
      if (duration === 'eighth') {
        const xAxis1 = xAxis - X_AXIS_Q_OFFSET
        noteCount++
        const xAxis2 = xAxis + X_AXIS_Q_OFFSET
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
        noteCount++
      } else if (duration === 'half') {
        xAxis += X_AXIS_H_OFFSET
        drawnNotes.push(drawHalfOrQuarterNote({
          x: xAxis.toString(),
          y: yAxis.toString()
        }, duration, stemUp))
        noteCount++
        i++
      } else {
        drawnNotes.push(drawHalfOrQuarterNote({
          x: xAxis.toString(),
          y: yAxis.toString()
        }, duration, stemUp))
        noteCount++
      }
    }
    return drawnNotes.flat()
  }

  // DEBUG - remove
  function drawNumber (cardNumber) {
    const number = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    number.setAttribute('x', '10')
    number.setAttribute('y', '20')
    number.setAttribute('fill', 'black')
    number.setAttribute('font-family', 'Courier')
    number.setAttribute('font-weight', 'bold')
    number.textContent = cardNumber
    return number
  }

  // drawCard calls all of the other functions for creating svg elements
  // and combines them into an svg.
  return (cardNumber, cardNotes) => {
    // Get the card's number.
    // write the card's number on the card
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('width', CARD_WIDTH)
    svg.setAttribute('height', CARD_HEIGHT)
    const cardOutline = drawCardOutline()
    svg.appendChild(cardOutline)
    const number = drawNumber(cardNumber)
    svg.appendChild(number)
    const columns = drawColumns()
    columns.forEach(column => svg.appendChild(column))
    const staff = drawStaff()
    staff.forEach(line => svg.appendChild(line))
    const allNotes = drawAllNotes(cardNotes)
    allNotes.forEach(note => svg.appendChild(note))
    return svg
  }
})()
