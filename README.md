# 💳 NexaBank App Prototype

## 📌 Overview
NexaBank is a web-based banking application prototype designed to simulate core digital banking functionalities. The system allows users to securely manage their finances, including account access, transfers, bill payments, loan management, and interaction with an AI assistant (Nexi). This project was developed as part of a Software Engineering course to demonstrate requirements analysis, system design, and implementation.

## 🚀 Features
🔐 Authentication & Security: User login with username/email and password, Two-Factor Authentication (2FA), and session timeout for security.  
💰 Account Management: View checking and savings balances, real-time balance updates, and transaction history tracking.  
💸 Transactions: Internal transfers (checking ↔ savings), peer-to-peer transfers (Nexa users), external transfers (routing + account validation), and cash withdrawals.  
🧾 Payments: Bill payments and loan payments (manual + minimum payments).  
🤖 Nexi AI Assistant: Natural language command processing with multi-action execution (e.g., “pay loan and transfer $100”), supporting transfers, loan payments, withdrawals, and bill payments.  
🔔 Notifications: Real-time transaction alerts, unread notification tracking, and toast messages for user feedback.

## 🧱 Project Structure
NexaBank-App/  
│  
├── index.html  
├── css/  
│   └── styles.css  
├── js/  
│   ├── app.js              # Core app logic & state  
│   ├── auth.js             # Login & 2FA  
│   ├── transfers.js        # Transfers & withdrawals  
│   ├── bills.js            # Bill payments  
│   ├── loans.js            # Loan management  
│   ├── notifications.js    # Notifications & toasts  
│   └── nexi.js             # AI assistant logic  

## ⚙️ Technologies Used
HTML5, CSS3, JavaScript (Vanilla JS), Git & GitHub for version control.

## 🧪 Testing
Each feature is mapped to test cases as part of the Requirements Traceability Matrix (RTM). Example tests include login and 2FA validation, balance updates after transactions, transfer correctness (both accounts updated), loan payment calculations, and Nexi multi-command execution.

## 📊 Requirements Engineering
This project includes Functional Requirements (FR), Non-Functional Requirements (NFR), User Stories (Jira), and a Requirements Traceability Matrix (RTM). Traceability ensures SRS → User Stories → Test Cases.

## 👥 Team Collaboration
Version control is managed using GitHub with a feature-based branching strategy. Code contributions are reviewed before merging to maintain stability and quality.

## 🔒 Repository
This repository is private and includes controlled access for team collaboration. A backup branch (backup-stable) is maintained to prevent data loss.

## 💡 Future Improvements
Future enhancements include improving Nexi’s natural language understanding, adding database persistence instead of in-memory state, enhancing UI/UX responsiveness, and implementing a real authentication backend.

## 👨‍💻 Author
Marco Sanchez  
Florida Gulf Coast University  
Software Engineering Student  

## 📌 Notes
This project is a prototype and does not connect to real financial systems. It is intended for educational purposes only.
