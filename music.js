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

const measureInterpreter = {
  noteCodeLength: 2,
  fliph: function (measure) {
    const lastNoteCodeIndex = -1 * this.noteCodeLength
    let hFlippedMeasure = ''
    while (measure) {
      hFlippedMeasure = hFlippedMeasure.concat(measure.slice(lastNoteCodeIndex))
      measure = measure.substring(0, measure.length - this.noteCodeLength)
    }
    return hFlippedMeasure
  },
  flipv: function (measure) {
    // console.log(measure)
    let newString = ''
    for (let note = 0; note < measure.length; note += 2) {
      const newPitch = STAFF.length - parseInt(measure[note]) - 1
      newString = newString.concat(newPitch.toString(), measure[note + 1])
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
  getNotes: function (measure) {
    // console.log("getNotes string: ", measure)
    const notes = []
    for (let note = 0; note < measure.length; note += 2) {
      notes.push(
        {
          pitch: parseInt(measure[note]),
          duration: this.interpretDuration(measure[note + 1])
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



function checkPhraseConsistency () {
  const virtualMusic = phrase.music
  const phraseInDom = document.getElementById('phrase').children
  if (phraseInDom.length > 0) {
    const domMusic = [...phraseInDom].map(element => element.dataset.measure)
    console.log(`${virtualMusic[0] === domMusic[0]}, ${virtualMusic[1] === domMusic[1]}, ${virtualMusic[2] === domMusic[2]}, ${virtualMusic[3] === domMusic[3]}`)
  }
}

function getIndexInDom (id) {
  //console.log('getIndexInDom')
  //console.log(id)
  const element = document.getElementById(id)
  const siblings = element.parentElement.children
  //console.log('element: ', element)
  //console.log('element.parentElement.children: ', element.parentElement.children)
  return Array.prototype.indexOf.call(siblings, element)
}

// drag and drop using drag and drop API
function dragStartHandler (event) {
  console.log('dragStart')
  event.dataTransfer.setData('measure', event.target.dataset.measure)
  event.dataTransfer.setData('draggedItemId', event.target.id)
  const sourceId = event.currentTarget.parentElement.id
  //console.log(event.currentTarget.parentElement.id)
  //console.log('sourceId: ', sourceId)
  event.dataTransfer.setData('sourceId', sourceId)
  event.dataTransfer.effectAllowed = (sourceId === 'cardlist') ? 'copy'
    : (sourceId === 'workspace') ? 'move'
      : 'copyMove'
  //console.log('event.dataTransfer.effectAllowed: ', event.dataTransfer.effectAllowed)
  //console.log('draggedItemId: ', event.dataTransfer.getData('draggedItemId'))
  //console.log('source: ', event.dataTransfer.getData('sourceId'))
}

function dragOverHandler (event) {
  // preventDefault allows drop operations, the rest determines cursor appearance.
  // dropEffect alters the cursor during the drag operation, but does not persist after drop.
  event.preventDefault()
  // console.log('dragover event.currentTarget: ', event.currentTarget)
  // console.log(event.dataTransfer.getData('source'))
  // if (event.dataTransfer.getData('source') === 'score') {
  //   event.dataTransfer.dropEffect = 'move'
  // } else
  //console.log('in dragOverHandler, id starts with card:', event.currentTarget.id.startsWith('card'))
  if (event.target === event.currentTarget || event.target.parentElement.parentElement === event.currentTarget) {
    //console.log('in if gate within dragOverHandler')
    if (event.dataTransfer.effectAllowed === 'copyMove' && event.currentTarget.id.startsWith('card')) {
      event.dataTransfer.dropEffect = 'move'
    } else if (event.dataTransfer.effectAllowed === 'move') {
      event.dataTransfer.dropEffect = 'move'
    } else {
      event.dataTransfer.dropEffect = 'copy'
    }
  }
  //console.log(`dragOver: dropEffect = ${event.dataTransfer.dropEffect} ; effectAllowed = ${event.dataTransfer.effectAllowed}`)
}

// drop handling functions:
function replacePhrase (replacementPhrase) {
  checkPhraseConsistency()
  console.log('replacePhrase')
  phrase.music.forEach(measure => overflow.add(measure))
  phrase.rewrite(replacementPhrase)
  phraseInDom.rewrite(replacementPhrase)
  checkPhraseConsistency()
}
function moveInPhrase (startIndex, targetIndex) {
  checkPhraseConsistency()
  console.log('moveInPhrase')
  phrase.moveMeasure(startIndex, targetIndex)
  phraseInDom.moveCard(startIndex, targetIndex)
  checkPhraseConsistency ()
}
function addToPhrase (measure) {
  checkPhraseConsistency()
  console.log('addToPhrase')
  phrase.addMeasure(measure)
  phraseInDom.addCard(measure)
  checkPhraseConsistency()
}
function replaceInPhrase (measure, targetIndex, replacedMeasure) {
  checkPhraseConsistency()
  console.log('replaceInPhrase')
  overflow.add(replacedMeasure)
  phrase.replaceMeasure(measure, targetIndex)
  phraseInDom.replaceCard(measure, targetIndex)
  checkPhraseConsistency()
}
function moveCardToPhrase (measure, event, draggedItemId) {
  if (event.currentTarget.id === 'phrase' && phrase.hasSpace()) {
    checkPhraseConsistency()
    console.log('moveCardToPhrase first if')
    //console.log('in phrase')
    addToPhrase(measure)
    checkPhraseConsistency()
  } else if (event.currentTarget.dataset.measure !== measure) {
    checkPhraseConsistency()
    console.log('moveCardToPhrase else if')
    replaceInPhrase(measure, getIndexInDom(event.currentTarget.id), event.currentTarget.dataset.measure)
    checkPhraseConsistency()
  }
  if (draggedItemId.startsWith('of')) {
    checkPhraseConsistency()
    console.log('moveCardToPhrase overflow')
    overflow.remove(measure)
    checkPhraseConsistency()
  }
  if (draggedItemId.startsWith('work')) {
    checkPhraseConsistency()
    console.log('moveCardToPhrase work')
    document.getElementById('workspace').removeChild(document.getElementById(draggedItemId))
    checkPhraseConsistency()
  }
}

function dropHandler (event) {
  console.log('dropHandler')
  // console.log('event: ', event)
  //console.log('dropEffect: ', event.dataTransfer.dropEffect)
  //console.log('effectAllowed: ', event.dataTransfer.effectAllowed)
  //console.log(`dragOver: dropEffect = ${event.dataTransfer.dropEffect} ; effectAllowed = ${event.dataTransfer.effectAllowed}`)

  const draggedItemId = event.dataTransfer.getData('draggedItemId')
  // The event listener was applied to the event's currentTarget, the target
  // registers the event.
  // The currentTarget must be the same as either the target or
  // the target's parent's parent.
  // This prevents the event from firing twice on cards in the phrase.
  if (event.target !== event.currentTarget && event.target.parentElement.parentElement !== event.currentTarget) {
    return
  }
  const source = event.dataTransfer.getData('sourceId')
  if (draggedItemId.startsWith('phrase')) {
    if (source === 'score') {
      //console.log('replace phrase')
      replacePhrase(score.getPhrase(getIndexInDom(draggedItemId)))
    } else {
      replacePhrase(score.readPhrase(document.getElementById(draggedItemId)))
    }
  } else if (source === 'phrase' && event.currentTarget.id.startsWith('card')) {
    //console.log('move in phrase')
    moveInPhrase(getIndexInDom(draggedItemId), getIndexInDom(event.currentTarget.id))
  } else {
    //console.log('not move in phrase')
    moveCardToPhrase(event.dataTransfer.getData('measure'), event, draggedItemId)
  }
  if (!addToScoreIcon.active && !phrase.hasSpace()) {
    addToScoreIcon.activate()
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
    //console.log('measure: ', measure, 'index: ', index)
    if (index >= 0) {
      //console.log('found in reserve')
      this.reserve.unshift(this.reserve.splice(index, 1)[0])
      this.moveToFront(index)
    } else {
      this.addToDOM(measure)
      this.reserve.unshift(measure)

    }
    //console.log(this.reserve)
  },
  remove: function (measure) {
    const index = this.reserve.indexOf(measure)
    this.reserve.splice(index, 1)
    this.removeFromDOM(index)
  },
  addToDOM: function (measure) {
    //console.log(`add ${measure} to DOM`)
    const newElement = this.element.insertBefore(createCard(measure, `of-${this.nextId}`, true), this.element.firstChild)
    newElement.addEventListener('click', (e) => {
      play(measureInterpreter.getNotes(measure))
    })
    this.reserveDOMIds.unshift(`of-${this.nextId}`)
    this.nextId++
    //console.log(this.reserveDOMIds)
  },
  moveToFront: function (index) {
    //console.log(`move ${this.reserveDOMIds[index]} to front`)
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
      //console.log('measure undefined')
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
  rewrite: function (newMusic) {
    this.music = [...newMusic] // this notation creates a new array with the contents of newMusic
    //console.log(this.music)
  },
  playAll: function () {
    // plays the notes in the music array in order.
    // Ideally, this would play one card at a time, maybe with visual effects.
    // I'm not sure yet how to play music in sequence.
    //console.log('phrase.playall')
    play(measureInterpreter.getNotesFromArray(this.music))
  }
}

const score = {
  phrases: [], // phrases here are lists of measures
  phraseId: 0,
  maxLength: 4,
  parentElement: document.getElementById('score'),
  addPhrase: function (listOfMeasures) {
    if (this.phrases.length < this.maxLength) {
      //console.log('addPhrase')
      //console.log(this.phrases)
      //console.log(listOfMeasures)
      this.phrases.push([...listOfMeasures]) // this notation creates a new array with the contents of listOfMeasures
      this.drawPhraseToDom(listOfMeasures)
      //console.log(this.phrases)
    }
  },
  removePhrase: function (id) {
    //console.log('phrases before removal: ', this.phrases)
    this.phrases.splice(getIndexInDom(id), 1)
    this.parentElement.removeChild(document.getElementById(id))
    //console.log('phrases after removal: ', this.phrases)
  },
  drawPhraseToDom: function (listOfMeasures) {
    const newPhrase = this.drawNewPhrase(listOfMeasures)
    this.parentElement.appendChild(newPhrase)
  },
  setPhraseAttributes: function (newPhrase) {
    newPhrase.setAttribute('class', 'phrase')
    newPhrase.setAttribute('id', `phrase-${this.phraseId}`)
    newPhrase.setAttribute('draggable', 'true')
  },
  drawCardsInPhrase: function (listOfMeasures, phrase) {
    for (let i = 0; i < 4; i++) {
      const newCard = createCard(listOfMeasures[i], `${this.phraseId}-${i}`, 1)
      newCard.setAttribute('draggable', 'false')
      phrase.appendChild(newCard)
      //console.log(phrase)
    }
  },
  drawNewPhrase: function (listOfMeasures) {
    //console.log('drawNewPhrase')
    const newPhrase = document.createElement('div')
    this.drawCardsInPhrase(listOfMeasures, newPhrase)
    //console.log(newPhrase)
    newPhrase.addEventListener('click', (e) => {
      this.playPhrase(getIndexInDom(e.currentTarget.id))
    })
    this.setPhraseAttributes(newPhrase)
    this.phraseId++
    newPhrase.addEventListener('dragstart', dragStartHandler)
    return newPhrase
  },
  playPhrase: function (index) {
    play(measureInterpreter.getNotesFromArray(this.phrases[index]))
  },
  playAll: function () {
    play(measureInterpreter.getNotesFromArray(this.phrases))
  },
  getPhrase: function (index) {
    return this.phrases[index]
  },
  readPhrase: function (phraseElement) {
    const measures = []
    //console.log('children: ', phraseElement.children)
    const cards = Array.from(phraseElement.children)
    cards.forEach(card => measures.push(card.dataset.measure))
    return measures
  },
}

function makeIconManager (iconId) {
  return {
    element: document.getElementById(iconId),
    active: false,
    activate: function () {
      this.element.classList.remove('hidden')
      this.active = true
    },
    deactivate: function () {
      this.element.classList.add('hidden')
      this.active = false
    }
  }
}

const addToScoreIcon = makeIconManager('addtoscore')
const playScoreIcon = makeIconManager('playscore')

function cardClickHandler (event) {
  checkPhraseConsistency()
  console.log('cardClickHandler')
  // console.log('cardClickHandler eventtarget: ', event.target.parentElement.parentElement)
  const cardTarget = event.target.parentElement.parentElement
  const operation = event.target.dataset.op
  const measure = cardTarget.dataset.measure
  const style = cardTarget.getAttribute('style')
  let newMeasure = ''
  // console.log('cardClickHandler operation: ', operation)
  if (operation === 'play') {
    play(measureInterpreter.getNotes(measure))
    return
  } else if (operation === 'flipv') {
    newMeasure = measureInterpreter.flipv(measure)
  } else if (operation === 'fliph') {
    newMeasure = measureInterpreter.fliph(measure)
  } else {
    console.log('Something has gone wrong with dataset.op in cardClickHandler')
    return
  }
  const parent = cardTarget.parentElement
  if (parent.id === 'phrase') {
    const index = getIndexInDom(cardTarget.id)
    phrase.replaceMeasure(newMeasure, index)
    phraseInDom.replaceCard(newMeasure, index).setAttribute('style', style)
  } else {
    const newCard = createCard(newMeasure, cardTarget.id)
    newCard.setAttribute('style', style)
    parent.insertBefore(newCard, cardTarget)
    parent.removeChild(cardTarget)
  }
  checkPhraseConsistency()
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

function setCardAttributes (card, id) {
  card.setAttribute('id', id)
  card.setAttribute('class', 'card')
  card.setAttribute('draggable', 'true')
}

function createCard (measure, id, simple = null) {
  const card = document.createElement('div')
  //console.log('measure: ', measure, 'id: ', id)
  setCardAttributes(card, id)
  card.dataset.measure = measure
  if (!simple) {
    card.appendChild(addCardControl())
  }
  card.appendChild(drawCard(measure, measureInterpreter.getNotes(measure)))
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
    return newCard
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
    return newCard
  },
  moveCard: function (index1, index2) {
    //console.log('in movecard: ', index1, index2)
    if (this.phraseElement.children.length - 1 === index2) {
      this.phraseElement.appendChild(this.phraseElement.children[index1])
    } else {
      const cardToMove = this.removeCard(index1)
      this.phraseElement.insertBefore(cardToMove, this.phraseElement.children[index2])
    }
  },
  removeCard: function (index) {
    //console.log('in removeCard: ', index, this.phraseElement.children[index])
    return this.phraseElement.removeChild(this.phraseElement.children[index])
  },
  clear: function () {
    let count = this.phraseElement.children.length
    while (count > 0) {
      // console.log(phrase.firstElementChild)
      this.phraseElement.removeChild(this.phraseElement.firstElementChild)
      count--
    }
  },
  rewrite: function (music) {
    this.clear()
    music.forEach(measure => {
      this.addCard(measure)
    })
  }
}

phraseInDom.phraseElement.addEventListener('dragover', dragOverHandler)
phraseInDom.phraseElement.addEventListener('drop', dropHandler)

// displays list of cards to choose from
function showAllCards () {
  const cardDisplay = document.getElementById('cardlist')

  measures.forEach(measure => {
    //console.log('measure: ', measure)
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
  phrase.music.forEach(measure => overflow.add(measure))
  phrase.clear()
  phraseInDom.clear()
  addToScoreIcon.deactivate()
}

const playAllButton = document.getElementById('playall')
playAllButton.onclick = () => {
  phrase.playAll()
}

const addToScoreButton = document.getElementById('addtoscore')
addToScoreButton.onclick = () => {
  score.addPhrase(phrase.music)
  if (!playScoreIcon.active) {
    playScoreIcon.activate()
  }
}

const playScore = document.getElementById('playscore')
playScore.onclick = () => {
  score.playAll()
  //console.log('all phrases in score', score.phrases)
}

let workid = 0
const workspace = document.getElementById('workspace')
workspace.addEventListener('dragover', (event) => {
  event.preventDefault()
  event.dataTransfer.dropEffect = 'copy'
})

function stylePositionInWorkspace (element, event) {
  const workspaceLocation = workspace.getBoundingClientRect()
  const width = element.offsetWidth
  const height = element.offsetHeight
  const newX = event.pageX - workspaceLocation.x - (width / 2)
  const newY = event.pageY - workspaceLocation.y - (height / 2)
  return `width: ${width}px; height: ${height}px; position: absolute; top: ${newY}px; left: ${newX}px`
}

workspace.addEventListener('drop', (event) => {
  event.preventDefault()
  const element = document.getElementById(event.dataTransfer.getData('draggedItemId'))
  let newElement = null
  let source = event.dataTransfer.getData('sourceId')
  if (source === 'score') {
    const indexInDom = getIndexInDom(event.dataTransfer.getData('draggedItemId'))
    //console.log('indexInDom', indexInDom)
    newElement = score.drawNewPhrase(score.getPhrase(indexInDom))
    workspace.appendChild(newElement)
  } else {
    newElement = createCard(event.dataTransfer.getData('measure'), `work-${workid}`)
    workspace.appendChild(newElement)
  }
  workid++
  newElement.setAttribute('style', stylePositionInWorkspace(element, event))
})

document.getElementById('trash').addEventListener('dragover', (event) => {
  event.preventDefault()
  if (event.dataTransfer.effectAllowed === 'copy') {
    event.dataTransfer.dropEffect = 'none'
  } else {
    event.dataTransfer.dropEffect = 'move'
  }
})



document.getElementById('trash').addEventListener('drop', (event) => {
  event.preventDefault()
  //console.log('trashed')
  const sourceId = event.dataTransfer.getData('sourceId')
  const draggedItemId = event.dataTransfer.getData('draggedItemId')
  if (sourceId === 'phrase') {
    const index = getIndexInDom(draggedItemId)
    phrase.removeMeasure(index)
    phraseInDom.removeCard(index)
    overflow.add(event.dataTransfer.getData('measure'))
    if (addToScoreIcon.active) {
      addToScoreIcon.deactivate()
    }
  } else if (sourceId === 'overflow') {
    overflow.remove(event.dataTransfer.getData('measure'))
  } else if (sourceId === 'score') {
    //console.log('phrases in score: ', score.phrases)
    score.readPhrase(document.getElementById(draggedItemId)).forEach(measure => overflow.add(measure))
    score.removePhrase(draggedItemId)
    if (score.phrases.length === 0) {
      playScoreIcon.deactivate()
    }
  } else if (sourceId === 'workspace') {
    if (!draggedItemId.startsWith('phrase')) {
      overflow.add(event.dataTransfer.getData('measure'))
    } else {
      score.readPhrase(document.getElementById(draggedItemId)).forEach(measure => overflow.add(measure))
    }
    workspace.removeChild(document.getElementById(draggedItemId))
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
