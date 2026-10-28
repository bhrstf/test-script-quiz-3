class Loginpage{
    visitPage(){
        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
    }
    inputUsername(username){
        cy.get('input[name="username"]').type(username)
    }
    inputPassword(password){
        cy.get('input[name="password"]').type(password)
    }
    clickLogin(){
        cy.contains('button', 'Login').click()
    }
    verifyLoginSuccess(){
        cy.url().should('include', '/dashboard')
        cy.get('.oxd-topbar-header-breadcrumb h6').should('have.text', 'Dashboard')
    }
    verifyLoginFailure(){
        cy.get('.oxd-alert-content-text').should('have.text', 'Invalid credentials')
    }
    verifyLoginFailureEmptyFields(expectedCount){
        cy.get('.oxd-input-field-error-message').should('have.length', expectedCount).each(($message) => {
            cy.wrap($message).should('have.text', 'Required')
        })  
    }
    verifyLoginFailureInvalidUsername(){
        cy.get('.oxd-alert-content-text').should('have.text', 'Invalid credentials')
    }
    verifyLoginFailureInvalidPassword(){
        cy.get('.oxd-alert-content-text').should('have.text', 'Invalid credentials')
    }
}

export default new Loginpage