describe('Product create test', () => {
    it('Visits the products page and creates a product', () => {
        cy.visit('/');
        cy.get('button').click();
        cy.contains('a','products').click();
        cy.contains('control_point').click();
        cy.get('input[formControlName=id').type('ABC123');
        cy.get('mat-select[formcontrolname=vendorid').click();
        cy.contains('Sterling Gault').click();
        cy.get('input[formcontrolname=name').type('test paper');
        cy.get('input[formcontrolname=msrp').type('123.45');
        cy.get('input[formcontrolname=costprice').type('123.00');
        cy.get('.mat-expansion-indicator').eq(0).click();
        cy.get('.mat-expansion-indicator').eq(1).click();
        cy.get('input[formcontrolname=rop').type('5');
        cy.get('input[formcontrolname=eoq').type('6');
        cy.get('input[formcontrolname=qoh').type('7');
        cy.get('input[formcontrolname=qoo').type('8');
        cy.get('button').contains('Save').click();
        cy.contains('created');

    });
});