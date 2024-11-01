This project contains automated tests for the Sauce Demo website using Playwright, Cucumber, and TypeScript.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/saucedemo-automation.git
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

## Running Tests

Run all tests:
\`\`\`bash
npm test
\`\`\`

Generate HTML report:
\`\`\`bash
npm run test:report
\`\`\`

## Project Structure

- \`src/features\`: Cucumber feature files
- \`src/pages\`: Page Object Models
- \`src/steps\`: Step definitions
- \`src/hooks\`: Cucumber hooks
- \`src/support\`: Support files and World configuration
- \`test-results\`: Test execution artifacts

## Configuration

- \`cucumber.conf.ts\`: Cucumber configuration
- \`tsconfig.json\`: TypeScript configuration

## Dependencies

- Playwright: Browser automation
- Cucumber: BDD framework
- TypeScript: Type safety and modern JavaScript features
