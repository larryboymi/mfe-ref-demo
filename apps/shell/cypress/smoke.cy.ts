describe('Shell smoke', () => {
  it('renders nav and loads remote routes', () => {
    cy.visit('/')
    cy.contains('Shell host app').should('be.visible')
    cy.contains('nav a', 'Accounts').click()
    cy.contains('h2', 'Accounts (Accounts MFE)').should('be.visible')
    cy.contains('button', 'View details').should('exist')

    cy.contains('nav a', 'Reporting').click()
    cy.contains('h2', 'Positions (Reporting MFE)').should('be.visible')
    cy.contains('td', 'AAPL').should('be.visible')
  })
})
