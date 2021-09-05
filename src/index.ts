import { connectTo } from './serial/connect';

const DEVICE_PATH_SENSOR = '/dev/serial/by-path/platform-fd500000.pcie-pci-0000:01:00.0-usb-0:1.3:1.0';
const DEVICE_PATH_DISPLAY = '/dev/serial/by-path/platform-fd500000.pcie-pci-0000:01:00.0-usb-0:1.4:1.0';

const sleep = (timeout: number) => new Promise((resolve) => setTimeout(resolve, timeout));

const main = async () => {
  const [displayPort, sensorPort] = await Promise.all([connectTo(DEVICE_PATH_DISPLAY), connectTo(DEVICE_PATH_SENSOR)]);

  sensorPort.on('data', (data: string) => {
    const [ppm, status] = data
      .toString()
      .split(';')
      .slice(0, 2)
      .map((pair) => pair.split('=')[1]);

    console.info({ ppm, status });

    displayPort.write(ppm + '\n');
  });

  // よくわかんねーけど！
  while (true) {
    await sleep(5000);
  }
};

main()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
