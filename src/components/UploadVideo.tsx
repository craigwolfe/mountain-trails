// src/components/UploadVideo.tsx

import React, { useState } from "react";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import './styles.css'; // Import the CSS file

interface UploadVideoProps {
  storage: any;
  user: any;
}

const UploadVideo: React.FC<UploadVideoProps> = ({ storage, user }) => {
  const [file, setFile] = useState<any>(null);
  const [progress, setProgress] = useState<number>(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !user) return;

    const storageRef = ref(storage, `videos/${user.uid}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on("state_changed", (snapshot) => {
      const progressPercent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setProgress(progressPercent);
    });

    uploadTask.on("state_changed", null, null, async () => {
      const url = await getDownloadURL(uploadTask.snapshot.ref);
      alert(`File uploaded successfully! You can access it here: ${url}`);
    });
  };

    return (
        <div className="master-container">
      <h1>Upload a Video</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Video</button>
      {progress > 0 && <progress value={progress} max={100}></progress>}
    </div>
  );
};

export default UploadVideo;
