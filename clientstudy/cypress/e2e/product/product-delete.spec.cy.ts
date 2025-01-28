describe('Product delete test', () =>{
    it('Visits the products page and deletes a product', () =>{
        cy.visit('/');
        cy.get('button').click();
        cy.contains('a','products').click();
        cy.contains('ABC123').click();
        cy.get('button').contains('Delete').click();
        cy.contains('deleted');
    });
});