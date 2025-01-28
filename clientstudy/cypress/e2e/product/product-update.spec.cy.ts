describe('Product Update Test', () =>{
it('Visits the product page and updates a product', () =>{
    cy.visit('/');
    cy.get('button').click();
    cy.contains('a','products').click();
    cy.contains('ABC123').click();
    cy.get('input[formcontrolname=msrp').clear();
    cy.get('input[formcontrolname=msrp').type('199.99');
    cy.get('button').contains('Save').click();
    cy.contains('updated');
})
});