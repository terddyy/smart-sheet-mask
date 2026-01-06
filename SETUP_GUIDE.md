# Smart Sheet Mask - Complete Setup Guide

This guide will walk you through setting up and running the Smart Sheet Mask app on your computer, step by step. No technical experience required!

---

## 📋 What You'll Need

Before starting, make sure you have:
- **A Windows computer** (this guide is for Windows)
- **An Android phone or tablet** with USB debugging enabled
- **USB cable** to connect your phone to computer
- **Internet connection** for downloading software

---

## 🛠️ Step 1: Install Required Software

### 1.1 Install Node.js
Node.js is the engine that runs JavaScript code on your computer.

1. Go to [https://nodejs.org](https://nodejs.org)
2. Download the **LTS version** (Long Term Support)
3. Run the installer
4. Click "Next" through all steps (keep default settings)
5. Restart your computer after installation

**How to verify it worked:**
- Open Command Prompt (search for "cmd" in Windows)
- Type: `node --version`
- You should see something like `v20.x.x`

### 1.2 Install Git
Git helps you download and manage code from GitHub.

1. Go to [https://git-scm.com/download/win](https://git-scm.com/download/win)
2. Download and run the installer
3. Click "Next" through all steps (keep default settings)
4. Restart Command Prompt

**How to verify it worked:**
- Open Command Prompt
- Type: `git --version`
- You should see something like `git version 2.x.x`

### 1.3 Install Android Studio (for building the app)
Android Studio is needed to build and run the app on Android devices.

1. Go to [https://developer.android.com/studio](https://developer.android.com/studio)
2. Download Android Studio
3. Run the installer
4. During installation:
   - Choose "Standard" installation
   - Accept all licenses
   - Let it download Android SDK
5. This will take 15-30 minutes

**Set up Android SDK:**
1. Open Android Studio
2. Click "More Actions" → "SDK Manager"
3. Under "SDK Platforms" tab, check:
   - ✅ Android 14.0 (UpsideDownCake)
   - ✅ Android 13.0 (Tiramisu)
4. Under "SDK Tools" tab, check:
   - ✅ Android SDK Build-Tools
   - ✅ Android SDK Command-line Tools
   - ✅ Android Emulator
   - ✅ Android SDK Platform-Tools
5. Click "Apply" and wait for downloads

**Set up Environment Variables:**
1. Press Windows key + Search for "Environment Variables"
2. Click "Edit the system environment variables"
3. Click "Environment Variables" button
4. Under "User variables", click "New"
5. Add these two variables:

   **Variable 1:**
   - Variable name: `ANDROID_HOME`
   - Variable value: `C:\Users\YourUsername\AppData\Local\Android\Sdk`
   
   **Variable 2:**
   - Variable name: `Path` (edit existing)
   - Click "New" and add: `%ANDROID_HOME%\platform-tools`
   - Click "New" and add: `%ANDROID_HOME%\tools`

6. Click "OK" on all windows
7. Restart your computer

---

## 📱 Step 2: Prepare Your Android Phone

### 2.1 Enable Developer Mode
1. Open **Settings** on your phone
2. Go to **About Phone**
3. Find **Build Number**
4. **Tap it 7 times** (you'll see "You are now a developer!")

### 2.2 Enable USB Debugging
1. Go back to **Settings**
2. Look for **Developer Options** (usually near the bottom)
3. Turn on **USB Debugging**
4. Also turn on **Install via USB**

### 2.3 Connect Your Phone
1. Connect your phone to computer via USB
2. On your phone, you'll see a popup asking "Allow USB debugging?"
3. Check "Always allow from this computer"
4. Click **OK**

**How to verify it worked:**
- Open Command Prompt
- Type: `adb devices`
- You should see your phone listed (like `ABC123456 device`)

---

## 📥 Step 3: Download the Project

1. **Open Command Prompt** (search "cmd" in Windows)

2. **Navigate to where you want the project:**
   ```cmd
   cd Desktop
   ```

3. **Clone the repository:**
   ```cmd
   git clone <your-repo-url>
   ```
   *(Replace `<your-repo-url>` with the actual GitHub URL)*

4. **Go into the project folder:**
   ```cmd
   cd smart-sheet-mask
   ```

---

## 📦 Step 4: Install Project Dependencies

Still in Command Prompt, inside the `smart-sheet-mask` folder:

1. **Install all required packages:**
   ```cmd
   npm install
   ```
   
   This will take **5-10 minutes**. You'll see lots of text scrolling - that's normal!

2. **Build Android native code:**
   ```cmd
   npx expo prebuild --platform android --clean
   ```
   
   This creates the Android app files. Takes about 2-3 minutes.

---

## 🚀 Step 5: Run the App

You have **two options** to run the app:

### Option A: Using Expo Go (Quick & Easy - But has limitations)

**Note:** Due to native module issues (worklets), some animations won't work in Expo Go.

1. **Install Expo Go on your phone:**
   - Open Play Store
   - Search "Expo Go"
   - Install it

2. **Start the development server:**
   ```cmd
   npm start
   ```

3. **Connect to the app:**
   - A QR code will appear in Command Prompt
   - Open Expo Go app on your phone
   - Tap "Scan QR code"
   - Scan the QR code from your computer screen
   - App will load on your phone!

### Option B: Build and Install on Phone (Full Features)

**This is recommended for full functionality!**

1. **Make sure your phone is connected via USB**

2. **Build and run:**
   ```cmd
   npx expo run:android
   ```

3. **Wait for build:**
   - First build takes **10-20 minutes**
   - You'll see lots of text - that's normal
   - App will automatically install and open on your phone

4. **For subsequent runs:**
   - In one Command Prompt window: `npm start`
   - Keep your phone connected
   - The app will hot-reload as you make changes

---

## 🎯 Step 6: Using the App

Once the app opens on your phone:

1. **Main Screen (Sleep Tab):**
   - Shows connection status at top
   - Tap "Tap to Connect" to connect to your ESP32 mask
   - Use Quick Start presets for common sleep modes

2. **Controls Tab:**
   - Adjust intensity with slider
   - Select pattern (Pulse, Wave, Constant)
   - Set timer duration
   - Press Start/Stop

3. **Settings Tab:**
   - Configure alarm
   - Adjust preferences

---

## 🔧 Troubleshooting

### "npm is not recognized"
- You need to install Node.js (see Step 1.1)
- Restart Command Prompt after installing

### "adb is not recognized"
- Android SDK not properly installed
- Check environment variables (see Step 1.3)
- Restart your computer

### "No devices/emulators found"
- Make sure your phone is connected via USB
- Enable USB Debugging (see Step 2.2)
- Run `adb devices` to verify connection

### App shows "Worklets mismatch error"
- Use Option B (Build on phone) instead of Expo Go
- Run: `npx expo run:android`

### Build fails with Gradle error
- Make sure you have Android Studio installed
- Check that `ANDROID_HOME` environment variable is set correctly
- Try running: `cd android && ./gradlew clean` then rebuild

### Metro bundler is very slow
- First build is always slow (5-10 minutes)
- Subsequent reloads are much faster (5-10 seconds)
- Make sure you're not running other heavy programs

### "Cannot connect to mask"
- Make sure your ESP32 mask is powered on
- Check Bluetooth is enabled on your phone
- The mask should appear as "SMART_MassageMask"

---

## 📝 Making Changes to Code

If you want to modify the app:

1. **Edit files** using any text editor (VS Code recommended)
2. **Save your changes**
3. **The app will automatically reload** on your phone (hot reload)
4. If it doesn't reload, press `r` in the Command Prompt where Metro is running

---

## 🔄 Updating the App

If you pull new changes from the repository:

1. **Stop the running app** (Ctrl+C in Command Prompt)
2. **Pull latest changes:**
   ```cmd
   git pull
   ```
3. **Reinstall dependencies:**
   ```cmd
   npm install
   ```
4. **Rebuild if needed:**
   ```cmd
   npx expo prebuild --platform android --clean
   ```
5. **Run again:**
   ```cmd
   npx expo run:android
   ```

---

## 📞 Getting Help

If you're stuck:

1. **Read the error message** - it often tells you what's wrong
2. **Google the error** - someone has probably solved it before
3. **Check you followed all steps** - especially environment variables
4. **Restart everything** - computer, phone, close all apps
5. **Ask for help** - include the error message and what step you're on

---

## ✅ Quick Reference Commands

Once everything is set up, here are the commands you'll use most:

```cmd
# Start development server (Expo Go)
npm start

# Build and run on connected phone
npx expo run:android

# Stop server
Press Ctrl+C

# Reload app
Press 'r' in terminal

# Clear cache and restart
npm start --clear
```

---

## 🎉 Success!

If you see the app running on your phone, congratulations! 🎊

You can now:
- ✅ Connect to your ESP32 massage mask
- ✅ Control sleep patterns
- ✅ Adjust intensity and timers
- ✅ Modify the code and see changes instantly

Happy coding! 😴💤
