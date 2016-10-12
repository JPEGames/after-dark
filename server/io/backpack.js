// <-- Event Table for backpack stuff -->
module.exports = {
  'electricity': {
    title: 'Electricity Found',
    description: 'You gathered some electricity.',
    quantity: 1,
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
    quantity: 2,
    eventType: 'confirm',
    id: 6,
    type: 'resource',
    source: '/pimages/ore.png',
    status: 'success',
    exitType: 'immediate'
  }

}
