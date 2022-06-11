# Duty-Buddy
AAAAAAHHHHHH Hackathon

# Developer Setup

### Dependencies

First do
`yarn install`
to install all the dependencies

### Running the app

Next, to run the app, run
`yarn start`
This will take you to the expo localhost. From there click on "Tunnel" and scan the QR code
with your expo app on your android phone (if not using an emulator)

**make sure you have hot-reload enabled**
In order to toggle these developer settings on your phone, **shake your phone to bring up the menu**

### Coding the app

While coding the app, you can check either your terminal or your expo localhost for logs or error messages callstacks.

Furthermore, you must enable this command before coding
`yarn dev:tailwind`
This will automatically compile tailwind css code into readable native code.

In order to auto-style your code, run
`yarn lint:fix`
or to see what files are breaking the style, run
`yarn lint` 
instead