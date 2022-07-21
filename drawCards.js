// For drawing card images using svg.
// placeCard() accepts the desired card's number code, notes,
// and the DOM element where it should appear.

// this file might be improved with object orientation

// inputs:
// locations on STAFF
// information about notes
// card number

// many constants, to simplify shifts in layout.
const CARD_WIDTH = '300'
const CARD_HEIGHT = '200'
const BLACK_NOTE_RADIUS = '8.5'
const HALF_NOTE_RADIUS = '7'
const CIRCLE_STROKE_WIDTH = '3'
const STEM_STROKE_WIDTH = '5'
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

// returns the y axis for the top of a note's stem.
function stemPlace (y, stemUp, change) {
  let y1 = Number(y)
  if (stemUp) {
    y1 -= change
  } else {
    y1 += change
  }
  return y1.toString()
}

function drawStem (x, y, stemUp) {
  const yStemEnd = stemPlace(y, stemUp, STEM_LENGTH)
  const yStemStart = stemPlace(y, stemUp, STEM_ADJUST)
  const stem = document.createElementNS('http://www.w3.org/2000/svg', 'line')
  stem.setAttribute('x1', x)
  stem.setAttribute('x2', x)
  stem.setAttribute('y1', yStemStart)
  stem.setAttribute('y2', yStemEnd)
  stem.setAttribute('stroke', 'black')
  stem.setAttribute('stroke-width', STEM_STROKE_WIDTH)
  stem.setAttribute('stroke-linejoin', 'round')

  return stem
}

function drawNotehead (x, y, type) {
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

function drawEighthNotePair (location1, location2, stemUp) {
  const yStemEnd1 = stemPlace(location1.y, stemUp, STEM_LENGTH)
  const yStemEnd2 = stemPlace(location2.y, stemUp, STEM_LENGTH)
  const x1 = location1.x
  const y1 = location1.y
  const x2 = location2.x
  const y2 = location2.y
  const head1 = drawNotehead(x1, y1, 'eighth')
  const head2 = drawNotehead(x2, y2, 'eighth')
  const yA1 = stemPlace(location1.y, stemUp, STEM_ADJUST)
  const yA2 = stemPlace(location2.y, stemUp, STEM_ADJUST)
  const beam1 = drawBeam(x1, x2, yA1, yA2, yStemEnd1, yStemEnd2)

  return [head1, head2, beam1]
}

function drawHalfOrQuarterNote (location, type, stemUp) {
  const x = location.x
  const y = location.y
  const notehead = drawNotehead(x, y, type)
  const stem = drawStem(x, y, stemUp)
  return [notehead, stem]
}

function drawStaff () {
  const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line')
  const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line')
  const line3 = document.createElementNS('http://www.w3.org/2000/svg', 'line')
  const line4 = document.createElementNS('http://www.w3.org/2000/svg', 'line')
  const line5 = document.createElementNS('http://www.w3.org/2000/svg', 'line')
  const staff = [line1, line2, line3, line4, line5]
  for (let i = 0; i < 5; i++) { // There will always be five lines on a staff.
    staff[i].setAttribute('x1', '0')
    staff[i].setAttribute('x2', CARD_WIDTH)
    staff[i].setAttribute('y1', STAFF_LINES[i])
    staff[i].setAttribute('y2', STAFF_LINES[i])
    staff[i].setAttribute('stroke', 'lightblue')
    staff[i].setAttribute('stroke-width', STAFF_STROKE_WIDTH)
  }
  return staff
}

function drawColumns () {
  const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line')
  const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line')
  const line3 = document.createElementNS('http://www.w3.org/2000/svg', 'line')
  const line4 = document.createElementNS('http://www.w3.org/2000/svg', 'line')
  const line5 = document.createElementNS('http://www.w3.org/2000/svg', 'line')
  const columns = [line1, line2, line3, line4, line5]
  for (let i = 0; i < 5; i++) {
    columns[i].setAttribute('x1', COLUMNS[i])
    columns[i].setAttribute('x2', COLUMNS[i])
    columns[i].setAttribute('y1', 0)
    columns[i].setAttribute('y2', CARD_HEIGHT)
    columns[i].setAttribute('stroke', 'lightblue')
    columns[i].setAttribute('stroke-dasharray', '3, 5')
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
  const drawnNotes = []
  let noteCount = 0
  for (let i = 0; i < 4; i++) {
    const currentNote = cardNotes[noteCount]
    let xAxis = X_AXES[i]
    const yAxis = VISUAL_STAFF[currentNote.note]
    let stemUp = currentNote.note < 4 // boolean- false for notes on top of staff
    const duration = currentNote.duration
    if (duration === 'eighth') {
      const xAxis1 = xAxis - X_AXIS_Q_OFFSET
      noteCount++
      const xAxis2 = xAxis + X_AXIS_Q_OFFSET
      const secondNote = cardNotes[noteCount].note
      const yAxis2 = VISUAL_STAFF[secondNote]
      if (Math.abs(4 - currentNote.note) < Math.abs(4 - secondNote)) {
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
function drawCard (cardNumber, cardNotes, cardId) {
  // Get the card's number.
  // write the card's number on the card
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('width', CARD_WIDTH)
  svg.setAttribute('height', CARD_HEIGHT)
  svg.setAttribute('class', 'card')
  // svg.setAttribute('id', cardId)
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

// this function generates the controls for a card.
function addCardControl (cardNumber) {
  // const cardDisplay = document.getElementById('cardlist')
  // const title = document.createElement('h1')
  // title.append('Music Cards')
  // title.setAttribute('id', 'example-title')
  // cardDisplay.append(title)

  const cardControl = document.createElement('div')
  cardControl.setAttribute('class', 'card-control')
  // cardControl.setAttribute('id', 'control' + cardNumber)
  const top = document.createElement('div')
  top.setAttribute('class', 'top flip v')
  cardControl.appendChild(top)
  const right = document.createElement('div')
  right.setAttribute('class', 'right flip h')
  cardControl.appendChild(right)
  const bottom = document.createElement('div')
  bottom.setAttribute('class', 'bottom flip v')
  cardControl.appendChild(bottom)
  const left = document.createElement('div')
  left.setAttribute('class', 'left flip h')
  cardControl.appendChild(left)
  return cardControl
}



// placeCard calls drawCard to create a card's svg, which it places
// in the provided DOM element.
function placeCard (cardNumber, cardNotes, cardId, element) {
  const cardToPlaceSVG = drawCard(cardNumber, cardNotes, cardId)
  const cardHolder = document.createElement('div')
  document.getElementById(element).appendChild(cardHolder)
  cardHolder.setAttribute('id', cardId)
  cardHolder.setAttribute('class', 'card-holder')
  cardHolder.appendChild(addCardControl(cardNumber))
  cardHolder.appendChild(cardToPlaceSVG)
  return cardHolder
}
// iterate through notes. Use a while loop to process both quarter notes at once.
// Assign each note or pair of eighth notes to a column
// get the y coordinates of each note
// by looking up a note on the VISUAL_STAFF based on indexOnStaff
// Send x and y coordinates to the correct note drawing function.
// Differentiate eighth notes, which need to be sent as a pair.

function replaceCard (cardNumber, cardNotes, cardId, cardHolder) {
  console.log('parameters: ', cardNumber, cardNotes, cardId, cardHolder)
  const cardToPlaceSVG = drawCard(cardNumber, cardNotes, cardId)
  cardHolder.replaceChild(addCardControl(cardNumber), cardHolder.childNodes[0])
  cardHolder.replaceChild(cardToPlaceSVG, cardHolder.childNodes[1])
  return cardHolder
}
