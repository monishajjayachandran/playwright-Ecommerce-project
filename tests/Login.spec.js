

import { test, expect } from '@playwright/test';

test.describe('Login Functionality', () => {
    // Positive login tests

    test.skip("Valid Credentials for Login Page ",async({page})=>{

    await page.goto("https://www.saucedemo.com/")
    await page.getByPlaceholder("Username").fill("standard_user")
    await page.locator("#password").fill("secret_sauce")
    
    await page.locator('#login-button').click();
    await expect(page).toHaveURL(/inventory.html/);
  await expect(page.getByText('Products', { exact: true })).toBeVisible();

}
)
});

test.describe('Negative Login Tests', () => {
    // Invalid credentials and empty fields
    test.skip('Verify login with invalid username', async ({ page }) => {
await page.goto("https://www.saucedemo.com/")
    await page.getByPlaceholder("Username").fill("invalid_user")
    await page.locator("#password").fill("secret_sauce")
    await page.locator('#login-button').click();
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]'))
        .toContainText('Epic sadface: Username and password do not match any user in this service');
    

})

test.skip('Verify login with invalid password', async ({ page }) => {
await page.goto("https://www.saucedemo.com/")
    await page.getByPlaceholder("Username").fill("standard_user")
    await page.locator("#password").fill("wrong_password")
    await page.locator('#login-button').click();
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]'))
        .toContainText('Epic sadface: Username and password do not match any user in this service');
    

})

test.skip('Verify login with empty field', async ({ page }) => {
await page.goto("https://www.saucedemo.com/")
    await page.locator('#login-button').click();
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]'))
        .toContainText('Epic sadface: Username is required');
    

})


test('Verify password field is masked', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    const password = page.getByPlaceholder('Password');
    await password.fill('secret_sauce');
    await expect(password).toHaveAttribute('type', 'password');
});


test.skip("Visibility for login page fields",async({page})=>{
await page.goto("https://www.saucedemo.com/")
    await page.getByPlaceholder("Username").toBeVisible()
    await page.locator("#password").toBeVisible()
    await page.locator('#login-button').toBeVisible()
    console.log("username,password and login button visible")

})
});

test.describe('Login Security Tests', () => {
    // SQL injection and access control

    const boundaryLengths = [0, 1, 2, 10, 50, 100];

for (const length of boundaryLengths) {
    test(`Username accepts ${length} characters`, async ({ page }) => {
        await page.goto('https://www.saucedemo.com/');

        const username = page.getByPlaceholder('Username');
        const testValue = 'a'.repeat(length);

        await username.fill(testValue);

        await expect(username).toHaveValue(testValue);
    });

    test(`Password accepts ${length} characters`, async ({ page }) => {
        await page.goto('https://www.saucedemo.com/');

        const password = page.getByPlaceholder('Password');
        const testValue = 'a'.repeat(length);

        await password.fill(testValue);

        await expect(password).toHaveValue(testValue);
    });
}


test('Verify login rejects SQL injection input', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    await page.getByPlaceholder('Username').fill("' OR '1'='1");
    await page.getByPlaceholder('Password').fill('anything123');

    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL('https://www.saucedemo.com/');

    await expect(page.locator('[data-test="error"]')).toBeVisible();
});


test('Verify login with special characters', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    await page.getByPlaceholder('Username').fill('!@#$%^&*()');
    await page.getByPlaceholder('Password').fill('P@ss!#$%^&*()');

    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.locator('[data-test="error"]')).toBeVisible();
});


test('Verify login with spaces around username', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    await page.getByPlaceholder('Username').fill(' standard_user ');
    await page.getByPlaceholder('Password').fill('secret_sauce');

    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.locator('[data-test="error"]')).toBeVisible();
});

test('Verify login with spaces around password', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill(' secret_sauce ');

    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.locator('[data-test="error"]')).toBeVisible();
});


test('Verify multiple invalid login attempts', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    for (let attempt = 1; attempt <= 3; attempt++) {
        await page.getByPlaceholder('Username').fill('invalid_user');
        await page.getByPlaceholder('Password').fill('wrong_password');

        await page.getByRole('button', { name: 'Login' }).click();

        await expect(page.locator('[data-test="error"]')).toBeVisible();

        await expect(page).toHaveURL('https://www.saucedemo.com/');
    }
});


test('Verify error message for empty username', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    await page.getByPlaceholder('Password').fill('secret_sauce');

    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.locator('[data-test="error"]'))
        .toHaveText('Epic sadface: Username is required');
});


test('Verify error message for empty password', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    await page.getByPlaceholder('Username').fill('standard_user');

    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.locator('[data-test="error"]'))
        .toHaveText('Epic sadface: Password is required');
});


test('Verify login with locked out user', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    await page.getByPlaceholder('Username').fill('locked_out_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');

    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.locator('[data-test="error"]'))
        .toHaveText('Epic sadface: Sorry, this user has been locked out.');
});


test('Verify login with problem user', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    await page.getByPlaceholder('Username').fill('problem_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');

    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL(/inventory.html/);
    await expect(page.getByText('Products', { exact: true })).toBeVisible();
});


test('Verify login with performance glitch user', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    await page.getByPlaceholder('Username').fill('performance_glitch_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');

    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL(/inventory.html/, {
        timeout: 30000
    });

    await expect(page.getByText('Products', { exact: true })).toBeVisible();
});


test('Verify inventory page access without login', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html');

    await expect(page).toHaveURL('https://www.saucedemo.com/');

    await expect(page.getByPlaceholder('Username')).toBeVisible();
});


});

test.describe('Logout Functionality', () => {
    // Logout tests

test('Verify logout functionality', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html');
     await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/inventory.html/);
    await expect(page.getByText('Products', { exact: true })).toBeVisible();
    await page.getByRole('button',{name:'Open Menu'}).click()
    await page.locator('#logout_sidebar_link').waitFor({
    state: 'visible'
});
     await page.locator('#logout_sidebar_link').click()
     await expect(page).toHaveURL('https://www.saucedemo.com/');
     await expect(page.locator('[id="user-name"]')).toBeVisible();
     await page.goto('https://www.saucedemo.com/inventory.html');
     await expect(page).toHaveURL('https://www.saucedemo.com/');
   


})

});