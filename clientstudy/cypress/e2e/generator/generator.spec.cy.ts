describe('Generate a Purchase Order test', () =>{
it('visits the generator page and selects a vendor and their products', () =>{
    cy.visit('/');
    cy.get('button').click();
    cy.contains('a', 'generator').click();
    cy.wait(500); // http call
    cy.get('mat-select[formcontrolname="vendor"]').click();
    cy.contains('Gault').click();
    cy.wait(500); // http call
    cy.get('mat-select[formcontrolname="product"]').click({ force: true });
    cy.contains('Paper 2').click({ force: true });
    cy.get('mat-select[formcontrolname="quantity"]').click({ force: true });
    cy.get('mat-option').contains('3').click();
    cy.get('mat-select[formcontrolname="product"]').click({ force: true });
    cy.contains('Paper 1').click({ force: true });
    cy.get('mat-select[formcontrolname="quantity"]').click({ force: true });
    cy.get('mat-option').contains('2').click();
    cy.get('button').contains('Add').click();
    cy.contains('added!');
});
});