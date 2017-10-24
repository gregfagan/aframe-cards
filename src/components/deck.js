import { registerComponent } from 'aframe'

export default registerComponent('deck', {
  schema: {
    cards: { type: 'array' }
  },

  init() {
    this.draw()
  },
  play() {},
  pause() {},
  remove() {},

  // Draws a card into the hand
  draw() {
    console.log('draw')

    const { el, data } = this
    const { sceneEl } = el
    const { cards } = data
    const hand = document.getElementById('hand')

    const lock = hand.components.constraint
    if (cards && cards.length && !lock) {
      const nextCard = cards.shift()
      const position = hand.getAttribute('position')
      const rotation = hand.getAttribute('rotation')

      console.log(`drawing ${nextCard}`)

      const card = document.createElement('a-card')
      card.setAttribute('id', nextCard)
      card.setAttribute('position', position)
      card.setAttribute('rotation', rotation)
      card.setAttribute('material', 'shader', nextCard)

      card.addEventListener('body-loaded', () => {
        const constraintId = `constraint__${nextCard}`
        console.log(card.body)

        hand.setAttribute(constraintId, {
          type: 'lock',
          collideConnected: false,
          target: `#${nextCard}`
        })

        card.setAttribute('grabbable', true)
        card.setAttribute('only-grab-once', true)
        card.addEventListener('grab-begin', () => {
          hand.removeAttribute(constraintId)
        })
        card.addEventListener('grab-end', () => {
          setTimeout(() => this.draw(), 1000)
        })
      })
      sceneEl.appendChild(card)
    }
  }
})
