import jsQR from "jsqr";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { errorToast, successToast } from "../../../../utils/toast";

const QrCodeScanner = () => {
  const [result, setResult] = useState("No QR code detected.");
  const [uploadedImage, setUploadedImage] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageSrc = e.target.result;
        decodeQRCodeFromImage(imageSrc);
        setUploadedImage(imageSrc);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageSrc = e.target.result;
        decodeQRCodeFromImage(imageSrc);
        setUploadedImage(imageSrc);
      };
      reader.readAsDataURL(file);
    }
  };

  const decodeQRCodeFromImage = (imageSrc) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);

      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        setResult(code?.data);
        successToast("Qr Scan Success.");
      } else {
        errorToast("No QR code detected");
        setResult("No QR code detected");
      }
    };
    img.src = imageSrc;
  };

  return (
    <div
      className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-100"
      onDrop={handleImageDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <h1 className="text-4xl font-bold mb-6">QR Code Scanner</h1>

      <label className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer">
        Upload Image
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </label>

      {uploadedImage && (
        <div className="mt-6">
          <img
            src={uploadedImage}
            alt="Uploaded"
            className="max-w-sm mx-auto"
          />
        </div>
      )}

      <div>
        {result !== "No QR code detected." ? (
          <div className="mt-6 w-56 mb-2">
            <h2 className="text-xl font-semibold">Result:</h2>
            {result === "No QR code detected" ? (
              <>
                <p className=" mt-1 text-red-600">{result}</p>
              </>
            ) : (
              <></>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default QrCodeScanner;
