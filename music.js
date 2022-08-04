// Creating a one page site to play music based on Think Fun's discontinued
// game Compose Yourself.

// Uses https://github.com/meenie/band.js/

// STAFF lists all notes that may appear. It exists for reference, and its contents shouldn't change.
const STAFF = ['line1', 'space1', 'line2', 'space2', 'line3', 'space3', 'line4', 'space4', 'line5']
// CMAJOR lists the pitch of notes from STAFF in the key C Major
const CMAJOR = ['E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F5'] // input for band.js

// Notes' properties: location on the staff, duration (quarter note, half note, eighth note)
function MyNote (onStaff, duration = 'quarter') {
  this.onStaff = onStaff // integer index of the location of the note on the staff in orientation 1
  this.duration = duration
  this.flipV = function () {
    return STAFF.length - onStaff - 1
  }
  // getOnStaff returns an individual note's location on the staff.
  // the note's location always depends on card orientation.
  this.getOnStaff = function (orientation) {
    switch (orientation) {
      case '1': // fallthrough
      case '3': return onStaff
      case '2': // fallthrough
      case '4': return this.flipV()
      default: throw new Error('invalid orientation')
    }
  }
  this.getNoteToPlay = function (orientation) {
    // This method returns a note's pitch in C major based on its location on the staff.
    // It returns a new object, with information playable by band.js.
    // It could be updated with a key signature parameter.
    return { pitch: CMAJOR[this.getOnStaff(orientation)], duration: duration }
  }
}

// Card objects model the cards used for music composition
// cards are always instatiated with a three number code, used to identify the card,
// as well as an array of notes objects for the card as they appear in orientation 1.
// the card has two other essential attributes, number and orientation. the orientation
// is set based on user input, and the number adds the orientation to the three number code.
function Measure (firstThreeNumbers, notes1) {
  // all of the numbers mentioned here are strings of numbers used as reference codes. rename?
  this.firstThreeNumbers = firstThreeNumbers
  this.notes1 = notes1 // array of the notes in orientation 1
  this.setOrientation = function (orientation) {
    this.orientation = orientation
    this.numbers = firstThreeNumbers + orientation
  }
  this.reverseNotes = function () {
    return this.notes1.slice(0).reverse() // reverse edits this slice, not this.notes1
  }
  // getNotes returns an array of notes formatted as input for drawing an svg image
  this.getNotes = function () {
    let notes = []
    switch (this.orientation) {
      case '1': // fallthrough return this.notes1
      case '4': notes = this.notes1; break
      case '2': // fallthrough
      case '3': notes = this.reverseNotes(); break
    }
    return notes.map(x => ({ note: x.getOnStaff(this.orientation), duration: x.duration }))
  }
  // getNotesToPlay returns an array of notes formatted for playing music with band.js
  this.getNotesToPlay = function () {
    let notes = []
    switch (this.orientation) {
      case '1':
      case '4': notes = this.notes1; break
      case '2': // fallthrough
      case '3': notes = this.reverseNotes(); break
    }
    return notes.map(x => x.getNoteToPlay(this.orientation))
  }
  // flipH flips the card horizontally by changing the orientation
  this.flipH = function () {
    switch (this.orientation) {
      case '1': this.orientation = '3'; break
      case '3': this.orientation = '1'; break
      case '2': this.orientation = '4'; break
      case '4': this.orientation = '2'; break
      default: throw new Error('invalid orientation')
    }
  }
  // flipV flips the card vertically by changing the orientation
  this.flipV = function () {
    switch (this.orientation) {
      case '1': this.orientation = '4'; break
      case '3': this.orientation = '2'; break
      case '2': this.orientation = '3'; break
      case '4': this.orientation = '1'; break
      default: throw new Error('invalid orientation')
    }
  }
}

const cardDeck = [new Measure('400', [new MyNote(2, 'half'), new MyNote(6, 'quarter'), new MyNote(5, 'quarter')]),
            new Measure('401', [new MyNote(5, 'half'), new MyNote(4, 'quarter'), new MyNote(4, 'eighth'), new MyNote(1, 'eighth')]),
            new Measure('402', [new MyNote(6, 'quarter'), new MyNote(2, 'quarter'), new MyNote(3, 'half')]),
            new Measure('405', [new MyNote(4, 'quarter'), new MyNote(1, 'quarter'), new MyNote(6, 'half')]),
            new Measure('406', [new MyNote(2, 'quarter'), new MyNote(1, 'half'), new MyNote(4, 'eighth'), new MyNote(6, 'eighth')]),
            new Measure('408', [new MyNote(4, 'half'), new MyNote(4, 'quarter'), new MyNote(5, 'quarter')]),
            new Measure('409', [new MyNote(5, 'eighth'), new MyNote(1, 'eighth'), new MyNote(5, 'half'), new MyNote(3, 'quarter')]),
            new Measure('410', [new MyNote(5, 'quarter'), new MyNote(4, 'eighth'), new MyNote(6, 'eighth'), new MyNote(6, 'eighth'), new MyNote(3, 'eighth'), new MyNote(4, 'eighth'), new MyNote(3, 'eighth')]),
            new Measure('411', [new MyNote(5, 'eighth'), new MyNote(3, 'eighth'), new MyNote(5, 'half'), new MyNote(5, 'quarter')]),
            new Measure('412', [new MyNote(4, 'half'), new MyNote(2, 'quarter'), new MyNote(1, 'eighth'), new MyNote(5, 'eighth')]),
            new Measure('413', [new MyNote(1, 'quarter'), new MyNote(4, 'half'), new MyNote(2, 'quarter')]),
            new Measure('414', [new MyNote(2, 'quarter'), new MyNote(1, 'half'), new MyNote(6, 'eighth'), new MyNote(2, 'eighth')]),
            new Measure('415', [new MyNote(1, 'half'), new MyNote(3, 'eighth'), new MyNote(4, 'eighth'), new MyNote(1, 'eighth'), new MyNote(2, 'eighth')]),
            new Measure('416', [new MyNote(1, 'half'), new MyNote(1, 'eighth'), new MyNote(3, 'eighth'), new MyNote(4, 'eighth'), new MyNote(1, 'eighth')]),
            new Measure('417', [new MyNote(3, 'quarter'), new MyNote(1, 'quarter'), new MyNote(1, 'half')]),
            new Measure('418', [new MyNote(6, 'quarter'), new MyNote(4, 'quarter'), new MyNote(2, 'quarter'), new MyNote(3, 'quarter')]),
            new Measure('419', [new MyNote(4, 'quarter'), new MyNote(3, 'quarter'), new MyNote(3, 'half')]),
            new Measure('420', [new MyNote(4, 'half'), new MyNote(5, 'eighth'), new MyNote(4, 'eighth'), new MyNote(3, 'eighth'), new MyNote(4, 'eighth')]),
            new Measure('421', [new MyNote(3, 'eighth'), new MyNote(2, 'eighth'), new MyNote(1, 'quarter'), new MyNote(4, 'eighth'), new MyNote(3, 'eighth'), new MyNote(5, 'quarter')]),
            new Measure('423', [new MyNote(5, 'eighth'), new MyNote(5, 'eighth'), new MyNote(2, 'quarter'), new MyNote(6, 'half')]),
            new Measure('424', [new MyNote(4, 'quarter'), new MyNote(3, 'half'), new MyNote(1, 'eighth'), new MyNote(1, 'eighth')]),
            new Measure('427', [new MyNote(2, 'quarter'), new MyNote(5, 'quarter'), new MyNote(1, 'eighth'), new MyNote(4, 'eighth'), new MyNote(1, 'eighth'), new MyNote(6, 'eighth')]),
            new Measure('428', [new MyNote(5, 'eighth'), new MyNote(6, 'eighth'), new MyNote(5, 'half'), new MyNote(5, 'quarter')]),
            new Measure('429', [new MyNote(2, 'eighth'), new MyNote(6, 'eighth'), new MyNote(3, 'half'), new MyNote(5, 'eighth'), new MyNote(3, 'eighth')]),
            new Measure('430', [new MyNote(6, 'quarter'), new MyNote(6, 'eighth'), new MyNote(4, 'eighth'), new MyNote(2, 'quarter'), new MyNote(1, 'eighth'), new MyNote(4, 'eighth')]),
            new Measure('431', [new MyNote(3, 'eighth'), new MyNote(4, 'eighth'), new MyNote(3, 'eighth'), new MyNote(2, 'eighth'), new MyNote(1, 'half')]),
            new Measure('432', [new MyNote(1, 'quarter'), new MyNote(6, 'quarter'), new MyNote(1, 'eighth'), new MyNote(5, 'eighth'), new MyNote(2, 'eighth'), new MyNote(4, 'eighth')]),
            new Measure('433', [new MyNote(4, 'eighth'), new MyNote(1, 'eighth'), new MyNote(4, 'eighth'), new MyNote(5, 'eighth'), new MyNote(6, 'half')]),
            new Measure('437', [new MyNote(5, 'half'), new MyNote(2, 'quarter'), new MyNote(1, 'eighth'), new MyNote(2, 'eighth')]),
            new Measure('438', [new MyNote(3, 'half'), new MyNote(1, 'eighth'), new MyNote(2, 'eighth'), new MyNote(6, 'quarter')]),
            new Measure('439', [new MyNote(3, 'quarter'), new MyNote(5, 'quarter'), new MyNote(1, 'eighth'), new MyNote(1, 'eighth'), new MyNote(5, 'quarter')]),
            new Measure('441', [new MyNote(2, 'eighth'), new MyNote(1, 'eighth'), new MyNote(2, 'half'), new MyNote(2, 'eighth'), new MyNote(6, 'eighth')]),
]








// play plays sequences of music by interfacing with band.js
// the callback is present as a reminder that it might be used to
// play music in succession.
function play (notes /*, callback = () => {} */) {
  // accepts a list of notes formatted to play and an optional callback function
  var conductor = new window.BandJS()
  conductor.setTimeSignature(4, 4)
  conductor.setTempo(120)
  var piano = conductor.createInstrument()
  notes.forEach((x) => {
    piano.note(x.duration, x.pitch)
  })
  var player = conductor.finish()
  player.play()
  // conductor.setOnFinishedCallback(callback)
}

function checkIfMeasure (cardInput) {
  const firstThree = cardInput.slice(0, 3)
  const fourth = cardInput[3]
  return (cardDeck.some(card => card.firstThreeNumbers === firstThree)) &&
         (1 <= fourth && fourth <= 4) &&
         (cardInput.length === 4)
}


// displays all newly created cards
function showAllMeasures () {
  const cardDisplay = document.getElementById('cardlist')
  let i = 0

  cardDeck.forEach(card => {
    const cardNumber = card.firstThreeNumbers + '1'
    card.setOrientation('1')
    const cardLink = document.createElement('div')
    const newId = cardNumber + '-example'
    cardLink.setAttribute('id', newId)
    cardLink.setAttribute('class', 'example-card')
    cardLink.setAttribute('draggable', 'true')
    cardDisplay.append(cardLink)
    placeCard(cardNumber, card.getNotes(), i, newId)
    cardLink.addEventListener('dragstart', exampleDragStart);
    cardLink.addEventListener('dragover', dragOver);
    // console.log('event listeners added')
    i++
 })
  return document.getElementsByClassName('example-card')
}



// the preview object displays preview cards and plays their music.
const preview = {
  element: document.getElementById('preview'),
  control: document.getElementById('preview-card-control'),
  // The preview class has no attributes when it is created.
  create: function (card) {
    // the create function creates a preview, defining its attributes
    this.card = card
  },
  draw: function () {
    // console.log('in draw function')

    if (this.card) {
      // placeCard is in drawCards.js
      const cardParent = placeCard(
        this.card.number,
        this.card.getNotes(),
        'preview',
        'preview')
      this.control.classList.remove('hidden')
      controlClickHandler(this.control)
    }
  },
  play: function () {
    if (this.card) {
      const music = this.card.getNotesToPlay()
      play(music)
    }
  },
  remove: function (callback = () => {}) {
    this.element.removeChild(this.element.children[1])
    this.control.classList.add('hidden')
    callback()
  },
  clear: function () {
    if (this.card) {
      this.remove(() => {
        delete this.card
      })
    }
  }
}



// XXXXXXXXXXXXX- Drag and Drop Functionality -XXXXXXXXXXXXXXXXXXXXXX


function moveCard (oldIndex, newIndex) {
  // console.log('moveCard')
  const itemToMove = playlist.cardList.splice(oldIndex, 1)[0]
  playlist.cardList.splice(newIndex, 0, itemToMove)
}

function moveCardDiv (dragNode, dropNode, phrase) {
  // console.log('moveCardDiv')
  //https://stackoverflow.com/questions/5913927/get-child-node-index
  const oldIndex = Array.prototype.indexOf.call(phrase.children, dragNode)
  const newIndex = Array.prototype.indexOf.call(phrase.children, dropNode);
  phrase.removeChild(dragNode)
  if (phrase.children.length == newIndex) {
    phrase.appendChild(dragNode)
  } else {
    phrase.insertBefore(dragNode, phrase.children[newIndex])
  }
  return [oldIndex, newIndex]
}

function dragCardInPhrase (dragged, dropSpot) {
  // console.log('dragCardInPhrase')
  const phrase = document.getElementById('phrase')
  const indexes = moveCardDiv(dragged, dropSpot, phrase)
  moveCard(indexes[0], indexes[1])
}

let start
function dragStart () {
  start = this.parentElement.parentElement
  // console.log("Event:", 'dragStart');
}

function dragOver (e) {
  // console.log("Event:", 'dragover');
  e.preventDefault()
}

function insertDraggedCard (target) {
  // console.log("insertCard")
  const phrase = document.getElementById('phrase')
  const newIndex = Array.prototype.indexOf.call(phrase.children, target)
  const newCardNumber = start.dataset.cardnumber
  const newCard = getCardFromNumber(newCardNumber)
  const notes = newCard.getNotes()
  const cardInDom = insertCard (newCardNumber, notes, target, phrase)
  playlist.cardList.splice(newIndex, 0, newCard)
  playlist.cardControlListener(cardInDom)
}



function dragDrop (e) {
  console.log("Event:", 'dragDrop')
  console.log(start)
  if (start.dataset.cardtype == 'inphrase') {
    const holder = this.parentElement.parentElement
    dragCardInPhrase(start, holder);
  } else if (start.dataset.cardtype == 'example') {
    insertDraggedCard(this.parentElement.parentElement)
  } else {
    console.log('Unexpected cardtype')
  }
}


function addEventListeners (centerNode) {
  centerNode.addEventListener('dragstart', dragStart);
  centerNode.addEventListener('dragover', dragOver);
  centerNode.addEventListener('drop', dragDrop);
}

// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

// XXXXXXXXXXX Drag and drop from example menu XXXXXXXXXXXXXXXXXXXXXXXXXXXXX


function getCardFromNumber (fourDigitNumber) {
  const firstThree = fourDigitNumber.slice(0,3)
  // console.log("first three: ", firstThree)
  const card = Object.create(cardDeck.find(x => x.firstThreeNumbers === firstThree))
  card.setOrientation(fourDigitNumber.slice(3))
  return card
}


function exampleDragStart () {
  start = this
  // console.log("Event:", 'dragStart')
  console.log(this.dataset.cardnumber)
}

function dropOnPhrase (e) {
  console.log("Event:", 'dropOnPhrase')
  console.log(start)
  // console.log('phrase: ', phrase)
  if (start.dataset.cardtype == 'example' && e.target == e.currentTarget) {
    playlist.addToCardList(getCardFromNumber(start.dataset.cardnumber))
  } else {
    console.log('Unexpected cardtype')
  }
}


const phrase = document.getElementById('phrase')
phrase.addEventListener('drop', dropOnPhrase)
phrase.addEventListener('dragover', dragOver)


// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

// playlist controls the list of cards placed by the user, and the
// music from those cards.
const playlist = {
  cardList: [],
  addToCardList: function (cardToPlay) {
    // the next line instantiates a clone of cardToPlay and adds it to
    // the playlist.
    // it uses the prototype design pattern. (wait. does it? Or does it use a new instance?)
    // a new card object is necessary here so that each card in the list
    // can be modified without changing any others.
    if (!cardToPlay) {
      console.log('cardToPlay undefined')
    }
    this.cardList.push(cardToPlay)
    // this.cardList.push(Object.create(cardToPlay))

    this.drawCard(cardToPlay)
  },
  drawCard: function (cardToPlay) {
    const number = cardToPlay.numbers
    const notes = cardToPlay.getNotes()
    // placeCard is in drawCards.js
    const cardInDom = placeCard(number, notes, this.cardList.length - 1, 'phrase')
    this.cardControlListener(cardInDom)
  },
  playAll: function () {
    // Concatenates all notes in order into one array.
    // plays the notes in that array.
    // Ideally, this would play one card at a time, maybe with visual effects.
    // I'm not sure yet how to play music in sequence.
    let allMusic = []
    for (const card of this.cardList) {
      const notes = card.getNotesToPlay()
      allMusic = allMusic.concat(notes)
    }
    play(allMusic)
  },
  cardControlListener: function (cardInDom) {
    console.log('cardControlListener')
    const controller = cardInDom.childNodes[0]
    const card = this.cardList[Array.prototype.indexOf.call(cardInDom.parentNode.children, cardInDom)]
    // console.log('controller children: ', controller.childNodes)
    controller.childNodes.forEach(x => {
      // console.log("childNode: ", x)
      if (x.getAttribute('class').includes('drag')) {
        // console.log('attributes include drag, assigning event listeners')
        addEventListeners(x)
      } else {
        // x.removeEventHandler('click')
        x.onclick = () => {
          // console.log("clicked: ", x)
          if (x.getAttribute('class').includes('v')) {
            card.flipV()
          } else if (x.getAttribute('class').includes('h')) {
            card.flipH()
          } else {
            console.log('Something has gone wrong with class assignment.')
            return
          }
          replaceCard(card.numbers, card.getNotes(), listIndex, holder)
          this.cardControlListener(listIndex)
        }
      }
    })
  },
  remove: function (cardNumber, callback = () => {}) {
    // console.log(cardNumber)
    const thisCard = document.getElementById(cardNumber)
    // console.log(element.children[0])
    // console.log(thisCard.)
    // element.removeChild(thisCard)
    thisCard.remove()
    callback()
  },
  clear: function () {
    while (this.cardList.length > 0) {
      // console.log(this.cardList)
      this.remove(this.cardList.length - 1)
      const currentCard = this.cardList.pop()
    }
  }
}

// input handling for the card number input
function cardPreview (e) {
  preview.clear()
  const input = e.target.value
  if (input.length === 4) {
    if (checkIfMeasure(input)) {
      const cardOrientation = input[3]
      const card3digit = input.slice(0, 3)
      // cardToPlay uses the prototype design pattern.
      // it is a new object that clones an existing object.
      // this does not appear to be necessary here. It is used again in playlist
      const cardToPlay = Object.create(cardDeck.find(x => x.firstThreeNumbers === card3digit))

      cardToPlay.setOrientation(cardOrientation)
      preview.create(cardToPlay)
      preview.draw()
    } else {
      preview.clear()
    }
  }
}

// ---event handling:---

const numbersInput = document.getElementById('cardnumber')
const numberCodeInput = new Event('input')
numbersInput.addEventListener('input', cardPreview)
numbersInput.addEventListener('click', () => {
  numbersInput.value = ''
  preview.clear()
})
numbersInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    preview.play()
  }
})

const playButton = document.getElementById('playme')
playButton.onclick = () => {
  preview.play()
  numbersInput.focus()
}

const clearButton = document.getElementById('clear')
clearButton.onclick = () => {
  playlist.clear()
  numbersInput.focus()
}

const addButton = document.getElementById('addtolist')
addButton.onclick = () => {
  playlist.addToCardList(preview.card)
  numbersInput.focus()
}

const playAllButton = document.getElementById('playall')
playAllButton.onclick = () => {
  playlist.playAll()
  numbersInput.focus()
}

const randomButton = document.getElementById('random')
randomButton.onclick = () => {
  const randomCard = cardDeck[Math.floor(Math.random() * cardDeck.length)]
  const randomFinal = Math.floor(Math.random() * 4) + 1
  numbersInput.value = randomCard.firstThreeNumbers + randomFinal.toString()
  numbersInput.dispatchEvent(numberCodeInput)
}

// XXXXXXXXXXXXX
const cardExamples = showAllMeasures()
Array.prototype.forEach.call(cardExamples, function (example) {
  example.onclick = () => {
    numbersInput.value = example.id.slice(0, 4)
    numbersInput.dispatchEvent(numberCodeInput)
  }
})
// XXXXXXXXXXXXX

function controlClickHandler (controlElement) {
  // Array.from used to make the HTMLCollection returned
  // by controleElement.children iterable.
  Array.from(controlElement.children).forEach(x => {
    x.onclick = () => {
      let directionCode = numbersInput.value[3]
      if (x.getAttribute('class').includes('v') && directionCode) {
        switch (directionCode) {
          case '1': directionCode = '4'; break
          case '3': directionCode = '2'; break
          case '2': directionCode = '3'; break
          case '4': directionCode = '1'; break
          default: throw new Error('invalid orientation')
        }
      } else if (x.getAttribute('class').includes('h') && directionCode) {
        switch (directionCode) {
          case '1': directionCode = '3'; break
          case '3': directionCode = '1'; break
          case '2': directionCode = '4'; break
          case '4': directionCode = '2'; break
          default: throw new Error('invalid orientation')
        }
      } else {
        console.log('Something has gone wrong with class assignment.')
        return
      }
      numbersInput.value = numbersInput.value.slice(0, 3) + directionCode
      numbersInput.dispatchEvent(numberCodeInput)
    }
  })
}

function tabHandler () {
  const targetElement = document.querySelector(this.getAttribute('tabtarget'))
  const formerTabElement = document.querySelector('.active-tab')
  const formerTargetElement = document.querySelector(formerTabElement.getAttribute('tabtarget'))
  formerTabElement.classList.remove('active-tab')
  this.classList.add('active-tab')
  formerTargetElement.classList.remove('active')
  targetElement.classList.add('active')
  formerTargetElement.classList.add('hidden')
  targetElement.classList.remove('hidden')
}

// document.getElementById('card-tab').addEventListener('click', tabHandler)
// document.getElementById('how-tab').addEventListener('click', tabHandler)


// const saveButton = document.getElementById('save')
// saveButton.onclick = () => {
//   const blobToSave = new Blob(playlist.cardList);
//   // saveAs requires FileSaver, available here: https://github.com/eligrey/FileSaver.js
//   saveAs(blobToSave, 'my_composition');
// }

// TODO: clickable cards. drag and drop to change order, delete, flip.
// TODO: typed text always goes into the input?
// TODO: save list function
// TODO: stack list function
// -- Display the stack stacked or expanded. if stacked, draw the cards on top of each other
// -- Create the notes in order, with the color starting at black and getting grayer for each layer
// -- Add the notes to the sgv in reverse order, so the black layer goes on top.
// -- Display card numbers in sequence (write these in a final step. limit to what will fit, add ... if necessary).
