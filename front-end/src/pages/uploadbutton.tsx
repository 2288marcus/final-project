import React, { useState, ChangeEvent } from "react";
import { IonButton, IonInput } from "@ionic/react";

const UploadPDFButton: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };

  const handleUpload = () => {
    if (selectedFile) {
      // 在這裡處理上傳PDF的邏輯
      console.log("上傳的PDF文件:", selectedFile);
    }
  };

  return (
    <div>
      <input type="file" name="file" id="file"></input>
      <IonButton onClick={handleUpload}>上傳PDF</IonButton>
    </div>
  );
};

export default UploadPDFButton;
