import os from "os";
import qrcode from "qrcode-terminal";

export default class serverQRcode {
  constructor(options) {
    this.options = options;
    this.qrcode = qrcode;
  }

  getIPAdress() {
    const interfaces = os.networkInterfaces();
    let ips = [];
    for (let devName in interfaces) {
      let iface = interfaces[devName];
      for (let i = 0; i < iface.length; i++) {
        let alias = iface[i];
        if (alias.family === "IPv4" && alias.address !== "127.0.0.1" && !alias.internal) {
          ips.push(alias.address);
        }
      }
    }
    return ips;
  }

  printQRcode(url) {
    this.qrcode.setErrorLevel("M");
    this.qrcode.generate(
      url,
      {
        small: true,
      },
      (qrcode) => {
        console.log(qrcode);
      }
    );
  }

  apply(compiler) {
    import("preact-cli/lib/lib/webpack/hooks")
      .then((hooks) => {
        hooks.devServerRunning.tap("QrCodePlugin", () => {
          const devServer = compiler.options.devServer;
          if (!devServer) {
            console.warn("webpack-server-qrcode: needs to start webpack-dev-server");
            return;
          }

          const protocol = devServer.https ? "https" : "http";
          const port = devServer.port;
          const ip = this.getIPAdress()[0];
          const url = `${protocol}://${ip}:${port}`;
          this.printQRcode(url);
        });
      })
      .catch((error) => console.log(error));
  }
}
