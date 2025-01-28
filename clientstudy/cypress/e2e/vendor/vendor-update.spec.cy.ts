describe('Vendor update test', () => {
    it('visits the vendor page and updates a vendor', () => {
    cy.visit('/');
    cy.get('button').click();
    cy.contains('a', 'vendors').click();
    cy.contains('Test').click(); // replace Slick with your own name
    cy.get("[type='email']").clear();
    cy.get("[type='email']").type('someemail@domain.com');
    cy.get('button').contains('Save').click();
    cy.contains('updated!');
    });
    });