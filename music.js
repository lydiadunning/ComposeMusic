// Creating a one page site to play music based on Think Fun's discontinued
// game Compose Yourself.

// Uses https://github.com/meenie/band.js/

// STAFF lists all notes that may appear. It exists only for reference, and its
// contents shouldn't change.
const STAFF = ['line1', 'space1', 'line2', 'space2', 'line3', 'space3', 'line4', 'space4', 'line5']
// CMAJOR lists the pitch of notes from STAFF in the key C Major
const CMAJOR = ['E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F5'] // input for band.js

const measures = [
  '1q2q3q4q',
  '2h6q5q',
  '5h4q4e1e',
  '6q2q3h',
  '4q1q6h',
  '2q1h4e6e',
  '4h4q5q',
  '5e1e5h3q',
  '5q4e6e6e3e4e3e',
  '5e3e5h5q',
  '4h2q1e5e',
  '1q4h2q',
  '2q1h6e2e',
  '1h3e4e1e2e',
  '1h1e3e4e1e',
  '3q1q1h',
  '6q4q2q3q',
  '4q3q3h',
  '4h5e4e3e4e',
  '3e2e1q4e3e5q',
  '5e5e2q6h',
  '4q3h1e1e',
  '2q5q1e4e1e6e',
  '5e6e5h5q',
  '2e6e3h5e3e',
  '6q6e4e2q1e4e',
  '3e4e3e2e1h',
  '1q6q1e5e2e4e',
  '4e1e4e5e6h',
  '5h2q1e2e',
  '3h1e2e6q',
  '3q5q1e1e5q',
  '2e1e2h2e6e']

const noteStringInterpreter = {
  noteCodeLength: 2,
  fliph: function (noteString) {
    const lastNoteCodeIndex = -1 * this.noteCodeLength
    let hFlippedNoteString = ''
    while (noteString) {
      hFlippedNoteString = hFlippedNoteString.concat(noteString.slice(lastNoteCodeIndex))
      noteString = noteString.substring(0, noteString.length - this.noteCodeLength)
    }
    return hFlippedNoteString
  },
  flipv: function (noteString) {
    // console.log(noteString)
    let newString = ''
    for (let note = 0; note < noteString.length; note += 2) {
      const newPitch = STAFF.length - parseInt(noteString[note]) - 1
      newString = newString.concat(newPitch.toString(), noteString[note + 1])
    }
    return newString
  },
  interpretDuration: function (duration) {
    switch (duration) {
      case 'h': return 'half'
      case 'q': return 'quarter'
      case 'e': return 'eighth'
      default: throw new Error('not a valid duration: ', duration)
    }
  },
  getNotes: function (noteString) {
    // console.log("getNotes string: ", noteString)
    const notes = []
    for (let note = 0; note < noteString.length; note += 2) {
      notes.push(
        {
          pitch: parseInt(noteString[note]),
          duration: this.interpretDuration(noteString[note + 1])
        }
      )
    }
    return notes
  },
  getNotesFromArray: function (arrayOfMeasures) {
    return this.getNotes(arrayOfMeasures.flat().join(''))
  }
}

// plays sequences of music by interfacing with band.js
// the callback is present as a reminder that it might be used to
// play music in succession.car
function play (notes /*, callback = () => {} */) {
  // accepts a list of notes formatted to play and an optional callback function
  var conductor = new window.BandJS()
  conductor.setTimeSignature(4, 4)
  conductor.setTempo(120)
  var piano = conductor.createInstrument()
  notes.forEach((x) => {
    piano.note(x.duration, CMAJOR[x.pitch])
  })
  var player = conductor.finish()
  player.play()
  // conductor.setOnFinishedCallback(callback)
}

function getIndexInDom (id) {
  // console.log(id)
  const element = document.getElementById(id)
  const siblings = element.parentElement.children
  // console.log('element: ', element)
  return Array.prototype.indexOf.call(siblings, element)
}

// drag and drop using drag and drop API
function dragStartHandler (event) {
  console.log('dragStart')
  event.dataTransfer.setData('measure', event.target.dataset.measure)
  event.dataTransfer.setData('draggedCardId', event.target.id)
  if (event.currentTarget.parentElement.id === 'cardlist') {
    event.dataTransfer.effectAllowed = 'copy'
  } else if (event.currentTarget.parentElement.id === 'overflow') {
    event.dataTransfer.effectAllowed = 'move'
  } else {
    event.dataTransfer.effectAllowed = 'copyMove'
  }
  console.log('event.dataTransfer.effectAllowed: ', event.dataTransfer.effectAllowed)
}

function dragOverHandler (event) {
  // preventDefault allows drop operations, the rest determines cursor appearance.
  event.preventDefault()
  // console.log('dragover event.currentTarget: ', event.currentTarget)
  if (event.target === event.currentTarget || event.target.parentElement.parentElement === event.currentTarget) {
    if (event.dataTransfer.effectAllowed === 'move') {
      event.dataTransfer.dropEffect = 'move'
    } else if (event.dataTransfer.effectAllowed === 'copyMove' && event.currentTarget.id.startsWith('card')) {
      event.dataTransfer.dropEffect = 'move'
    } else {
      event.dataTransfer.dropEffect = 'copy'
    }
  }
  console.log(`dragOver: dropEffect = ${event.dataTransfer.dropEffect} ; effectAllowed = ${event.dataTransfer.effectAllowed}`)
}

function dropHandler (event) {
  console.log('dropHandler')
  // console.log('event: ', event)
  console.log('dropEffect: ', event.dataTransfer.dropEffect)
  console.log('effectAllowed: ', event.dataTransfer.effectAllowed)

  const draggedItemId = event.dataTransfer.getData('draggedCardId')
  // Same outcome as if e.t == e.cT or e.t.pE.pE == e.cT then handle the event
  // The event listener was applied to the event's currentTarget, the target
  // registers the event.
  // The currentTarget must be the same as either the target or
  // the target's parent's parent.
  // This prevents the event from firing twice on cards in the phrase.
  if (event.target !== event.currentTarget && event.target.parentElement.parentElement !== event.currentTarget) {
    // console.log('event.target: ', event.target)
    // console.log('event.currentTarget: ', event.currentTarget)
    // console.log('event.target.parentElement.parentElement: ', event.target.parentElement.parentElement)
    console.log('ignore drop event')
    return
  }
  // console.log('event.currentTarget.id: ', event.currentTarget.id)
  // I tried to use the dataTransfer.dropEffect set in dragOver for this but it returned null.
  // dropEffect alters the cursor during the drag operation, but does not persist after drop.
  if (event.dataTransfer.effectAllowed === 'copyMove' && event.currentTarget.id.startsWith('card')) {
    console.log('move in phrase')
    const targetIndex = getIndexInDom(event.currentTarget.id)
    const startIndex = getIndexInDom(draggedItemId)
    phrase.moveMeasure(startIndex, targetIndex)
    phraseInDom.moveCard(startIndex, targetIndex)
  } else {
    console.log('not move in phrase')
    const measure = event.dataTransfer.getData('measure')
    if (event.currentTarget.id === 'phrase') {
      console.log('in phrase')
      if (phrase.hasSpace()) {
        phrase.addMeasure(measure)
        phraseInDom.addCard(measure)
      }
    } else {
      console.log('not in phrase')
      if (event.currentTarget.dataset.measure !== measure) {
        const targetIndex = getIndexInDom(event.currentTarget.id)
        overflow.add(event.currentTarget.dataset.measure)
        phrase.replaceMeasure(measure, targetIndex)
        phraseInDom.replaceCard(measure, targetIndex)
      }
    }
    if (draggedItemId.startsWith('of')) {
      overflow.remove(measure)
    }
  }
}

const overflow = {
  // reserve and reserveDOMIds both use unshift, mirroring dom behavior.
  // They should parallell each other.
  reserve: [],
  reserveDOMIds: [],
  nextId: 0,
  element: document.getElementById('overflow'),
  add: function (measure) {
    const index = this.reserve.indexOf(measure)
    console.log('measure: ', measure, 'index: ', index)
    if (index >= 0) {
      console.log('found in reserve')
      this.reserve.unshift(this.reserve.splice(index, 1)[0])
      this.moveToFront(index)
    } else {
      this.addToDOM(measure)
      this.reserve.unshift(measure)

    }
    console.log(this.reserve)
  },
  remove: function (measure) {
    const index = this.reserve.indexOf(measure)
    this.reserve.splice(index, 1)
    this.removeFromDOM(index)
  },
  addToDOM: function (measure) {
    console.log(`add ${measure} to DOM`)
    const newElement = this.element.insertBefore(createCard(measure, `of-${this.nextId}`, true), this.element.firstChild)
    newElement.addEventListener('click', (e) => {
      play(noteStringInterpreter.getNotes(measure))
    })
    this.reserveDOMIds.unshift(`of-${this.nextId}`)
    this.nextId++
    console.log(this.reserveDOMIds)
  },
  moveToFront: function (index) {
    console.log(`move ${this.reserveDOMIds[index]} to front`)
    const id = this.reserveDOMIds.splice(index, 1)[0]
    this.element.insertBefore(document.getElementById(id), this.element.firstChild)
    this.reserveDOMIds.unshift(id)
  },
  removeFromDOM: function (index) {
    this.element.removeChild(document.getElementById(this.reserveDOMIds[index]))
    this.reserveDOMIds.splice(index, 1)
  }
}

const phrase = {
  music: [],
  lengthLimit: 4,
  addMeasure: function (measure) {
    if (!measure) {
      console.log('measure undefined')
    }
    this.music.push(measure)
  },
  replaceMeasure: function (newMeasure, index) {
    // overflow.add(this.music[index])
    this.music[index] = newMeasure
  },
  moveMeasure: function (index1, index2) {
    const measure = this.music.splice(index1, 1)[0]
    this.music.splice(index2, 0, measure)
  },
  removeMeasure: function (indexToRemove) {
    this.music.splice(indexToRemove, 1)
  },
  clear: function () {
    while (this.music.length > 0) {
      this.music.pop()
    }
  },
  hasSpace: function () {
    return this.music.length < this.lengthLimit
  },
  playAll: function () {
    // plays the notes in the music array in order.
    // Ideally, this would play one card at a time, maybe with visual effects.
    // I'm not sure yet how to play music in sequence.
    console.log('phrase.playall')
    play(noteStringInterpreter.getNotesFromArray(this.music))

  }
}

const score = {
  phrases: [], // phrases here are lists of measures
  phraseId: 0,
  parentElement: document.getElementById('score'),
  playElement: document.getElementById('playscore'),
  addPhrase: function (listOfMeasures) {
    console.log('addPhrase')
    console.log(this.phrases)
    console.log(listOfMeasures)
    this.phrases.push([...listOfMeasures])
    this.drawNewPhrase(listOfMeasures)
    console.log(this.phrases)
  },
  removePhrase: function (id) {
    this.phrases.splice(getIndexInDom(id), 1)
    this.parentElement.removeChild(document.getElementById(id))
  },
  drawNewPhrase: function (listOfMeasures) {
    console.log('drawNewPhrase')

    const newPhrase = document.createElement('div')
    for (let i = 0; i < 4; i++) {
      const newCard = createCard(listOfMeasures[i], `${this.phraseId}-${i}`, 1)
      newCard.setAttribute('draggable', 'false')
      newPhrase.appendChild(newCard)
      console.log(newPhrase)
    }
    console.log(newPhrase)
    const play = document.createElement('div')
    play.setAttribute('class', 'play')
    play.addEventListener('click', (e) => {
      console.log('e.target: ', e.target.parentElement.id)
      this.playPhrase(getIndexInDom(e.target.parentElement.id))
    })
    newPhrase.appendChild(play)
    newPhrase.setAttribute('class', 'phrase')
    newPhrase.setAttribute('id', `phrase-${this.phraseId}`)
    this.phraseId++
    newPhrase.setAttribute('draggable', 'true')
    this.parentElement.insertBefore(newPhrase, this.playElement)

  },
  playPhrase: function (index) {
    play(noteStringInterpreter.getNotesFromArray(this.phrases[index]))
  },
  playAll: function () {
    play(noteStringInterpreter.getNotesFromArray(this.phrases))
  }
}

function cardClickHandler (event) {
  // console.log('cardClickHandler eventtarget: ', event.target.parentElement.parentElement)
  const cardTarget = event.target.parentElement.parentElement
  const operation = event.target.dataset.op
  const measure = cardTarget.dataset.measure
  let newMeasure = ''
  // console.log('cardClickHandler operation: ', operation)
  if (operation === 'play') {
    play(noteStringInterpreter.getNotes(measure))
    return
  } else if (operation === 'flipv') {
    newMeasure = noteStringInterpreter.flipv(measure)
  } else if (operation === 'fliph') {
    newMeasure = noteStringInterpreter.fliph(measure)
  } else {
    console.log('Something has gone wrong with dataset.op in cardClickHandler')
    return
  }
  const parent = cardTarget.parentElement
  if (parent.id === 'phrase') {
    const index = getIndexInDom(cardTarget.id)
    phrase.replaceMeasure(newMeasure, index)
    phraseInDom.replaceCard(newMeasure, index)
  } else {
    parent.insertBefore(createCard(newMeasure, cardTarget.id), cardTarget)
    parent.removeChild(cardTarget)
  }
}

// this function generates the controls for a card.
function addCardControl () {
  const cardControl = document.createElement('div')
  cardControl.setAttribute('class', 'card-control')
  const properties = [
    ['top', 'flipv'],
    ['right', 'fliph'],
    ['bottom', 'flipv'],
    ['left', 'fliph'],
    ['center', 'play']]
  properties.forEach(prop => {
    const newElement = document.createElement('div')
    // console.log('assigning cardControl')
    // console.log('prop: ', prop)
    newElement.setAttribute('class', prop[0])
    newElement.dataset.op = prop[1]
    cardControl.appendChild(newElement)
    newElement.addEventListener('click', cardClickHandler)
  })
  return cardControl
}

function createCard (measure, id, simple = null) {
  const card = document.createElement('div')
  // console.log('measure: ', measure, 'id: ', id)
  card.setAttribute('id', id)
  card.setAttribute('class', 'card')
  card.setAttribute('draggable', 'true')
  card.dataset.measure = measure
  if (!simple) {
    card.appendChild(addCardControl())
  }
  card.appendChild(drawCard(measure, noteStringInterpreter.getNotes(measure)))
  // console.log(cardHolder.dataset.cardnumber)
  card.addEventListener('dragstart', dragStartHandler)
  return card
}

const phraseInDom = {
  phraseElement: document.getElementById('phrase'),
  nextId: 0,

  addCard: function (measure) {
    const newCard = this.phraseElement.appendChild(createCard(measure, `card-${this.nextId}`))
    this.nextId++
    newCard.addEventListener('dragover', dragOverHandler)
    newCard.addEventListener('drop', dropHandler)
  },
  replaceCard: function (measure, index) {
    // console.log('phraseInDom.replaceCard index:', index)
    // console.log(this.phraseElement.children)
    const cardToReplace = this.phraseElement.children[index]
    // console.log('cardToReplace: ', cardToReplace)
    const newCard = this.phraseElement.insertBefore(createCard(measure, cardToReplace.id), cardToReplace)
    this.phraseElement.removeChild(cardToReplace)
    newCard.addEventListener('dragover', dragOverHandler)
    newCard.addEventListener('drop', dropHandler)
  },
  moveCard: function (index1, index2) {
    if (this.phraseElement.children.length - 1 === index2) {
      this.phraseElement.appendChild(this.phraseElement.children[index1])
    } else {
      const cardToMove = this.removeCard(index1)
      this.phraseElement.insertBefore(cardToMove, this.phraseElement.children[index2])
    }
  },
  removeCard: function (index) {
    return this.phraseElement.removeChild(this.phraseElement.children[index])
  },
  clear: function () {
    let count = this.phraseElement.children.length
    while (count > 0) {
      // console.log(phrase.firstElementChild)
      this.phraseElement.removeChild(this.phraseElement.firstElementChild)
      count--
    }
  }
}

phraseInDom.phraseElement.addEventListener('dragover', dragOverHandler)
phraseInDom.phraseElement.addEventListener('drop', dropHandler)

// displays list of cards to choose from
function showAllCards () {
  const cardDisplay = document.getElementById('cardlist')

  measures.forEach(measure => {
    console.log('measure: ', measure)
    const id = `${measure}-example`
    const newCard = createCard(measure, id)
    newCard.addEventListener('dragstart', dragStartHandler)
    newCard.dataset.measure = measure
    cardDisplay.appendChild(newCard)
  })
  return document.getElementsByClassName('example-card')
}
showAllCards()

const clearButton = document.getElementById('clear')
clearButton.onclick = () => {
  // console.log('clear button clicked')
  phrase.clear()
  phraseInDom.clear()
}

const playAllButton = document.getElementById('playall')
playAllButton.onclick = () => {
  phrase.playAll()
}

const addToScoreButton = document.getElementById('addtoscore')
addToScoreButton.onclick = () => {
  score.addPhrase(phrase.music)
}

const playScore = document.getElementById('playscore')
playScore.onclick = () => {
  score.playAll()
}

document.getElementById('trash').addEventListener('dragover', (event) => {
  event.preventDefault()
  // const id = event.dataTransfer.getData('draggedCardId')
  // console.log('trash dragged id: ', id)
  // console.log(event.effectAllowed)
  if (event.dataTransfer.effectAllowed === 'copy') {
    event.dataTransfer.dropEffect = 'none'
  } else {
    event.dataTransfer.dropEffect = 'move'
  }
  // console.log('event.dataTransfer.effectAllowed: ', event.dataTransfer.efffectAllowed, 'event.dataTransfer.dropEffect: ', event.dataTransfer.dropEffect)
})
document.getElementById('trash').addEventListener('drop', (event) => {
  event.preventDefault()
  console.log('trashed')
  const id = event.dataTransfer.getData('draggedCardId')
  console.log(id)
  if (id.startsWith('card')) {
    const index = getIndexInDom(id)
    phrase.removeMeasure(index)
    phraseInDom.removeCard(index)
    overflow.add(event.dataTransfer.getData('measure'))
  } else if (id.startsWith('of')) {
    overflow.remove(event.dataTransfer.getData('measure'))
  }
})

// TODO: clickable cards. drag and drop to change order, delete, flip.
// TODO: typed text always goes into the input?
// TODO: save list function
// TODO: stack list function
// -- Display the stack stacked or expanded. if stacked, draw the cards on top of each other
// -- Create the notes in order, with the color starting at black and getting grayer for each layer
// -- Add the notes to the sgv in reverse order, so the black layer goes on top.
// -- Display card numbers in sequence (write these in a final step. limit to what will fit, add ... if necessary).
