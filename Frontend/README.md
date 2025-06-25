# Khaadi Loyalty App Frontend

A Flutter application for the Khaadi Loyalty Program.

## Current Setup (UI/UX Development Mode)

This project is currently configured for UI/UX development with **mock data**. All backend dependencies have been commented out to allow you to focus on frontend development.

### What's Been Modified:

1. **API Service** (`lib/services/api_service.dart`):
   - All HTTP requests commented out
   - Mock data added for user profile and transactions
   - Simulated network delays for realistic testing

2. **Auth Provider** (`lib/providers/auth_provider.dart`):
   - SharedPreferences dependency commented out
   - Login always succeeds with mock token

3. **Screens**:
   - Home and Settings screens automatically load mock data
   - All UI components work with mock data

4. **Dependencies** (`pubspec.yaml`):
   - `http` package commented out
   - `shared_preferences` package commented out

### Mock Data:

- **User Profile**: John Doe with 1250 points (Gold level)
- **Transactions**: 4 sample transactions (purchases and redemptions)
- **Login**: Any phone number will work

### To Run the App:

```bash
flutter pub get
flutter run
```

### To Restore Backend Functionality:

1. Uncomment the dependencies in `pubspec.yaml`:
   ```yaml
   http: ^1.4.0
   shared_preferences: ^2.5.3
   ```

2. Uncomment the imports and code in:
   - `lib/services/api_service.dart`
   - `lib/providers/auth_provider.dart`

3. Update the API base URL in `api_service.dart` to point to your backend

4. Run `flutter pub get` to install the dependencies

### Features Available for UI/UX Development:

- ✅ Login screen with phone number input
- ✅ Home screen with points display and QR code
- ✅ Transaction history with sample data
- ✅ Settings screen with user info and logout
- ✅ Navigation between screens
- ✅ Loading states and error handling
- ✅ Material Design 3 theming

### Next Steps for UI/UX Enhancement:

1. **Design System**: Create consistent colors, typography, and spacing
2. **Animations**: Add smooth transitions and micro-interactions
3. **Responsive Design**: Ensure the app works well on different screen sizes
4. **Accessibility**: Add proper labels and support for screen readers
5. **Dark Mode**: Implement theme switching
6. **Custom Widgets**: Create reusable components for better consistency
7. **Onboarding**: Design welcome screens and tutorials
8. **Error States**: Improve error messages and empty states

## Project Structure

```
lib/
├── main.dart                 # App entry point
├── models/                   # Data models
│   ├── user.dart
│   └── transaction.dart
├── providers/                # State management
│   ├── auth_provider.dart
│   └── user_provider.dart
├── screens/                  # UI screens
│   ├── home_screen.dart
│   ├── login_screen.dart
│   ├── settings_screen.dart
│   └── transaction_history_screen.dart
├── services/                 # API and business logic
│   └── api_service.dart
└── widgets/                  # Reusable UI components
    ├── points_card.dart
    └── transaction_tile.dart
```

## Getting Started

This project is a starting point for a Flutter application.

A few resources to get you started if this is your first Flutter project:

- [Lab: Write your first Flutter app](https://docs.flutter.dev/get-started/codelab)
- [Cookbook: Useful Flutter samples](https://docs.flutter.dev/cookbook)

For help getting started with Flutter development, view the
[online documentation](https://docs.flutter.dev/), which offers tutorials,
samples, guidance on mobile development, and a full API reference.
