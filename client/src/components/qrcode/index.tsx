import { h } from "preact";
import QRCode from "react-qr-code";

interface QrProps {
  value: string;
}

const QrCode = ({ value }: QrProps) => <QRCode value={value} />;

export default QrCode;
