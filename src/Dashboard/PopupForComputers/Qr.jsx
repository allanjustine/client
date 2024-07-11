import React, { useRef, useState, useEffect } from "react";
import smct from "./../../img/smct.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { QRCode } from "react-qr-svg";
import { toPng } from "html-to-image";
import CloseIcon from "@mui/icons-material/Close";

function QrCode({ isOpen, onClose, qrCodeData, setQrCodeData }) {
  const qrCodeRef = useRef(null);
  const [rows, setRows] = useState([]);
  const [id, setId] = useState([]);

  useEffect(() => {
    if (qrCodeData?.computers) {
      const qrData = qrCodeData.computers.flatMap((computer) =>
        computer.units.map((unit) => ({
          ...unit,
          computerName: computer.name,
        }))
      );
      setRows(qrData);

      const ids = qrCodeData.computers.map((comp) => comp.id);
      setId(ids);
    }
  }, [qrCodeData]);

  if (!isOpen) {
    return null; // Render nothing if isOpen is false
  }

  const downloadQRCode = () => {
    toPng(qrCodeRef.current)
      .then(function (dataUrl) {
        const link = document.createElement("a");
        link.download = `${id}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch(function (error) {
        console.error("Error generating QR Code image:", error);
      });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-40">
      <div
        className="bg-white shadow-md rounded-2xl"
        style={{ width: "700px", maxHeight: "100vh" }}
      >
        <div className="flex p-5 bg-blue-500 rounded-tr-2xl rounded-tl-2xl relative">
          <div className="flex-none">
            <img
              src={smct}
              alt="SMCT Logo"
              className="block h-24 m-0 w-60"
            ></img>
          </div>
          <div className="mt-8 ml-16 text-3xl font-medium text-white flex-2">
            Computer ID: {id.length === 1 ? id : "NaN"}
          </div>
          <CloseIcon onClick={onClose} className="text-white cursor-pointer absolute right-5 top-5" />
        </div>
        <div className="flex items-center justify-center">
          <div className="mt-7 mb-14 size-60">
            <div
              ref={qrCodeRef}
              onClick={downloadQRCode}
              style={{ cursor: "pointer" }}
            >
              <QRCode value={JSON.stringify(id[0])} />
            </div>
            <h1 className="mt-3 text-base font-semibold text-center">
              Computer QR Code
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QrCode;
