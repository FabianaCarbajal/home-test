# **App Automation Test**

## Must have before start

- Git
- Docker
- Node.js

### Steps

1. Clone repository
```bash
git clone https://github.com/FabianaCarbajal/home-test.git
cd home-test
```

2. Install dependencies
```bash
npm install
npx playwright install
```

3. Pull the docker image containing the web app
```bash
docker pull automaticbytes/demo-app
```

4. Run the image
```bash
docker run -d -p 3100:3100 --name demo-app automaticbytes/demo-app
```

5. Verify the app is running
Open browser to `http://localhost:3100`

6. Run tests
```bash
npm test
```

### General requisites for submission

 1. **Programming languages**
    - ~~Java~~
    - ~~Javascript~~
    - **Typescript** ✅

 2. **Drivers**
    - **Playwright** ✅
    - ~~Selenium~~

 3. **Browsers**
    - Cross-Browser Testing: Tests should be compatible with multiple browsers and ensure they behave consistently.
  
 4. **Multi-Platform Testing (_Desirable_):**
	Tests should support execution on multiple platforms, including:
   	- Desktop (Windows, macOS, Linux)
   	- Mobile devices (Android, iOS)
  
 5. **Environment Configuration (_Desirable_):**
   	- The solution must include a Dockerized environment to ensure tests can be executed in an isolated and reproducible environment.
   	- Instructions for setting up and running tests in Docker must be provided.

### General test requisites
- All tests should provide a setup and tear down mechanism that opens and closes the browser.
- All tests should run successfully either from IDE or command line.
- Instructions to build and run the code and tests submitted must be provided.
- Submitted code implementing a Page Object Model will be taken in high consideration.

### Tests Scenarios
1.  Login Success
    - Navigate to http://localhost:3100/login
    - Successfully login with credentials: johndoe19/supersecret
    - Assert that welcome message containing username is shown.

2. Login Failure A
    - Navigate to http://localhost:3100/login
    - Enter wrong username/password
    - Assert error message is shown.

3. Login Failure B
    - Navigate to http://localhost:3100/login
    - Leave both username/password in blank
    - Assert error message is shown.

4. Checkout Form Order Success
    - Navigate to http://localhost:3100/checkout
    - Complete all the fields
    - Verify that if "Shipping address same as billing" checkbox is not checkmarked then checkmark it.
    - Submit the form and assert that the order confirmation number is not empty.

5. Checkout Form Alert
    - Navigate to http://localhost:3100/checkout
    - Complete all the fields
    - Verify that if "Shipping address same as billing" checkbox is checkmarked, then uncheckmark it.
    - Try to submit the form and validate that the alert message is shown and confirm the alert.
    - Assert alert is gone.

6. Cart Total Test
    - Navigate to http://localhost:3100/checkout
    - Assert that the cart total shown is correct for the item prices added.

7. Grid Item Test
    - Navigate to http://localhost:3100/grid
    - Assert that in position 7 the product shown is "Super Pepperoni"
    - Assert that the price shown is $10
	
8. Grid All Items Test	
    - Navigate to http://localhost:3100/grid
    - Assert that all the items have a non empty title, price, image and a button.

9. Search Success
    - Navigate to http://localhost:3100/search
    - Search for any word (for instance automation)
    - Assert that "Found one result for" plus the word you searched is shown.

10. Search Empty
    - Navigate to http://localhost:3100/search
    - Leave search box empty and submit the search
    - Assert that "Please provide a search word." message is shown.
