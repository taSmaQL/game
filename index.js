const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d'); // c = context


canvas.width = 1800;
canvas.height = 1100;

const collisionsMap = []
for (let i = 0; i < collisions.length; i+=70) { // 70 = width of the map
    collisionsMap.push(collisions.slice(i,i + 70)) // strange numbers: 1025 and garbage number.
}

class Boundary {
    static width = 80
    static height = 80
    constructor({position}) {
        this.position = position
        this.width = 80
        this.height = 80
    }

    draw () {
        c.fillStyle = 'rgba(255,0,0,0)'
        c.fillRect(this.position.x,this.position.y,this.width,this.height)
    }
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

const plImage = new Image() // plImage = playerImage
plImage.src ='./img/playerDown.png'

class Sprite {
    constructor({position, velocity, image, frames = {max: 1} }) {
        this.position = position
        this.image = image
        this.frames = frames
        this.image.onload = () => {
            this.width = this.image.width / this.frames.max
            this.height = this.image.height
        }
        
    }

    draw() {
        c.drawImage(this.image,
        0, // x (cropping)
        0, // y (cropping)
        this.image.width / this.frames.max, // (cropping)
        this.image.height, // (cropping)
        this.position.x,
        this.position.y,
        this.image.width / this.frames.max,
        this.image.height)
    }
}

// canvas.width / 7,
// canvas.height / 1.6,

const player = new Sprite({
    position: {
    x:canvas.width / 7,
    y:canvas.height / 1.6
    },
    image: plImage,
    frames: {
        max: 4
    }
})

const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: image
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


const movables = [background, ...boundaries]

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
    let moving = true
        if (keys.w.pressed) {
    for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i]
        if (
            rectangularCollision({
                rectangle0: player,
                rectangle1: {...boundary, position: {
                    x: boundary.position.x,
                    y: boundary.position.y + 2
                }}
            })
        ) {
            moving = false
            break
        }
    }
    if (moving)
        movables.forEach((movable) => {movable.position.y += 2})
    
}
        else if (keys.a.pressed) {
        for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i]
        if (
            rectangularCollision({
                rectangle0: player,
                rectangle1: {...boundary, position: {
                    x: boundary.position.x + 2,
                    y: boundary.position.y
                }}
            })
        ) {
            moving = false
            break
        }
    }
    if (moving)
    movables.forEach((movable) => {movable.position.x += 2})
}
        else if (keys.s.pressed) {
        for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i]
        if (
            rectangularCollision({
                rectangle0: player,
                rectangle1: {...boundary, position: {
                    x: boundary.position.x,
                    y: boundary.position.y - 2
                }}
            })
        ) {
            moving = false
            break
        }
    }
    if (moving)
    movables.forEach((movable) => {movable.position.y -= 2})
}
        else if (keys.d.pressed) {
        for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i]
        if (
            rectangularCollision({
                rectangle0: player,
                rectangle1: {...boundary, position: {
                    x: boundary.position.x - 2,
                    y: boundary.position.y
                }}
            })
        ) {
            moving = false
            break
        }
    }
    if (moving)
    movables.forEach((movable) => {movable.position.x -= 2})
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


