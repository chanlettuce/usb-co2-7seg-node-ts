import SerialPort from 'serialport';

export const connectTo = (devicePath: string) =>
  new Promise<SerialPort>((resolve, reject) => {
    const port = new SerialPort(devicePath, {
      baudRate: 9600,
      autoOpen: false,
    });

    console.info('ポートを開けるぞ！: ', devicePath);

    port.open((error) => {
      if (error) {
        console.info('ポートを開けられなかったぞ！: ', devicePath);
        reject(error);
      } else {
        console.info('ポートを開けたぞ！: ', devicePath);
        resolve(port);
      }
    });
  });
