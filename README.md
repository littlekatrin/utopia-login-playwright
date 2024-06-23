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
Starting login at: 6/22/2024, 9:01:00 PM
Active Spell: FERTILE_LANDS (0 days)
Active Spell: FOUNTAIN_OF_KNOWLEDGE (8 days)
Active Spell: INSPIRE_ARMY (19 days)
Active Spell: MINER'S_MYSTIQUE (11 days)
Active Spell: GHOST_WORKERS (15 days)
Casting FERTILE_LANDS ...
-------------------------------------
Starting sitter login at: 6/22/2024, 9:01:04 PM
Active Spell: FERTILE_LANDS (10 days)
Active Spell: FANATICISM (2 days)
Active Spell: NATURE'S_BLESSING (29 days)
Active Spell: MINOR_PROTECTION (9 days)
Active Spell: FOUNTAIN_OF_KNOWLEDGE (4 days)
Active Spell: INSPIRE_ARMY (10 days)
Active Spell: LOVE_AND_PEACE (11 days)
-------------------------------------
Login(s) completed at: 6/22/2024, 9:01:05 PM
Next login scheduled at 6/22/2024, 10:08:00 PM (in 66.90 minutes)

Starting login at: 6/22/2024, 10:08:00 PM
Active Spell: FOUNTAIN_OF_KNOWLEDGE (7 days)
Active Spell: INSPIRE_ARMY (18 days)
Active Spell: MINER'S_MYSTIQUE (10 days)
Active Spell: GHOST_WORKERS (14 days)
Active Spell: FERTILE_LANDS (32 days)
-------------------------------------
Starting sitter login at: 6/22/2024, 10:08:03 PM
Active Spell: FERTILE_LANDS (9 days)
Active Spell: FANATICISM (1 days)
Active Spell: NATURE'S_BLESSING (28 days)
Active Spell: MINOR_PROTECTION (8 days)
Active Spell: FOUNTAIN_OF_KNOWLEDGE (3 days)
Active Spell: INSPIRE_ARMY (9 days)
Active Spell: LOVE_AND_PEACE (10 days)
-------------------------------------
Login(s) completed at: 6/22/2024, 10:08:04 PM
Next login scheduled at 6/22/2024, 11:06:00 PM (in 57.93 minutes)
```

## Troubleshooting

- Ensure you have Node.js and npm installed on your machine.
- Verify that your `.env` file is correctly set up with the proper credentials.
- Make sure all npm dependencies are installed by running `npm install`.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
