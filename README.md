# Utopia Login Playwright Script

This project contains a Playwright script to automate the login process for the Utopia game. The script runs immediately upon execution and then schedules subsequent runs to occur within the first 5 minutes of each hour.

## Prerequisites

- Node.js (v14.x or higher)
- npm (v6.x or higher)

## Setup Instructions

### 1. Clone the Repository

```
git clone https://github.com/littlekatrin/utopia-login-playwright.git
cd utopia-login-playwright
```

### 2. Install Dependencies

Install the necessary npm packages:

```
npm install
npx playwright install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory of the project and add your credentials:

```
UTO_USERNAME=your-username
UTO_PASSWORD=your-password
```

### 4. Run the Script

Execute the script using Node.js:

```
npm run autologin
```

The script will run immediately and then schedule the next run to occur within the first 5 minutes of each subsequent hour.

## Logging

The script logs the start and end times of each test run, as well as the exact timestamp and the number of minutes until the next scheduled run. This helps in tracking the execution and scheduling times.

### Example Log Output

```
Starting login at: 6/22/2024, 5:39:21 PM
Active Spell: FERTILE_LANDS (4 days)
Active Spell: FOUNTAIN_OF_KNOWLEDGE (12 days)
Casting INSPIRE_ARMY ...
-------------------------------------
Starting sitter login at: 6/22/2024, 5:39:25 PM
Active Spell: FOUNTAIN_OF_KNOWLEDGE (0 days)
Active Spell: FERTILE_LANDS (14 days)
Active Spell: FANATICISM (6 days)
Active Spell: NATURE'S_BLESSING (33 days)
Active Spell: MINOR_PROTECTION (13 days)
Casting FOUNTAIN_OF_KNOWLEDGE ...
Casting INSPIRE_ARMY ...
-------------------------------------
Login(s) completed at: 6/22/2024, 5:39:26 PM
Next login scheduled at 6/22/2024, 6:20:00 PM (in 40.56 minutes)
```

## Troubleshooting

- Ensure you have Node.js and npm installed on your machine.
- Verify that your `.env` file is correctly set up with the proper credentials.
- Make sure all npm dependencies are installed by running `npm install`.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
