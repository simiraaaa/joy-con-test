const { listConnectedJoyCons } = require("switch-joy-con");

// First, list all the Joy-Cons connected to the computer.
const devices = listConnectedJoyCons();
console.log(devices);
// [
//   {
//     vendorId: 1406,
//     productId: 8198,
//     path: 'IOService:/IOResources/IOBluetoothHCIController/AppleBroadcomBluetoothHostController/IOBluetoothDevice/IOBluetoothL2CAPChannel/IOBluetoothHIDDriver',
//     serialNumber: '94-58-cb-a6-1b-86',
//     manufacturer: 'Unknown',
//     product: 'Joy-Con (L)',
//     release: 1,
//     interface: -1,
//     usagePage: 1,
//     usage: 5,
//     open: [Function: open]
//   },
//   {
//     vendorId: 1406,
//     productId: 8199,
//     path: 'IOService:/IOResources/IOBluetoothHCIController/AppleBroadcomBluetoothHostController/IOBluetoothDevice/IOBluetoothL2CAPChannel/IOBluetoothHIDDriver',
//     serialNumber: '94-58-cb-a5-cb-9d',
//     manufacturer: 'Unknown',
//     product: 'Joy-Con (R)',
//     release: 1,
//     interface: -1,
//     usagePage: 1,
//     usage: 5,
//     open: [Function: open]
//   }
// ]

// Decide which to use, and then call `open` on it.
const left = devices.find((d) => d.productId === 8198).open();
// const right = devices.find((d) => d.productId === 8199).open();

// The `buttons` property always contains up-to-date buttons state:
console.log(left.side);
// {
//   dpadUp: false,
//   dpadDown: false,
//   dpadLeft: false,
//   dpadRight: false,
//   minus: false,
//   screenshot: false,
//   sl: false,
//   sr: false,
//   l: false,
//   zl: false,
//   analogStickPress: false,
//   analogStick: left.Directions.NEUTRAL
// }

// A "change" event will be emitted whenever the button state changes
left.on("change", () => {
  console.log(left.buttons);
});

// Whenever a button is pressed or released, a `down:${buttonName}` or `up:${buttonName}` event is emitted.
left.on("down:minus", () => {
  console.log("minus pressed down");
});
left.on("up:minus", () => {
  console.log("minus depressed");
});

// a `change:${buttonName}` event is also emitted:
left.on("change:minus", pressed => {
  console.log(`minus is now: ${pressed ? "pressed" : "unpressed"}`);
});

// The `analogStick` "button" is a number. Use the `Directions` property on the
// instance to understand its value:
left.on("change:analogStick", value => {
  switch (value) {
    case left.Directions.UP: {
      console.log("up");
      break;
    }
    case left.Directions.UP_RIGHT: {
      console.log("up-right");
      break;
    }
    case left.Directions.RIGHT: {
      console.log("right");
      break;
    }
    case left.Directions.DOWN_RIGHT: {
      console.log("down-right");
      break;
    }
    case left.Directions.DOWN: {
      console.log("down");
      break;
    }
    case left.Directions.DOWN_LEFT: {
      console.log("down-left");
      break;
    }
    case left.Directions.LEFT: {
      console.log("left");
      break;
    }
    case left.Directions.UP_LEFT: {
      console.log("up-left");
      break;
    }
    case left.Directions.UP_RIGHT: {
      console.log("up-right");
      break;
    }
    case left.Directions.NEUTRAL: {
      console.log("neutral");
      break;
    }
  }
});

// When you're done with the device, call `close` on it:
// left.close();
