## Prerequisites

1. **Node.js**: Ensure you have Node.js installed (>=16.x).
2. **Playwright**: This project uses Playwright for browser automation. All necessary dependencies will be installed with the `npm install` command.

## Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-name>
2. Install dependencies
	 ```bash
	 npm install
	 npx playwright install
	  ```
3. Execute the tests and show report
   ```bash
	 npx playwright test --project=chromium (all test)
	 npx playwright test --ui (interactive and visual interface)
	 npx playwright show-report
	 ```
	 
## Proyect structure
- **/data-test**: is the folder where the data for the tests are stored.
- **/pages**: is the folder with the objects representing the different pages
- **/test**:is the folder containing the tests 

A “Page Object Model” was used, where the login, To Do and folder pages were modeled. Each object has the necessary locators for testing and the actions to iterate each test case.
In addition, a KISS design pattern has been used, where some objects have similar functions that could be refactored but it has been decided to keep them separately for future scalability.	  
