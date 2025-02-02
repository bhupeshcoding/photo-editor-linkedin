// import { useRef, useState } from "react";
// import Cropper from "cropperjs";
// import "cropperjs/dist/cropper.css";
// import axios from "axios";
// import blackCoat from "./assets/black-coat.webp"; // Coat image

// const ImageEditor = () => {
//   const [image, setImage] = useState(null);
//   const [processedImage, setProcessedImage] = useState(null);
//   const [dragPos, setDragPos] = useState({ x: 50, y: 50, scale: 1 });
//   const imgRef = useRef(null);
//   const cropperRef = useRef(null);

//   // Image Upload & Cropping
//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = () => {
//         setImage(reader.result);
//         setTimeout(() => {
//           cropperRef.current = new Cropper(imgRef.current, {
//             aspectRatio: 1,
//             viewMode: 2,
//             background: false,
//             autoCropArea: 1,
//           });
//         }, 100);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // Handle Dragging
//   const handleDrag = (e) => {
//     setDragPos((prev) => ({
//       ...prev,
//       x: prev.x + e.movementX,
//       y: prev.y + e.movementY,
//     }));
//   };

//   // Handle Zoom
//   const handleZoom = (factor) => {
//     setDragPos((prev) => ({
//       ...prev,
//       scale: Math.max(0.5, Math.min(2, prev.scale + factor)),
//     }));
//   };

//   // Apply Coat Overlay
//   const applyCoatOverlay = () => {
//     if (!cropperRef.current) return;

//     const canvas = document.createElement("canvas");
//     const ctx = canvas.getContext("2d");

//     const croppedCanvas = cropperRef.current.getCroppedCanvas();
//     canvas.width = croppedCanvas.width;
//     canvas.height = croppedCanvas.height;

//     // Load Coat
//     const coatImg = new Image();
//     coatImg.src = blackCoat;
//     coatImg.onload = () => {
//       const coatHeight = 150; // Set the desired coat height
//       const availableHeight = canvas.height - coatHeight; // Space available for the face

//       // Calculate Face Position and Size
//       const faceWidth = croppedCanvas.width * dragPos.scale;
//       const faceHeight = croppedCanvas.height * dragPos.scale;

//       const scaleFactor = availableHeight / faceHeight;
//       const adjustedFaceWidth = faceWidth * scaleFactor;
//       const adjustedFaceHeight = faceHeight * scaleFactor;

//       // Position Face at the top (centered horizontally)
//       const faceX = (canvas.width - adjustedFaceWidth) / 2; // Center the face horizontally
//       const faceY = 0; // Place face at the top of the canvas (above the coat)

//       // Draw Cropped Face at the top of the canvas
//       ctx.drawImage(
//         croppedCanvas,
//         dragPos.x,
//         dragPos.y,
//         croppedCanvas.width * dragPos.scale,
//         croppedCanvas.height * dragPos.scale,
//         faceX, // X position of the face
//         faceY, // Y position of the face (top of the canvas)
//         adjustedFaceWidth, // Width of the face
//         adjustedFaceHeight // Height of the face
//       );

//       // Draw Coat Image below the face
//       ctx.drawImage(
//         coatImg,
//         0,
//         canvas.height - coatHeight, // Coat positioned below the face
//         canvas.width,
//         coatHeight
//       );

//       // Finalize and set processed image
//       setProcessedImage(canvas.toDataURL());
//     };
//   };

//   const handleUpload = async () => {
//     if (!processedImage) return;
//     const blob = await fetch(processedImage).then((res) => res.blob());
//     const formData = new FormData();
//     formData.append("image", blob, "profile.png");

//     const response = await axios.post(
//       "http://localhost:5000/upload",
//       formData,
//       {
//         headers: { "Content-Type": "multipart/form-data" },
//       }
//     );

//     alert(`Image uploaded: ${response.data.imageUrl}`);
//   };

//   return (
//     <div>
//       <input type="file" accept="image/*" onChange={handleImageUpload} />
//       {image && <img ref={imgRef} src={image} alt="Profile" />}
//       <button onClick={applyCoatOverlay}>Apply Black Coat</button>
//       {processedImage && <img src={processedImage} alt="Processed" />}
//       <button onClick={handleUpload}>Upload Image</button>
//     </div>
//   );
// };

// export default ImageEditor;

// import { useRef, useState, useEffect } from "react";
// import Cropper from "cropperjs";
// import "cropperjs/dist/cropper.css";
// import axios from "axios";
// import blackCoat from "./assets/black-coat.webp"; // Coat image
// import * as faceapi from "face-api.js";

// const ImageEditor = () => {
//   const [image, setImage] = useState(null);
//   const [processedImage, setProcessedImage] = useState(null);
//   const [dragPos, setDragPos] = useState({ x: 50, y: 50, scale: 1 });
//   const imgRef = useRef(null);
//   const cropperRef = useRef(null);

//   // Load face-api models on component mount
//   useEffect(() => {
//     const loadModels = async () => {
//       await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
//       await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
//       await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
//     };
//     loadModels();
//   }, []);

//   // Image Upload & Cropping
//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = () => {
//         setImage(reader.result);
//         setTimeout(() => {
//           cropperRef.current = new Cropper(imgRef.current, {
//             aspectRatio: 1,
//             viewMode: 2,
//             background: false,
//             autoCropArea: 1,
//           });
//           detectFace(reader.result); // Detect face after loading the image
//         }, 100);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // Detect Faces and Adjust Overlay
//   const detectFace = async (imageSrc) => {
//     const img = await faceapi.bufferToImage(imageSrc);
//     const detections = await faceapi
//       .detectSingleFace(img)
//       .withFaceLandmarks()
//       .withFaceDescriptor();

//     if (detections) {
//       const { align, width, height, topLeft } = detections.detection.box;
//       const centerX = (align._x + align._width) / 2; // Calculate center of the detected face
//       const centerY = (align._y + align._height) / 2;

//       // Apply the coat overlay
//       applyCoatOverlay(centerX, centerY, width, height);
//     }
//   };

//   // Apply Coat Overlay Based on Face Detection
//   const applyCoatOverlay = (faceX, faceY, faceWidth, faceHeight) => {
//     if (!cropperRef.current) return;

//     const canvas = document.createElement("canvas");
//     const ctx = canvas.getContext("2d");

//     const croppedCanvas = cropperRef.current.getCroppedCanvas();
//     canvas.width = 300;
//     canvas.height = 400; // Standard LinkedIn photo size

//     // Load Coat
//     const coatImg = new Image();
//     coatImg.src = blackCoat;
//     coatImg.onload = () => {
//       const coatHeight = 200; // Desired coat height
//       const availableHeight = canvas.height - coatHeight;

//       // Adjust face position based on face detection
//       const scaleFactor = availableHeight / faceHeight;
//       const adjustedFaceWidth = faceWidth * scaleFactor;
//       const adjustedFaceHeight = faceHeight * scaleFactor;

//       // Center the face horizontally
//       const faceXPosition = (canvas.width - adjustedFaceWidth) / 2;
//       const faceYPosition = 0; // Place the face at the top of the canvas

//       // Draw Cropped Face at the correct position
//       ctx.drawImage(
//         croppedCanvas,
//         faceX,
//         faceY,
//         faceWidth,
//         faceHeight,
//         faceXPosition,
//         faceYPosition,
//         adjustedFaceWidth,
//         adjustedFaceHeight
//       );

//       // Draw Coat Image (below the face)
//       ctx.drawImage(
//         coatImg,
//         0,
//         canvas.height - coatHeight,
//         canvas.width,
//         coatHeight
//       );

//       setProcessedImage(canvas.toDataURL());
//     };
//   };

//   const handleUpload = async () => {
//     if (!processedImage) return;
//     const blob = await fetch(processedImage).then((res) => res.blob());
//     const formData = new FormData();
//     formData.append("image", blob, "profile.png");

//     const response = await axios.post(
//       "http://localhost:5000/upload",
//       formData,
//       {
//         headers: { "Content-Type": "multipart/form-data" },
//       }
//     );

//     alert(`Image uploaded: ${response.data.imageUrl}`);
//   };

//   return (
//     <div>
//       <input type="file" accept="image/*" onChange={handleImageUpload} />
//       {image && <img ref={imgRef} src={image} alt="Profile" />}
//       {processedImage && <img src={processedImage} alt="Processed" />}
//       <button onClick={handleUpload}>Upload Image</button>
//     </div>
//   );
// };

// export default ImageEditor;
