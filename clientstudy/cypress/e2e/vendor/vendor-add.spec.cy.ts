describe('vendor add test', () => {
    it('visits the vendor page and adds a vendor', () => {
    cy.visit('/');
    cy.get('button').click();
    cy.contains('a', 'vendors').click();
    cy.contains('control_point').click();
    cy.get('input[formcontrolname=name').click({ force: true }) .type('Sterling Test');
    cy.get('input[formcontrolname=address1').click({ force: true }).type('123 Sesame St');
    cy.get('input[formcontrolname=city').click({ force: true }).type('Brantford');
    cy.get('mat-select[formcontrolname="province"]').click({ force: true });
    cy.get('mat-option').contains('Ontario').click();
    cy.get('input[formcontrolname=postalcode').click({ force: true }).type('N3T1A5');
    cy.get('input[formcontrolname=phone').click({ force: true }).type('(519)555-5555');
    cy.get('mat-select[formcontrolname="type"]').click({ force: true });
    cy.get('mat-option').contains('Trusted').click();
    cy.get('input[formcontrolname=email').click({ force: true }).type('testvendor@gmail.com');
    cy.get('button').contains('Save').click();
    cy.contains('added!');
    
    });
    });