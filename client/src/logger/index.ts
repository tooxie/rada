export default class Logger {
  filename: string;
  enabled: boolean;

  constructor(filename: string) {
    this.filename = filename;
    this.enabled = location.hash.toLowerCase() === "#enablelogging";

    /* develblock:start */
    this.enabled = true;
    /* develblock:end */
  }

  protected getPrefix(level: string) {
    return `[${level.toUpperCase()}] [${this.filename}]`;
  }

  public debug(...args: any[]) {
    if (!this.enabled) return;

    console.log(this.getPrefix("DEBUG"), ...args);
  }

  public info(...args: any[]) {
    if (!this.enabled) return;

    console.log(this.getPrefix("INFO"), ...args);
  }

  public warn(...args: any[]) {
    if (!this.enabled) return;

    console.warn(this.getPrefix("WARN"), ...args);
  }

  public error(...args: any[]) {
    console.error(this.getPrefix("ERROR"), ...args);
  }
}
