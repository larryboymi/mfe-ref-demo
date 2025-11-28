describe('Accounts MFE smoke', () => {
  it('shows account cards and details', () => {
    cy.visit('/')
    cy.contains('h2', 'Accounts (Accounts MFE)').should('be.visible')
    cy.contains('h3', 'Retirement 401k').should('be.visible')
    cy.contains('h3', 'Brokerage').should('be.visible')
    cy.contains('button', 'View details').first().click()
    cy.contains('h3', 'Selected account').should('be.visible')
    cy.contains('div', 'ID: 1').should('be.visible')
    cy.contains('div', 'Name: Retirement 401k').should('be.visible')
  })
})
