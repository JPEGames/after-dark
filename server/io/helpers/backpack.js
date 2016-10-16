// <-- Event Table for backpack stuff -->
module.exports = {
  'electricity': {
    title: 'Electricity Found',
    description: 'You gathered some electricity.',
    quantity: Math.floor(Math.random() * 20) + 1,
    eventType: 'confirm',
    id: 5,
    type: 'resource',
    source: '/pimages/electricity.png',
    status: 'success',
    exitType: 'immediate'
  },
  'metal': {
    title: 'Metal Found',
    description: 'You gathered some metal.',
    quantity: Math.floor(Math.random() * 20) + 1,
    eventType: 'confirm',
    id: 6,
    type: 'resource',
    source: '/pimages/metal.png',
    status: 'success',
    exitType: 'immediate'
  },
  'water': {
    title: 'Water Found',
    description: 'You gathered some water.',
    quantity: Math.floor(Math.random() * 20) + 1,
    eventType: 'confirm',
    id: 7,
    type: 'resource',
    source: '/pimages/water.png',
    status: 'success',
    exitType: 'immediate'
  },
  'air': {
    title: 'Oxygen Found',
    description: 'You gathered some oxygen.',
    quantity: Math.floor(Math.random() * 20) + 1,
    eventType: 'confirm',
    id: 8,
    type: 'resource',
    source: '/pimages/air.png',
    status: 'success',
    exitType: 'immediate'
  }
}
