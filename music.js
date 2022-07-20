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
function Card (firstThreeNumbers, notes1) {
  // all of the numbers mentioned here are strings of numbers used as reference codes. rename?
  this.firstThreeNumbers = firstThreeNumbers
  this.notes1 = notes1 // array of the notes in orientation 1
  this.setOrientation = function (orientation) {
    this.orientation = orientation
    this.numbers = firstThreeNumbers + orientation
  }
  this.flipH = function () {
    return this.notes1.slice(0).reverse() // reverse edits this slice, not this.notes1
  }
  // getNotes returns an array of notes formatted as input for drawing an svg image
  this.getNotes = function () {
    let notes = []
    switch (this.orientation) {
      case '1': // fallthrough return this.notes1
      case '4': notes = this.notes1; break
      case '2': // fallthrough
      case '3': notes = this.flipH(); break
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
      case '3': notes = this.flipH(); break
    }
    return notes.map(x => x.getNoteToPlay(this.orientation))
  }
}

const newCards = [new Card('400', [new MyNote(2, 'half'), new MyNote(6, 'quarter'), new MyNote(5, 'quarter')]),
            new Card('401', [new MyNote(5, 'half'), new MyNote(4, 'quarter'), new MyNote(4, 'eighth'), new MyNote(1, 'eighth')]),
            new Card('402', [new MyNote(6, 'quarter'), new MyNote(2, 'quarter'), new MyNote(3, 'half')]),
            new Card('405', [new MyNote(4, 'quarter'), new MyNote(1, 'quarter'), new MyNote(6, 'half')]),
            new Card('406', [new MyNote(2, 'quarter'), new MyNote(1, 'half'), new MyNote(4, 'eighth'), new MyNote(6, 'eighth')]),
            new Card('408', [new MyNote(4, 'half'), new MyNote(4, 'quarter'), new MyNote(5, 'quarter')]),
            new Card('409', [new MyNote(5, 'eighth'), new MyNote(1, 'eighth'), new MyNote(5, 'half'), new MyNote(3, 'quarter')]),
            new Card('410', [new MyNote(5, 'quarter'), new MyNote(4, 'eighth'), new MyNote(6, 'eighth'), new MyNote(6, 'eighth'), new MyNote(3, 'eighth'), new MyNote(4, 'eighth'), new MyNote(3, 'eighth')]),
            new Card('411', [new MyNote(5, 'eighth'), new MyNote(3, 'eighth'), new MyNote(5, 'half'), new MyNote(5, 'quarter')]),
            new Card('412', [new MyNote(4, 'half'), new MyNote(2, 'quarter'), new MyNote(1, 'eighth'), new MyNote(5, 'eighth')]),
            new Card('413', [new MyNote(1, 'quarter'), new MyNote(4, 'half'), new MyNote(2, 'quarter')]),
            new Card('414', [new MyNote(2, 'quarter'), new MyNote(1, 'half'), new MyNote(6, 'eighth'), new MyNote(2, 'eighth')]),
            new Card('415', [new MyNote(1, 'half'), new MyNote(3, 'eighth'), new MyNote(4, 'eighth'), new MyNote(1, 'eighth'), new MyNote(2, 'eighth')]),
            new Card('416', [new MyNote(1, 'half'), new MyNote(1, 'eighth'), new MyNote(3, 'eighth'), new MyNote(4, 'eighth'), new MyNote(1, 'eighth')]),
            new Card('417', [new MyNote(3, 'quarter'), new MyNote(1, 'quarter'), new MyNote(1, 'half')]),
            new Card('418', [new MyNote(6, 'quarter'), new MyNote(4, 'quarter'), new MyNote(2, 'quarter'), new MyNote(3, 'quarter')]),
            new Card('419', [new MyNote(4, 'quarter'), new MyNote(3, 'quarter'), new MyNote(3, 'half')]),
            new Card('420', [new MyNote(4, 'half'), new MyNote(5, 'eighth'), new MyNote(4, 'eighth'), new MyNote(3, 'eighth'), new MyNote(4, 'eighth')]),
            new Card('421', [new MyNote(3, 'eighth'), new MyNote(2, 'eighth'), new MyNote(1, 'quarter'), new MyNote(4, 'eighth'), new MyNote(3, 'eighth'), new MyNote(5, 'quarter')]),
            new Card('423', [new MyNote(5, 'eighth'), new MyNote(5, 'eighth'), new MyNote(2, 'quarter'), new MyNote(6, 'half')]),
            new Card('424', [new MyNote(4, 'quarter'), new MyNote(3, 'half'), new MyNote(1, 'eighth'), new MyNote(1, 'eighth')]),
            new Card('427', [new MyNote(2, 'quarter'), new MyNote(5, 'quarter'), new MyNote(1, 'eighth'), new MyNote(4, 'eighth'), new MyNote(1, 'eighth'), new MyNote(6, 'eighth')]),
            new Card('428', [new MyNote(5, 'eighth'), new MyNote(6, 'eighth'), new MyNote(5, 'half'), new MyNote(5, 'quarter')]),
            new Card('429', [new MyNote(2, 'eighth'), new MyNote(6, 'eighth'), new MyNote(3, 'half'), new MyNote(5, 'eighth'), new MyNote(3, 'eighth')]),
            new Card('430', [new MyNote(6, 'quarter'), new MyNote(6, 'eighth'), new MyNote(4, 'eighth'), new MyNote(2, 'quarter'), new MyNote(1, 'eighth'), new MyNote(4, 'eighth')]),
            new Card('431', [new MyNote(3, 'eighth'), new MyNote(4, 'eighth'), new MyNote(3, 'eighth'), new MyNote(2, 'eighth'), new MyNote(1, 'half')]),
            new Card('432', [new MyNote(1, 'quarter'), new MyNote(6, 'quarter'), new MyNote(1, 'eighth'), new MyNote(5, 'eighth'), new MyNote(2, 'eighth'), new MyNote(4, 'eighth')]),
            new Card('433', [new MyNote(4, 'eighth'), new MyNote(1, 'eighth'), new MyNote(4, 'eighth'), new MyNote(5, 'eighth'), new MyNote(6, 'half')]),
            new Card('437', [new MyNote(5, 'half'), new MyNote(2, 'quarter'), new MyNote(1, 'eighth'), new MyNote(2, 'eighth')]),
            new Card('438', [new MyNote(3, 'half'), new MyNote(1, 'eighth'), new MyNote(2, 'eighth'), new MyNote(6, 'quarter')]),
            new Card('439', [new MyNote(3, 'quarter'), new MyNote(5, 'quarter'), new MyNote(1, 'eighth'), new MyNote(1, 'eighth'), new MyNote(5, 'quarter')]),
            new Card('441', [new MyNote(2, 'eighth'), new MyNote(1, 'eighth'), new MyNote(2, 'half'), new MyNote(2, 'eighth'), new MyNote(6, 'eighth')]),
]


const cardDeck = [
  new Card('001', [
    new MyNote(4),
    new MyNote(6, 'half'),
    new MyNote(4)
  ]),
  new Card('002', [
    new MyNote(2),
    new MyNote(6, 'eighth'),
    new MyNote(5, 'eighth'),
    new MyNote(4),
    new MyNote(2)
  ]),
  new Card('003', [
    new MyNote(4),
    new MyNote(3, 'eighth'),
    new MyNote(3, 'eighth'),
    new MyNote(4, 'eighth'),
    new MyNote(4, 'eighth'),
    new MyNote(2)
  ]),
  new Card('004', [
    new MyNote(4, 'eighth'),
    new MyNote(5, 'eighth'),
    new MyNote(6, 'half'),
    new MyNote(5, 'eighth'),
    new MyNote(4, 'eighth')
  ]),
  new Card('005', [
    new MyNote(3, 'eighth'),
    new MyNote(4, 'eighth'),
    new MyNote(5, 'half'),
    new MyNote(4)
  ]),
  new Card('006', [
    new MyNote(2, 'eighth'),
    new MyNote(6, 'eighth'),
    new MyNote(4, 'eighth'),
    new MyNote(2, 'eighth'),
    new MyNote(2, 'half')
  ]),
  new Card('007', [
    new MyNote(2),
    new MyNote(3),
    new MyNote(4),
    new MyNote(2)
  ]),
  new Card('008', [
    new MyNote(2),
    new MyNote(6),
    new MyNote(5, 'eighth'),
    new MyNote(4, 'eighth'),
    new MyNote(3)
  ]),
  new Card('009', [
    new MyNote(3),
    new MyNote(5),
    new MyNote(4, 'eighth'),
    new MyNote(5, 'eighth'),
    new MyNote(3, 'eighth'),
    new MyNote(2, 'eighth')
  ]),
  new Card('010', [
    new MyNote(4, 'eighth'),
    new MyNote(4, 'eighth'),
    new MyNote(3, 'eighth'),
    new MyNote(4, 'eighth'),
    new MyNote(5),
    new MyNote(4)
  ]),
  new Card('011', [
    new MyNote(2, 'eighth'),
    new MyNote(6, 'eighth'),
    new MyNote(4, 'eighth'),
    new MyNote(2, 'eighth'),
    new MyNote(3, 'eighth'),
    new MyNote(5, 'eighth'),
    new MyNote(4)
  ]),
  new Card('012', [
    new MyNote(3, 'half'),
    new MyNote(5, 'eighth'),
    new MyNote(4, 'eighth'),
    new MyNote(3, 'eighth'),
    new MyNote(2, 'eighth')
  ]),
  new Card('013', [
    new MyNote(2, 'eighth'),
    new MyNote(4, 'eighth'),
    new MyNote(6, 'eighth'),
    new MyNote(4, 'eighth'),
    new MyNote(2, 'eighth'),
    new MyNote(3, 'eighth'),
    new MyNote(4)
  ]),
  new Card('014', [
    new MyNote(4),
    new MyNote(2, 'half'),
    new MyNote(5)
  ]),
  new Card('015', [
    new MyNote(4),
    new MyNote(4, 'eighth'),
    new MyNote(5, 'eighth'),
    new MyNote(4),
    new MyNote(4, 'eighth'),
    new MyNote(2, 'eighth')
  ]),
  new Card('016', [
    new MyNote(4, 'eighth'),
    new MyNote(3, 'eighth'),
    new MyNote(2),
    new MyNote(3),
    new MyNote(2)
  ]),
  new Card('017', [
    new MyNote(5),
    new MyNote(4, 'eighth'),
    new MyNote(3, 'eighth'),
    new MyNote(4),
    new MyNote(2)
  ]),
  new Card('018', [
    new MyNote(5, 'half'),
    new MyNote(2),
    new MyNote(5)
  ]),
  new Card('019', [
    new MyNote(4, 'eighth'),
    new MyNote(6, 'eighth'),
    new MyNote(4, 'eighth'),
    new MyNote(6, 'eighth'),
    new MyNote(4, 'eighth'),
    new MyNote(2, 'eighth'),
    new MyNote(4)
  ]),
  new Card('025', [
    new MyNote(6),
    new MyNote(5, 'eighth'),
    new MyNote(3, 'eighth'),
    new MyNote(2, 'eighth'),
    new MyNote(3, 'eighth'),
    new MyNote(1)
  ]),
  new Card('030', [
    new MyNote(5),
    new MyNote(2),
    new MyNote(1, 'half')
  ])
].concat(newCards)


// displays all newly created cards
function showAllNewCards () {
  const cardDisplay = document.getElementById('cardlist')
  const title = document.createElement('h1')
  title.append('Music Cards')
  title.setAttribute('id', 'example-title')
  cardDisplay.append(title)
  const cardExampleDeck = document.createElement('div')
  cardExampleDeck.setAttribute('id', 'card-example-deck')
  const exampleDeck = cardDisplay.appendChild(cardExampleDeck)
  newCards.forEach(card => {
    const cardNumber = card.firstThreeNumbers + '1'
    const cardLink = document.createElement('div')
    cardLink.setAttribute('id', cardNumber + '-example')
    cardLink.setAttribute('class', 'example-card')
    cardLink.append(cardNumber)
    exampleDeck.append(cardLink)
  })
  return document.getElementsByClassName('example-card')
}




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

function checkIfCard (cardInput) {
  const firstThree = cardInput.slice(0, 3)
  const fourth = cardInput[3]
  return (cardDeck.some(card => card.firstThreeNumbers === firstThree)) &&
         (1 <= fourth && fourth <= 4) &&
         (cardInput.length === 4)
}

// the preview object displays preview cards and plays their music.
const preview = {
  // The preview class has no attributes when it is created.
  create: function (card) {
    // the create function creates a preview, defining its attributes
    this.card = card
  },
  draw: function () {
    if (this.card) {
      // placeCard is in drawCards.js
      const cardParent = placeCard(
        this.card.number,
        this.card.getNotes(),
        'preview',
        'sample')
      controlClickHandler(cardParent)
    }
  },
  play: function () {
    if (this.card) {
      const music = this.card.getNotesToPlay()
      play(music)
    }
  },
  remove: function (callback = () => {}) {
    const element = document.getElementById('sample')
    const thisCard = document.getElementById('preview')
    // const thisCardControl = document.getElementById('control' + this.card.number)

    element.removeChild(thisCard)
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

// playlist controls the list of cards placed by the user, and the
// music from those cards.
const playlist = {
  cardList: [],
  addToCardList: function (cardToPlay) {
    this.cardList.push(cardToPlay)
    this.drawCard(cardToPlay)
  },
  drawCard: function (cardToPlay) {
    const number = cardToPlay.numbers
    const notes = cardToPlay.getNotes()
    // placeCard is in drawCards.js
    placeCard(number, notes, this.cardList.length - 1, 'display')
    this.cardControlListener(this.cardList.length - 1)
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
  cardControlListener: function (listIndex) {
    const holder = document.getElementById(listIndex.toString())
    const controller = holder.childNodes[0]
    const card = this.cardList[listIndex]
    console.log(controller)
    console.log(controller.childNodes)

    controller.childNodes.forEach(x => {
      console.log(x)
      x.onclick = () => {
        let directionCode = card.orientation
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
        const cardNumber = card.firstThreeNumbers + directionCode
        console.log(cardNumber)
        // const cardToPlay = Object.create(cardDeck.find(x => x.firstThreeNumbers === card.firstThreeNumbers))
        // cardToPlay.setOrientation(directionCode)
        // remove the card from the cardlist
        this.cardList[listIndex].setOrientation(directionCode)
        // add the card in its new orientation in place.
          // add to the cardList
          // draw the card to the dom
        console.log(card)
        replaceCard(cardNumber, card.getNotes(), listIndex, holder)
        this.cardControlListener(listIndex)
      }
    })

  },
  remove: function (cardNumber, callback = () => {}) {
    console.log(cardNumber)
    const thisCard = document.getElementById(cardNumber)
    // console.log(element.children[0])
    console.log(thisCard)
    // element.removeChild(thisCard)
    thisCard.remove()
    callback()
  },
  clear: function () {
    while (this.cardList.length > 0) {
      console.log(this.cardList)
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
    if (checkIfCard(input)) {
      const cardOrientation = input[3]
      const card3digit = input.slice(0, 3)
      // cardToPlay uses the prototype design pattern.
      // it is a new object that clones an existing object.
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
  const randomCard = newCards[Math.floor(Math.random() * newCards.length)]
  const randomFinal = Math.floor(Math.random() * 4) + 1
  numbersInput.value = randomCard.firstThreeNumbers + randomFinal.toString()
  numbersInput.dispatchEvent(numberCodeInput)
}

// XXXXXXXXXXXXX
const cardExamples = showAllNewCards()
Array.prototype.forEach.call(cardExamples, function (example) {
  example.onclick = () => {
    numbersInput.value = example.id.slice(0, 4)
    numbersInput.dispatchEvent(numberCodeInput)
  }
})
// XXXXXXXXXXXXX

function controlClickHandler (parentElement) {
  const control = parentElement.childNodes[0]
  console.log(control)
  control.childNodes.forEach(x => {
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
