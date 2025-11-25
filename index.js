// character + dialogue with them (Lore).

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d'); // c = context

canvas.width = 1800;
canvas.height = 1100;

const collisionsMap = []
for (let i = 0; i < collisions.length; i+=70) { // 70 = width of the map
    collisionsMap.push(collisions.slice(i,i + 70)) // strange numbers: 1025 and garbage number.
}



const boundaries = []
const offset = {
    x: 0,
    y: -1900
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
image.src = './img/svoZoomed.png'

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

const player = new Sprite({
    position: {
    x:canvas.width / 7,
    y:canvas.height / 1.6
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


const movables = [background, ...boundaries, foreground]

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
    
    player.draw()
    foreground.draw()

    let moving = true
    player.moving = false

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
                    y: boundary.position.y + 4
                }}
            })
        ) {
            moving = false
            break
        }
    }
    if (moving)
        movables.forEach((movable) => {movable.position.y += 4})
    
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
                x: boundary.position.x + 4,
                y: boundary.position.y
            }}
        })
    ) {
        moving = false
        break
    }
    }
    if (moving)
        movables.forEach((movable) => {movable.position.x += 4})
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
                y: boundary.position.y - 4
            }}
        })
    ) {
        moving = false
        break
    }
    }
    if (moving)
        movables.forEach((movable) => {movable.position.y -= 4})
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
                x: boundary.position.x - 4,
                y: boundary.position.y
            }}
        })
    ) {
        moving = false
        break
    }
    }
    if (moving)
        movables.forEach((movable) => {movable.position.x -= 4})
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


// Audio will play if a player is clicking on the web-page
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