import SerialPort from "serialport";
import { connectTo } from "./serial/connect";

const DEVICE_PATH_DISPLAY = "/dev/display";
const DEVICE_PATH_CO2_SENSOR = "/dev/co2";
const DEVICE_PATH_TEMP_SENSOR = "/dev/temp";

const sleep = (timeout: number) =>
  new Promise((resolve) => setTimeout(resolve, timeout));

const formatForDisplay = (num: number, length: number, cutoff = 0) =>
  `${num}`.slice(0, -cutoff).padStart(length, "0");

/** チカチカ～ */
const showMode = async (mode: number, port: SerialPort) => {
  for (let index = 0; index < 2; index++) {
    port.write(mode + "\n");
    await sleep(300);
    port.write("\n");
    await sleep(200);
  }
};

const main = async () => {
  const [displayPort, co2SensorPort, tempSensorPort] = await Promise.all([
    connectTo(DEVICE_PATH_DISPLAY),
    connectTo(DEVICE_PATH_CO2_SENSOR),
    connectTo(DEVICE_PATH_TEMP_SENSOR),
  ]);

  let mode: 0 | 1 | 2 = 0;

  let co2: number = 0;
  let temp: number = 0;
  let humidity: number = 0;

  co2SensorPort.on("data", (data: string) => {
    const [ppm, status] = data
      .toString()
      .split(";")
      .slice(0, 2)
      .map((pair) => pair.split("=")[1]);

    console.info({ ppm, status });
    co2 = +ppm;
  });

  tempSensorPort.on("data", (data: string) => {
    const [degrees, percent] = data
      .toString()
      .split(";")
      .slice(0, 2)
      .map((pair) => pair.split("=")[1]);

    console.info({ degrees, percent });
    temp = +degrees;
    humidity = +percent;
  });

  // よくわかんねーけど！
  while (true) {
    await showMode(mode, displayPort);

    switch (mode++) {
      case 0:
        displayPort.write(co2 + "\n");
        break;

      case 1:
        displayPort.write(formatForDisplay(temp, 3, 1) + "\n");
        break;

      case 2:
        displayPort.write(formatForDisplay(humidity, 3, 1) + "\n");
        mode = 0;
        break;
    }

    await sleep(2000);
  }
};

main()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
