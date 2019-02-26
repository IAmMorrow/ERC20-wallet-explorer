import gen from 'random-seed'
import gradients from './gradients'

export const getColorFromString = data => {
  const random = gen.create(data)

  const gradientId = random(gradients.length - 1)
  return gradients[gradientId].colors
}
