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
            this.frames.val * this.width,
            0,
            this.image.width / this.frames.max,
            this.image.height,
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
    static width = 64
    static height = 64
    constructor({position}) {
        this.position = position
        this.width = 64
        this.height = 64
    }

    
    draw () {
        c.fillStyle = 'rgba(255,0,0,0)'
        c.fillRect(this.position.x,this.position.y,this.width,this.height)
    }
}


class Character {
    constructor({position, image, frames = {max: 1}, name, dialogues = [], choices = []}) {
        this.position = position
        this.image = image
        this.frames = {...frames, val: 0, elapsed: 0}
        this.image.onload = () => {
            this.width = this.image.width / this.frames.max
            this.height = this.image.height
        }
        this.name = name
        this.dialogues = dialogues 
        this.choices = choices     
        this.currentDialogue = 'start' 
        this.isInteracting = false
        this.dialogueHistory = [] 
    }

    interact() {
        if (!this.dialogues[this.currentDialogue]) {
            return null
        }
        
        this.isInteracting = true
        
        const currentDialogue = this.dialogues[this.currentDialogue]
        
        if (this.choices[this.currentDialogue]) {
            return {
                type: 'choice',
                question: currentDialogue.text || currentDialogue,
                choices: this.choices[this.currentDialogue]
            }
        }
        
        return {
            type: 'dialogue',
            text: currentDialogue.text || currentDialogue
        }
    }

    nextDialogue(choiceResult = null) {
        if (choiceResult && choiceResult.nextBranch) {
            this.currentDialogue = choiceResult.nextBranch
        } else {
            const currentDialogue = this.dialogues[this.currentDialogue]
            
            if (currentDialogue && typeof currentDialogue === 'object' && currentDialogue.next) {
                this.currentDialogue = currentDialogue.next
            } else {
                this.isInteracting = false
                this.currentDialogue = 'start'
                return null
            }
        }

        const result = this.interact()
        return result
    }

    continueAfterChoice(selectedChoice) {
        if (selectedChoice && selectedChoice.nextBranch) {
            const result = this.nextDialogue(selectedChoice)
            return result
        } else {
            const result = this.nextDialogue()
            return result
        }
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
    }
}


class ChoiceSystem {
    constructor(dialogueBox) {
        this.isActive = false
        this.question = ''
        this.choices = []
        this.selectedIndex = 0
        this.dialogueBox = dialogueBox
        this.currentCharacter = null
    }

    show(question, choices, character) {
        this.isActive = true
        this.question = question
        this.choices = choices
        this.selectedIndex = 0
        this.currentCharacter = character
    }

    hide() {
        this.isActive = false
        this.question = ''
        this.choices = []
        this.selectedIndex = 0
        this.currentCharacter = null
    }

    nextChoice() {
        if (!this.isActive) return
        this.selectedIndex = (this.selectedIndex + 1) % this.choices.length
    }

    previousChoice() {
        if (!this.isActive) return
        this.selectedIndex = (this.selectedIndex - 1 + this.choices.length) % this.choices.length
    }

    selectChoice() {
        if (!this.isActive) {
            return null
        }
        
        if (this.choices[this.selectedIndex]) {
            const selectedChoice = this.choices[this.selectedIndex]
            
            const currentCharacter = this.currentCharacter
            
            this.hide()
        
            if (currentCharacter) {
                const nextContent = currentCharacter.continueAfterChoice(selectedChoice)
                
                if (nextContent) {
                    this.dialogueBox.show(currentCharacter, nextContent)
                } else {
                    this.dialogueBox.hide()
                }
            }
            
            return selectedChoice
        }
        
        return null
    }

    draw() {
        if (!this.isActive) return

        const choiceHeight = 40
        const padding = 20
        const questionHeight = 60
        const height = questionHeight + (this.choices.length * choiceHeight) + padding

        c.fillStyle = 'rgba(0, 0, 0, 0.9)'
        c.fillRect(100, canvas.height - height - 50, canvas.width - 200, height)

        c.strokeStyle = '#FFFFFF'
        c.lineWidth = 3
        c.strokeRect(100, canvas.height - height - 50, canvas.width - 200, height)

        c.fillStyle = '#FFFF00'
        c.font = '12px "Press Start 2P", cursive'
        c.textAlign = 'center'
        this.wrapText(this.question, canvas.width / 2, canvas.height - height - 10, canvas.width - 240, 20)

        c.textAlign = 'left'
        c.font = '10px "Press Start 2P", cursive'

        this.choices.forEach((choice, index) => {
            const yPos = canvas.height - height + 30 + (index * choiceHeight)
            
            if (index === this.selectedIndex) {
                c.fillStyle = '#FFFFFF'
                c.fillText('>', canvas.width / 2 - 100, yPos)
                c.fillStyle = '#FFFF00'
            } else {
                c.fillStyle = '#AAAAAA'
            }
            
            this.wrapText(choice.text, canvas.width / 2 - 80, yPos, canvas.width - 300, 15)
        })

        c.fillStyle = '#888888'
        c.font = '8px "Press Start 2P", cursive'
        c.textAlign = 'center'
        c.fillText('СТРЕЛКИ: ВЫБОР | ENTER: ПОДТВЕРДИТЬ', canvas.width / 2, canvas.height - 15)
    }

    wrapText(text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ')
        let line = ''
        let currentY = y

        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' '
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


class DialogueBox {
    constructor() {
        this.isActive = false
        this.currentText = ''
        this.currentCharacter = null
        this.choiceSystem = null 
    }

    show(character, content) {
        if (content.type === 'choice') {
            this.choiceSystem.show(content.question, content.choices, character)
            this.isActive = false
        } else {
            this.isActive = true
            this.currentCharacter = character
            this.currentText = content.text
        }
    }

    hide() {
        this.isActive = false
        this.currentText = ''
        this.currentCharacter = null
    }

    draw() {
        if (!this.isActive || this.choiceSystem.isActive) return
        
        const boxWidth = canvas.width - 100
        const boxHeight = 200
        const boxX = 50
        const boxY = canvas.height - boxHeight - 50

        c.fillStyle = '#404040'
        c.fillRect(boxX, boxY, boxWidth, boxHeight)
        
        c.strokeStyle = '#000000'
        c.lineWidth = 3
        c.strokeRect(boxX, boxY, boxWidth, boxHeight)

        c.strokeStyle = '#A0A0A0'
        c.lineWidth = 1
        c.strokeRect(boxX + 3, boxY + 3, boxWidth - 6, boxHeight - 6)

        c.fillStyle = '#FFFF00'
        c.font = 'bold 24px "Press Start 2P", cursive'
        c.textAlign = 'left'
        c.textBaseline = 'top'
        c.fillText(this.currentCharacter?.name || 'НЕИЗВЕСТНЫЙ', boxX + 20, boxY + 20)

        c.fillStyle = '#FFFFFF'
        c.font = '22px "Press Start 2P", cursive' 
        c.textAlign = 'left'
        c.textBaseline = 'top'
        this.wrapText(this.currentText, boxX + 20, boxY + 60, boxWidth - 40, 18)

        c.fillStyle = '#AAAAAA'
        c.font = '10px "Press Start 2P", cursive'
        c.fillText('НАЖМИТЕ E ДЛЯ ПРОДОЛЖЕНИЯ', boxX + 20, boxY + boxHeight - 30)
    }

    wrapText(text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ')
        let line = ''
        let currentY = y

        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' '
            const metrics = c.measureText(testLine)
            const testWidth = metrics.width
            
            if (testWidth > maxWidth && n > 0) {
                c.fillText(line, x, currentY)
                line = words[n] + ' '
                currentY += lineHeight
                
                if (currentY > canvas.height - 100) {
                    c.fillText('...', x, currentY)
                    break
                }
            } else {
                line = testLine
            }
        }
        c.fillText(line, x, currentY)
    }
}
