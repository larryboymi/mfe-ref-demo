describe('Reporting MFE smoke', () => {
  it('shows positions table and totals', () => {
    cy.visit('/')
    cy.contains('h2', 'Positions (Reporting MFE)').should('be.visible')
    cy.contains('th', 'Symbol').should('be.visible')
    cy.contains('td', 'AAPL').should('be.visible')
    cy.contains('td', 'TSLA').should('be.visible')
    cy.contains('td', '$12,000').should('be.visible')
  })
})
