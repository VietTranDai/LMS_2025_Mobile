# LMS_2025_Mobile

A Learning Management System (LMS) mobile application built with React Native and Expo.

## Features

- Course browsing and enrollment
- Lesson viewing and tracking
- User authentication
- Profile management
- Push notifications

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/LMS_2025_Mobile.git
cd LMS_2025_Mobile
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:

```
API_URL=https://your-api-url.com
API_TIMEOUT=20000
API_VERSION=v1
API_DEBUG=false
```

4. Start the development server:

```bash
npm start
# or
yarn start
```

## Environment Configuration

The application uses a `.env` file to configure API settings with proper React Native support through `react-native-dotenv`. The following variables are supported:

| Variable    | Description                        | Default                 |
| ----------- | ---------------------------------- | ----------------------- |
| API_URL     | Base URL for API requests          | https://api.example.com |
| API_TIMEOUT | Request timeout in milliseconds    | 20000                   |
| API_VERSION | API version                        | v1                      |
| API_DEBUG   | Enable debug logging for API calls | false                   |

To modify these settings, edit the `.env` file in the project root.

### How Environment Variables Work

This project uses `react-native-dotenv` and `babel-plugin-transform-inline-environment-variables` to ensure proper environment variable handling:

- Environment variables are securely loaded at build time
- Strong TypeScript support with type definitions in `env.d.ts`
- Centralized configuration in `config/environment.ts`
- Fallback default values for safety

When adding new environment variables:

1. Add them to the `.env` file
2. Add TypeScript declarations in `env.d.ts`
3. Import and use them through the `config/environment.ts` module

## Project Structure

- `app/` - Expo Router application screens
- `components/` - Reusable UI components
- `config/` - Configuration files
- `constants/` - Application constants
- `contexts/` - React contexts
- `hooks/` - Custom React hooks
- `modules/` - Feature modules
- `service/` - API services
- `store/` - State management
- `utils/` - Utility functions

## UI Components

The project includes several enhanced UI components with professional animations and effects:

### Button Component

The `Button` component supports multiple variants and animations:

- Variants: primary, secondary, outline, text, gradient, glass
- Sizes: small, medium, large
- Animations: scale, opacity
- Features: haptic feedback, shadows, gradient backgrounds

### Card Component

The `Card` component provides a flexible container with:

- Variants: elevated, outlined, filled, glass, gradient
- Customizable headers and footers
- Animations on press
- Shadow effects and rounded corners

## API Configuration

API requests are centralized through the `apiClient` service, which:

- Uses Axios for HTTP requests
- Automatically adds authentication tokens to requests
- Handles token expiration and logout
- Provides optional debug logging for API calls
- Uses environment variables for configuration

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
