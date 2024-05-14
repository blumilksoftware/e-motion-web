/* eslint-disable no-undef */
describe('Is it working', () => {
  it('Visits the app root url', () => {
    cy.visit('/')
    cy.wait(1000)
  })
})
