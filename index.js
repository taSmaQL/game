const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d'); // c = context


canvas.width = 1800;
canvas.height = 1100;



const collisionsMap = []
for (let i = 0; i < collisions.length; i+=150) { // 150 = width of the map
    collisionsMap.push(collisions.slice(i,i + 150)) // strange numbers: 1025 and garbage number.
}


const boundaries = []
const offset = {
    x: -800,
    y: -2350
}


collisionsMap.forEach ((row,i) => {
    row.forEach((symbol,j) => {
        if (symbol > 0)
        boundaries.push(new Boundary({
            position:{
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y
        }}))
    })
})


const image = new Image()
image.src = './img/map.png'


const FGimage = new Image() // FG = ForeGround
FGimage.src = './img/foreground.png'


const plDownImage = new Image() // plDownImage = playerImage for bottom view of player
plDownImage.src ='./img/playerDown.png'


const plUpImage = new Image()  // same as plDownImage but for Top view of player and etc.
plUpImage.src ='./img/playerUp.png'


const plLeftImage = new Image() 
plLeftImage.src ='./img/playerLeft.png'


const plRightImage = new Image() 
plRightImage.src ='./img/playerRight.png'


const npc1Image = new Image()
npc1Image.src = './img/playerDown.png'


const characters = [
    new Character({
        position: { x: 1447, y: 467 },
        image: npc1Image,
        frames: { max: 4 },
        name: "Старый мудрец",
        dialogues: {
            'start': "Приветствую, путник! Ты ищешь приключений?",
            
            'adventure_yes': {
                text: "Отлично! Я могу предложить тебе два пути:",
                next: 'path_choice'
            },
            'path_choice': "Какой путь ты выберешь?",
            'path_forest': "Лес таит древние секреты, но будь осторожен с тенями...",
            'path_mountains': "В горах обитают мудрые драконы, они могут многому научить.",
              
            'adventure_no': "Понимаю... Иногда спокойная жизнь - лучший выбор.",
            
            'what_offer': "Я могу рассказать тебе о древних пророчествах или научить магии.",
            'prophecies': "Древние预言ния говорят о возвращении Тёмного Властелина...",
            'magic': "Магия требует терпения и мудрости. Начнём с основ.",
            
            'end_forest': "Удачи в лесу, путник! Вернись и расскажи о своих находках.",
            'end_mountains': "Пусть горные ветры укажут тебе верный путь!",
            'end_calm': "Наслаждайся миром и спокойствием. Это тоже дар.",
            'end_prophecies': "Запомни эти слова - они могут спасти мир однажды...",
            'end_magic': "Практикуйся ежедневно, и ты станешь великим магом."
        },
        choices: {
            'start': [
                { 
                    text: "Да, я ищу славы и богатства", 
                    value: 1,
                    nextBranch: 'adventure_yes'
                },
                { 
                    text: "Нет, я просто путешествую", 
                    value: 2,
                    nextBranch: 'adventure_no'
                },
                { 
                    text: "А что ты предлагаешь?", 
                    value: 3,
                    nextBranch: 'what_offer'
                }
            ],
            'path_choice': [
                {
                    text: "Пойти через древний лес",
                    value: 4,
                    nextBranch: 'path_forest'
                },
                {
                    text: "Подняться в заснеженные горы", 
                    value: 5,
                    nextBranch: 'path_mountains'
                }
            ],
            'what_offer': [
                {
                    text: "Расскажи о пророчествах",
                    value: 6,
                    nextBranch: 'prophecies'
                },
                {
                    text: "Научи меня магии",
                    value: 7, 
                    nextBranch: 'magic'
                }
            ],
            'adventure_no': [
                {
                    text: "Спасибо за понимание",
                    value: 8,
                    nextBranch: 'end_calm'
                }
            ],
            'path_forest': [
                {
                    text: "Отправляюсь в лес!",
                    value: 9,
                    nextBranch: 'end_forest'
                }
            ],
            'path_mountains': [
                {
                    text: "Иду в горы!",
                    value: 10,
                    nextBranch: 'end_mountains'
                }
            ],
            'prophecies': [
                {
                    text: "Понял, буду готов",
                    value: 11,
                    nextBranch: 'end_prophecies'
                }
            ],
            'magic': [
                {
                    text: "Начинаем обучение!",
                    value: 12,
                    nextBranch: 'end_magic'
                }
            ]
        }
    })
]


const dialogueBox = new DialogueBox()
const choiceSystem = new ChoiceSystem(dialogueBox)
dialogueBox.choiceSystem = choiceSystem


const player = new Sprite({
    position: {
    x:canvas.width / 2 + 150,
    y:canvas.height / 2 
    },
    image: plDownImage,
    frames: {
        max: 4
    },
    sprites: {
        up: plUpImage,
        left: plLeftImage,
        right: plRightImage,
        down: plDownImage
    }
})


const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: image
})


const foreground = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: FGimage
})


const keys = {
  w: {
    pressed: false
  },
  a: {
    pressed: false
  },
  s: {
    pressed: false
  },
  d: {
    pressed: false
  }
}


const movables = [background, ...boundaries, foreground, ...characters]

function checkCharacterCollision() {
    for (let i = 0; i < characters.length; i++) {
        const character = characters[i]
        const interactionRange = 100
        
        const distance = Math.sqrt(
            Math.pow(player.position.x - character.position.x, 2) + 
            Math.pow(player.position.y - character.position.y, 2)
        )
        
        if (distance < interactionRange && !dialogueBox.isActive) {
            c.fillStyle = 'white'
            c.font = '20px Arial'
            c.fillText('Нажмите E для разговора', character.position.x - 50, character.position.y - 40)
            return character
        }
    }
    return null
}


function rectangularCollision({rectangle0,rectangle1}) {
    return (
        rectangle0.position.x + rectangle0.width >= rectangle1.position.x && 
        rectangle0.position.x <= rectangle1.position.x + rectangle1.width && 
        rectangle0.position.y <= rectangle1.position.y + rectangle1.height && 
        rectangle0.position.y + rectangle0.height >= rectangle1.position.y
    )
}



function animate() {
    window.requestAnimationFrame(animate)
    background.draw()
    boundaries.forEach((boundary) => {
        boundary.draw()

    
    })
    characters.forEach(character => {
        character.draw()
    })
    player.draw()
    foreground.draw()

    dialogueBox.draw()
    choiceSystem.draw()

    let moving = true
    player.moving = false

    if (dialogueBox.isActive) {
        moving = false
    }
    if (keys.w.pressed) {
    player.moving = true
    player.image = player.sprites.up
    for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i]
        if (
            rectangularCollision({
                rectangle0: player,
                rectangle1: {...boundary, position: {
                    x: boundary.position.x,
                    y: boundary.position.y + 8
                }}
            })
        ) {
            moving = false
            break
        }
    }
    if (moving)
        movables.forEach((movable) => {movable.position.y += 8})
    
}
    else if (keys.a.pressed) {
    player.moving = true
    player.image = player.sprites.left    
    for (let i = 0; i < boundaries.length; i++) {
    const boundary = boundaries[i]
    if (
        rectangularCollision({
            rectangle0: player,
            rectangle1: {...boundary, position: {
                x: boundary.position.x + 8,
                y: boundary.position.y
            }}
        })
    ) {
        moving = false
        break
    }
    }
    if (moving)
        movables.forEach((movable) => {movable.position.x += 8})
}
    else if (keys.s.pressed) {
    player.moving = true
    player.image = player.sprites.down    
    for (let i = 0; i < boundaries.length; i++) {
    const boundary = boundaries[i]
    if (
        rectangularCollision({
            rectangle0: player,
            rectangle1: {...boundary, position: {
                x: boundary.position.x,
                y: boundary.position.y - 8
            }}
        })
    ) {
        moving = false
        break
    }
    }
    if (moving)
        movables.forEach((movable) => {movable.position.y -= 8})
}
    else if (keys.d.pressed) {
    player.moving = true
    player.image = player.sprites.right   
    for (let i = 0; i < boundaries.length; i++) {
    const boundary = boundaries[i]
    if (
        rectangularCollision({
            rectangle0: player,
            rectangle1: {...boundary, position: {
                x: boundary.position.x - 8,
                y: boundary.position.y
            }}
        })
    ) {
        moving = false
        break
    }
    }
    if (moving)
        movables.forEach((movable) => {movable.position.x -= 8})
}
}


animate()


window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'w':
            keys.w.pressed = true
            break
        case 'a':
            keys.a.pressed = true
            break
        case 's':
            keys.s.pressed = true
            break
        case 'd':
            keys.d.pressed = true
            break
        case 'e':
         case 'E':
            if (choiceSystem.isActive) {
                choiceSystem.selectChoice()
            } else if (!dialogueBox.isActive) {
                const nearbyCharacter = checkCharacterCollision()
                if (nearbyCharacter) {
                    const content = nearbyCharacter.interact()
                    dialogueBox.show(nearbyCharacter, content)
                }
            } else {
                
                const nextContent = dialogueBox.currentCharacter.nextDialogue()
                if (nextContent) {
                    dialogueBox.show(dialogueBox.currentCharacter, nextContent)
                } else {
                    dialogueBox.hide()
                }
            }
            break
        case 'ArrowUp':
            if (choiceSystem.isActive) choiceSystem.previousChoice()
            break
        case 'ArrowDown':
            if (choiceSystem.isActive) choiceSystem.nextChoice()
            break
        case 'Enter':
            
            if (choiceSystem.isActive) {
                choiceSystem.selectChoice()
            }
            break
    }
})


window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'w':
            keys.w.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 's':
            keys.s.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
    }
}) 


let clicked = false
addEventListener('click', () => {
    if (!clicked) {
        if (Math.random() < 0.5)
            audio.Map.play()
        else 
            audio2.Map.play()
        clicked = true
    }
})

