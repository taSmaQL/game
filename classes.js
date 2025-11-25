class Sprite {
    constructor({position, velocity, image, frames = {max: 1}, sprites = [] }) {
        this.position = position
        this.image = image
        this.frames = {...frames, val: 0, elapsed: 0}
        this.image.onload = () => {
            this.width = this.image.width / this.frames.max
            this.height = this.image.height
        }
        this.moving = false
        this.sprites = sprites
    }

    draw() {
        c.drawImage(
            this.image,
            this.frames.val * this.width, // x (cropping)
            0, // y (cropping)
            this.image.width / this.frames.max, // (cropping)
            this.image.height, // (cropping)
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max,
            this.image.height)
        
        if (!this.moving) return
        if (this.frames.max > 1) {
                this.frames.elapsed++
            }  
        if (this.frames.elapsed % 10 === 0) {
            if (this.frames.val < this.frames.max - 1) this.frames.val++
            else this.frames.val = 0
            }
        
    }
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

class Character {
    constructor({position, image, frames = {max: 1}, name, dialogues = []}) {
        this.position = position
        this.image = image
        this.frames = {...frames, val: 0, elapsed: 0}
        this.image.onload = () => {
            this.width = this.image.width / this.frames.max
            this.height = this.image.height
        }
        this.name = name
        this.dialogues = dialogues
        this.currentDialogue = 0
        this.isInteracting = false
    }

    draw() {
        c.drawImage(
            this.image,
            this.frames.val * this.width,
            0,
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max,
            this.image.height
        )
        
        // Анимация персонажа (если нужно)
        if (this.frames.max > 1) {
            this.frames.elapsed++
            if (this.frames.elapsed % 20 === 0) {
                if (this.frames.val < this.frames.max - 1) this.frames.val++
                else this.frames.val = 0
            }
        }
    }

    interact() {
        if (this.dialogues.length === 0) return
        
        this.isInteracting = true
        return this.dialogues[this.currentDialogue]
    }

    nextDialogue() {
        this.currentDialogue++
        if (this.currentDialogue >= this.dialogues.length) {
            this.currentDialogue = 0
            this.isInteracting = false
            return null
        }
        return this.dialogues[this.currentDialogue]
    }
}

// Класс для окна диалога
class DialogueBox {
    constructor() {
        this.isActive = false
        this.currentText = ''
        this.currentCharacter = null
    }

    show(character, text) {
        this.isActive = true
        this.currentCharacter = character
        this.currentText = text
    }

    hide() {
        this.isActive = false
        this.currentText = ''
        this.currentCharacter = null
    }

    draw() {
        if (!this.isActive) return

        // Рисуем фон диалогового окна
        c.fillStyle = 'rgba(0, 0, 0, 0.8)'
        c.fillRect(50, canvas.height - 200, canvas.width - 100, 150)
        
        // Рамка
        c.strokeStyle = 'gold'
        c.lineWidth = 3
        c.strokeRect(50, canvas.height - 200, canvas.width - 100, 150)

        // Имя персонажа
        c.fillStyle = 'gold'
        c.font = 'bold 24px Arial'
        c.fillText(this.currentCharacter?.name || 'Неизвестный', 80, canvas.height - 160)

        // Текст диалога
        c.fillStyle = 'white'
        c.font = '20px Arial'
        this.wrapText(this.currentText, 80, canvas.height - 120, canvas.width - 160, 24)

        // Подсказка для продолжения
        c.fillStyle = 'yellow'
        c.font = '16px Arial'
        c.fillText('Нажмите E для продолжения...', canvas.width - 250, canvas.height - 40)
    }

    wrapText(text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ')
        let line = ''
        let testLine = ''
        let currentY = y

        for (let n = 0; n < words.length; n++) {
            testLine = line + words[n] + ' '
            const metrics = c.measureText(testLine)
            const testWidth = metrics.width
            
            if (testWidth > maxWidth && n > 0) {
                c.fillText(line, x, currentY)
                line = words[n] + ' '
                currentY += lineHeight
            } else {
                line = testLine
            }
        }
        c.fillText(line, x, currentY)
    }
}