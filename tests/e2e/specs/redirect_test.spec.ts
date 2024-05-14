/* eslint-disable no-undef */
describe('Redirect Test', () => {
  it('should redirect to / when accessing /favorites without logging in', () => {
    cy.visit('/#/favorites')
    cy.wait(1000)
    cy.url().should('eq', 'http://172.18.0.2:4173/#/')
  })
})
