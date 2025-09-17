# ExpenseMeter 💰

A comprehensive expense tracking and budget management application built with React Native and Node.js. Track your spending, manage budgets, and gain insights into your financial habits with an intuitive and modern interface.

![ExpenseMeter](https://img.shields.io/badge/ExpenseMeter-v1.0.0-blue)
![React Native](https://img.shields.io/badge/React%20Native-Expo-61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)

## 📱 Features

### Core Functionality
- **Transaction Management**: Add, edit, and delete income and expense transactions
- **Budget Planning**: Create and manage budgets for different categories and time periods
- **Bank Integration**: Track transactions across multiple bank accounts
- **Category System**: 13 predefined categories including Food, Transport, Entertainment, Shopping, etc.
- **Real-time Notifications & SMS Parsing**: Get notified on receipt of transaction-related SMS and add transactions from a native modal
- **Data Visualization**: Interactive charts and summaries for better financial understanding

### User Experience
- **Modern UI/UX**: Beautiful gradient backgrounds and intuitive design
- **Dark/Light Theme**: Automatic theme switching based on system preferences
- **Responsive Design**: Optimized for both mobile and tablet devices
- **Offline Support**: Local data storage with AsyncStorage
- **Smooth Animations**: Enhanced user experience with React Native Reanimated

### Security & Performance
- **JWT Authentication**: Secure user authentication and authorization
- **Data Encryption**: Password hashing with bcrypt
- **CORS Protection**: Secure API endpoints
- **Input Validation**: Comprehensive form validation and error handling
- **Optimized Queries**: Efficient database operations with MongoDB indexing

## 🏗️ Architecture

### Frontend (Mobile App)
- **Framework**: React Native with Expo
- **Navigation**: Expo Router with file-based routing
- **State Management**: React Context API
- **Styling**: Custom styled components with theme support
- **Animations**: React Native Reanimated
- **Storage**: AsyncStorage for local data persistence

### Backend (API Server)
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with bcrypt password hashing
- **Scheduling**: Cron jobs for automated tasks
- **Middleware**: CORS protection and token verification

## 📁 Project Structure

```
ExpenseMeter/
├── mobile/                    # React Native mobile application
│   ├── app/                   # App screens and navigation
│   │   ├── (auth)/           # Authentication screens
│   │   │   ├── login.jsx
│   │   │   └── register.jsx
│   │   ├── (tabs)/           # Main app screens
│   │   │   ├── index.jsx     # Home dashboard
│   │   │   ├── addTransaction.jsx
│   │   │   ├── addBudget.jsx
│   │   │   ├── history.jsx
│   │   │   ├── banks.jsx
│   │   │   └── settings.jsx
│   │   └── _layout.jsx
│   ├── components/           # Reusable UI components
│   ├── constants/            # App constants and configurations
│   ├── context/             # React Context providers
│   ├── hooks/               # Custom React hooks
│   ├── styles/              # Styling files
│   └── utils/               # Utility functions
├── backend/                  # Node.js API server
│   ├── controllers/         # Route controllers
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API routes
│   ├── services/            # Business logic
│   ├── middlewares/         # Custom middleware
│   └── utils/               # Server utilities
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or cloud)
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ExpenseMeter.git
   cd ExpenseMeter
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the backend directory:
   ```env
   NODE_ENV=development
   PORT=3000
   MONGODB_URI_LOCAL=mongodb://localhost:27017/expensemeter
   MONGODB_URI_PRODUCTION=your_production_mongodb_uri
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Start the Backend Server**
   ```bash
   npm start
   ```

5. **Mobile App Setup**
   ```bash
   cd ../mobile
   npm install
   ```

6. **Update API Endpoint**
   Update the API URL in `mobile/constants/endPoints.js`:
   ```javascript
   export const API_URL = "http://your-ip-address:3000";
   ```

7. **Start the Mobile App**
   ```bash
   npx expo start
   ```

### Android Native SMS Ingestion (Expo + custom native code)

This project includes a native Android SMS receiver to detect bank/transaction SMS and prompt a lightweight modal to add a transaction.

- Components:
  - `SmsReceiver.java`: Listens to `SMS_RECEIVED` and filters messages by transaction keywords/amount patterns before triggering a notification and opening a native modal.
  - `SmsPromptActivity.kt`: Full-screen dialog-style modal to add a transaction directly (type, amount, bank, category, notes optional). Fetches banks from the backend and signs amount based on Income/Expense selection.
  - `SmsDataModule.kt` + `SmsDataPackage`: Native bridge for JS to pass `token`, `userId`, and `API_URL` to native (`TokenStore`).
  - `index.js`: On app start, reads AsyncStorage and calls `SmsDataModule.setAuth({ token, userId, apiUrl })`.

- Permissions (requested at runtime in `mobile/app/_layout.jsx`):
  - `RECEIVE_SMS`, `READ_SMS` for SMS detection
  - `POST_NOTIFICATIONS` (Android 13+)

- Build requirements:
  - You must perform a native build (e.g., `npx expo run:android`) after native changes.
  - The native module is registered in `MainApplication.kt` via `SmsDataPackage()`.

- Behavior:
  - Only SMS matching common transaction patterns (keywords like credited/debited/upi/amount, or INR amount regex) will trigger.
  - The modal shows:
    - Type toggle: Income/Expense (affects sign of amount)
    - Amount input (prefilled if parsed from SMS)
    - Bank dropdown (fetched from backend)
    - Category chips (horizontally scrollable)
    - Notes (left blank by default)

### Android Build/Run

- Dev server:
  ```bash
  npx expo start
  ```

- Run on device/emulator with native code:
  ```bash
  npx expo run:android --device
  ```

- Release variant:
  ```bash
  npx expo run:android --variant release --device
  ```

### Troubleshooting

- Native module not found / Not authenticated toast:
  - Ensure `SmsDataPackage` is registered in `MainApplication.kt` (it is in this repo).
  - Ensure you are logged in so `token` and `user` (with `_id`) exist in AsyncStorage.
  - App must be rebuilt after native changes.

- Bank dropdown stuck on “Loading…”:
  - Confirm backend is reachable via `API_URL` and the token is valid.
  - Endpoint is `POST /banks/all` with body `{ userId }` (note: POST, not GET).

- Keyboard hides notes:
  - The modal uses `SOFT_INPUT_ADJUST_RESIZE` and a `ScrollView`. If it still happens on specific devices, consider switching to `SOFT_INPUT_ADJUST_PAN`.

## 📱 Mobile App Features

### Authentication
- **Login/Register**: Secure user authentication with JWT tokens
- **Profile Management**: User profile with avatar support
- **Session Persistence**: Automatic login with stored tokens

### Dashboard
- **Financial Overview**: Quick stats on income, expenses, and savings
- **Budget Summary**: Current month budget status and progress
- **Recent Transactions**: Latest transaction history
- **Bank Summary**: Multi-bank account overview
- **Category Breakdown**: Spending analysis by categories

### Transaction Management
- **Add Transactions**: Income and expense tracking with categories
- **Transaction History**: Complete transaction list with filtering
- **Edit/Delete**: Modify or remove existing transactions
- **Bank Selection**: Associate transactions with specific bank accounts

### Budget Management
- **Create Budgets**: Set spending limits for categories
- **Multiple Periods**: Weekly, monthly, and yearly budget options
- **Budget Tracking**: Real-time budget vs. actual spending
- **Category-specific**: Individual budgets for different spending categories

### Bank Management
- **Add Banks**: Register multiple bank accounts
- **Bank Logos**: Visual bank identification
- **Transaction Association**: Link transactions to specific banks
- **Bank Summary**: Overview of all registered banks

## 🔧 API Endpoints

### Authentication
- `POST /users/register` - User registration
- `POST /users/login` - User login

### Transactions
- `GET /transactions/user/:id` - Get user transactions
- `POST /transactions` - Create new transaction
- `PUT /transactions/:id` - Update transaction
- `DELETE /transactions/:id` - Delete transaction

### Budgets
- `GET /budgets/user/:id` - Get user budgets
- `POST /budgets` - Create new budget
- `PUT /budgets/:id` - Update budget
- `DELETE /budgets/:id` - Delete budget

### Banks
- `POST /banks/all` - Get all banks for the logged in user (body: `{ userId }`)
- `POST /banks` - Add new bank
- `DELETE /banks/:id` - Delete bank

### Notifications
- `GET /notifications/:id` - Get user notifications
- `POST /notifications` - Create notification
- `PUT /notifications/:id` - Mark as read

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **CORS Protection**: Cross-origin request security
- **Input Validation**: Server-side validation for all inputs
- **Error Handling**: Comprehensive error management

## 📊 Data Models

### User
```javascript
{
  name: String,
  email: String,
  password: String (hashed),
  avatar: String (base64)
}
```

### Transaction
```javascript
{
  user_id: ObjectId,
  title: String,
  amount: Number,
  category: String,
  bank: ObjectId,
  date: Date
}
```

### Budget
```javascript
{
  user_id: ObjectId,
  title: String,
  amount: Number,
  category: String,
  period: String (weekly/monthly/yearly),
  start_date: Date,
  end_date: Date,
  is_active: Boolean
}
```

### Bank
```javascript
{
  name: String,
  logo: String,
  ifsc: String,
  user_id: ObjectId,
  isActive: Boolean
}
```

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or use a cloud MongoDB service
2. Configure environment variables for production
3. Deploy to platforms like Heroku, Railway, or AWS
4. Update CORS settings for production domain

### Mobile App Deployment
1. Build the app using Expo Build Service
2. Configure app.json for production
3. Generate APK/IPA files
4. Deploy to Google Play Store or Apple App Store

## 👨‍💻 Author

**Gajendran**
- GitHub: [@gajendranasokkumar](https://github.com/gajendranasokkumar)

## 🙏 Acknowledgments

- React Native community for excellent documentation
- Expo team for the amazing development platform
- MongoDB for the robust database solution
- All contributors who helped improve this project

---

**ExpenseMeter** - Take control of your finances, one transaction at a time! 💰✨
