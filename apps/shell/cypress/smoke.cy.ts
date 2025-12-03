describe('Shell smoke', () => {
  it('renders nav and loads remote routes', () => {
    cy.visit('/')
    cy.contains('Shell host app').should('be.visible')
    cy.contains('nav a', 'Accounts').click()
    cy.contains('h2', 'Accounts MFE').should('be.visible')
    cy.contains('button', 'View details').should('exist')

    cy.contains('nav a', 'Positions').click()
    cy.contains('h2', 'Positions MFE').should('be.visible')
    cy.contains('td', 'AAPL').should('be.visible')
  })
})
