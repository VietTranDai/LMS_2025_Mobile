# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).


## Project Directory Structure

Below is a detailed description of the project's directory structure:

### 1. **`.expo` Directory**
- Contains configuration files and device information for Expo.
- `devices.json`: Stores information about connected devices.
- `README.md`: Documentation guide for the `.expo` directory.
- `types/router.d.ts`: Type definitions for the Expo router.

### 2. **`.git` Directory**
- Manages version control with Git.
- Includes files such as `config`, `hooks`, `logs`, `objects`, and `refs` to track the repository's history and status.

### 3. **`.idea` Directory**
- Configuration for the IntelliJ IDEA IDE.
- Contains files like `workspace.xml`, `modules.xml`, and `LMS_2025_Mobile.iml` to support development.

### 4. **`app` Directory**
- The main directory containing the application's modules and layouts.
- `auth/index.tsx`: Component for the authentication module.
- `home/index.tsx`: Component for the home page module.
- `index.tsx`: Main entry point of the application.
- `_layout.tsx`: Shared layout for screens.

### 5. **`app-example` Directory**
- Contains an example application structure with tabs and components.
- `app/(tabs)`: Example screens such as `explore.tsx` and `index.tsx`.
- `components/`: Sample components like `Collapsible.tsx`, `ThemedText.tsx`.
- `constants/Colors.ts`: Color definitions for the example.
- `hooks/`: Hooks such as `useColorScheme.ts` and `useThemeColor.ts`.
- `scripts/reset-project.js`: Script to reset the project.

### 6. **`assets` Directory**
- Contains static resources.
- `fonts/SpaceMono-Regular.ttf`: Font used in the application.
- `images/`: Images such as `icon.png`, `react-logo.png`, and `splash-icon.png`.

### 7. **`components` Directory**
- Contains shared components.
- `Avatar.tsx`: Component for displaying avatars.
- `Button.tsx`: Button component.

### 8. **`constants` Directory**
- Contains shared constants.
- `colors.ts`: Defines color values.
- `strings.ts`: Defines text strings.

### 9. **`hooks` Directory**
- Contains custom hooks.
- `useNotifications.ts`: Hook for managing notifications.

### 10. **`modules` Directory**
- Contains functional modules such as `auth` and `home`.
- Each module includes subdirectories like `components`, `hooks`, `services`, `store`, `utils`, and `validation`.

### 11. **`service` Directory**
- Contains shared services for the application.

### 12. **`store` Directory**
- Manages the application's state (may use Redux or other tools).

### 13. **`utils` Directory**
- Contains utility functions.
- `formatDate.ts`: Function for formatting dates.
- `validateEmail.ts`: Function for email validation.

### 14. **Configuration Files**
- `.env`: File containing environment variables.
- `.gitignore`: Specifies files/directories ignored by Git.
- `app.json`: Expo application configuration.
- `babel.config.js`: Babel configuration.
- `expo-env.d.ts`: Type definitions for Expo.
- `globals.css`: Global CSS.
- `metro.config.js`: Metro bundler configuration.
- `nativewind-env.d.ts`: Type definitions for NativeWind.
- `package.json`: Manages dependencies and scripts.
- `package-lock.json`: Lock file for dependencies.
- `tailwind.config.js`: Tailwind CSS configuration.
- `tsconfig.json`: TypeScript configuration.