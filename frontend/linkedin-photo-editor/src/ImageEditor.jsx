// import { useRef, useState } from "react";
// import Cropper from "cropperjs";
// import "cropperjs/dist/cropper.css";
// import axios from "axios";
// import blackCoat from "./assets/black-coat.webp"; // Coat image

// const ImageEditor = () => {
//   const [image, setImage] = useState(null);
//   const [processedImage, setProcessedImage] = useState(null);
//   const imgRef = useRef(null);
//   const cropperRef = useRef(null);

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
//           });
//         }, 100);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const applyCoatOverlay = () => {
//     if (!cropperRef.current) return;

//     const canvas = cropperRef.current.getCroppedCanvas();
//     const ctx = canvas.getContext("2d");

//     const coatImg = new Image();
//     coatImg.src = blackCoat;
//     coatImg.onload = () => {
//       ctx.drawImage(coatImg, 0, canvas.height - 100, canvas.width, 100); // Adjust coat position
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

import { useRef, useState } from "react";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import axios from "axios";
import blackCoat from "./assets/black-coat.webp"; // Coat image
// import * as faceapi from "face-api.js";

const ImageEditor = () => {
  const [image, setImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [dragPos, setDragPos] = useState({ x: 50, y: 50, scale: 1 });
  const imgRef = useRef(null);
  const cropperRef = useRef(null);

  // Image Upload & Cropping
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        setTimeout(() => {
          cropperRef.current = new Cropper(imgRef.current, {
            aspectRatio: 1,
            viewMode: 2,
            background: false,
            autoCropArea: 1,
          });
        }, 100);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Dragging
  const handleDrag = (e) => {
    setDragPos((prev) => ({
      ...prev,
      x: prev.x + e.movementX,
      y: prev.y + e.movementY,
    }));
  };

  // Handle Zoom
  const handleZoom = (factor) => {
    setDragPos((prev) => ({
      ...prev,
      scale: Math.max(0.5, Math.min(2, prev.scale + factor)),
    }));
  };

  // // Apply Coat Overlay
  // const applyCoatOverlay = () => {
  //   if (!cropperRef.current) return;
  //   const canvas = document.createElement("canvas");
  //   const ctx = canvas.getContext("2d");

  //   const croppedCanvas = cropperRef.current.getCroppedCanvas();
  //   canvas.width = 300;
  //   canvas.height = 400; // Standard LinkedIn photo size

  //   // Load Coat
  //   const coatImg = new Image();
  //   coatImg.src = blackCoat;
  //   coatImg.onload = () => {
  //     ctx.drawImage(coatImg, 0, coatY, canvas.width, canvas.height);

  //     // Draw Cropped Face (adjust based on drag position)
  //     ctx.drawImage(
  //       croppedCanvas,
  //       dragPos.x,
  //       dragPos.y,
  //       croppedCanvas.width * dragPos.scale,
  //       croppedCanvas.height * dragPos.scale
  //     );

  //     setProcessedImage(canvas.toDataURL());
  //   };
  // };
  // const applyCoatOverlay = () => {
  //   if (!cropperRef.current) return;

  //   const canvas = document.createElement("canvas");
  //   const ctx = canvas.getContext("2d");

  //   const croppedCanvas = cropperRef.current.getCroppedCanvas();
  //   canvas.width = 300;
  //   canvas.height = 400; // Standard LinkedIn photo size

  //   // Load Coat
  //   const coatImg = new Image();
  //   coatImg.src = blackCoat;
  //   coatImg.onload = () => {
  //     // Draw Coat Image first (at the bottom of the canvas)
  //     const coatHeight = 200; // Set the desired coat height
  //     ctx.drawImage(
  //       coatImg,
  //       0,
  //       canvas.height - coatHeight,
  //       canvas.width,
  //       coatHeight
  //     );

  //     // Calculate Face Position (Position face at the top of the coat)
  //     const faceWidth = croppedCanvas.width * dragPos.scale;
  //     const faceHeight = croppedCanvas.height * dragPos.scale;
  //     const faceX = (canvas.width - faceWidth) / 2; // Center the face horizontally
  //     const faceY = canvas.height - coatHeight - faceHeight - 10; // Position it just above the coat

  //     // Draw Cropped Face at the correct position
  //     ctx.drawImage(
  //       croppedCanvas,
  //       dragPos.x,
  //       dragPos.y,
  //       croppedCanvas.width * dragPos.scale,
  //       croppedCanvas.height * dragPos.scale,
  //       faceX, // X position of the face
  //       faceY, // Y position of the face
  //       faceWidth, // Width of the face
  //       faceHeight // Height of the face
  //     );

  //     setProcessedImage(canvas.toDataURL());
  //   };
  // };

  // const applyCoatOverlay = () => {
  //   if (!cropperRef.current) return;

  //   const canvas = document.createElement("canvas");
  //   const ctx = canvas.getContext("2d");

  //   const croppedCanvas = cropperRef.current.getCroppedCanvas();
  //   canvas.width = 300;
  //   canvas.height = 400; // Standard LinkedIn photo size

  //   // Load Coat
  //   const coatImg = new Image();
  //   coatImg.src = blackCoat;
  //   coatImg.onload = () => {
  //     // Calculate Face Position (Position face at the top of the canvas)
  //     const faceWidth = croppedCanvas.width * dragPos.scale;
  //     const faceHeight = croppedCanvas.height * dragPos.scale;
  //     const faceX = (canvas.width - faceWidth) / 2; // Center the face horizontally
  //     const faceY = 0; // Position face at the top of the canvas (above the coat)

  //     // Draw Cropped Face at the top
  //     ctx.drawImage(
  //       croppedCanvas,
  //       dragPos.x,
  //       dragPos.y,
  //       croppedCanvas.width * dragPos.scale,
  //       croppedCanvas.height * dragPos.scale,
  //       faceX, // X position of the face
  //       faceY, // Y position of the face (top of the canvas)
  //       faceWidth, // Width of the face
  //       faceHeight // Height of the face
  //     );

  //     // Draw Coat Image (below the face)
  //     const coatHeight = 200; // Set the desired coat height
  //     ctx.drawImage(
  //       coatImg,
  //       0,
  //       canvas.height - coatHeight, // Coat positioned below the face
  //       canvas.width,
  //       coatHeight
  //     );

  //     // Finalize and set processed image
  //     setProcessedImage(canvas.toDataURL());
  //   };
  // };

  const applyCoatOverlay = () => {
    if (!cropperRef.current) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const croppedCanvas = cropperRef.current.getCroppedCanvas();
    canvas.width = 300;
    canvas.height = 400; // Standard LinkedIn photo size

    // Load Coat
    const coatImg = new Image();
    coatImg.src = blackCoat;
    coatImg.onload = () => {
      // Coat Height
      const coatHeight = 200; // Set the desired coat height
      const availableHeight = canvas.height - coatHeight; // Space available for the face

      // Calculate Face Position and Size
      const faceWidth = croppedCanvas.width * dragPos.scale;
      const faceHeight = croppedCanvas.height * dragPos.scale;

      // If face is too big, scale it down to fit the available space
      const scaleFactor = availableHeight / faceHeight;
      const adjustedFaceWidth = faceWidth * scaleFactor;
      const adjustedFaceHeight = faceHeight * scaleFactor;

      // Position Face at the top (centered horizontally)
      const faceX = (canvas.width - adjustedFaceWidth) / 2; // Center the face horizontally
      const faceY = 0; // Place face at the top of the canvas (above the coat)

      // Draw Cropped Face at the top of the canvas
      ctx.drawImage(
        croppedCanvas,
        dragPos.x,
        dragPos.y,
        croppedCanvas.width * dragPos.scale,
        croppedCanvas.height * dragPos.scale,
        faceX, // X position of the face
        faceY, // Y position of the face (top of the canvas)
        adjustedFaceWidth, // Width of the face
        adjustedFaceHeight // Height of the face
      );

      // Draw Coat Image below the face
      ctx.drawImage(
        coatImg,
        0,
        canvas.height - coatHeight, // Coat positioned below the face
        canvas.width,
        coatHeight
      );

      // Finalize and set processed image
      setProcessedImage(canvas.toDataURL());
    };
  };

  // const applyCoatOverlay = () => {
  //   if (!cropperRef.current) return;

  //   const canvas = document.createElement("canvas");
  //   const ctx = canvas.getContext("2d");

  //   const croppedCanvas = cropperRef.current.getCroppedCanvas();
  //   canvas.width = 300;
  //   canvas.height = 400; // Standard LinkedIn photo size

  //   // Load Coat
  //   const coatImg = new Image();
  //   coatImg.src = blackCoat;
  //   coatImg.onload = () => {
  //     const coatHeight = 200; // Set the desired coat height

  //     // Draw Coat Image at the bottom of the canvas
  //     ctx.drawImage(
  //       coatImg,
  //       0,
  //       canvas.height - coatHeight, // Position coat at the bottom of the canvas
  //       canvas.width,
  //       coatHeight
  //     );

  //     // Calculate the face's position at the top of the canvas (just above the coat)
  //     const faceWidth = croppedCanvas.width * dragPos.scale;
  //     const faceHeight = croppedCanvas.height * dragPos.scale;

  //     const faceX = (canvas.width - faceWidth) / 2; // Center the face horizontally
  //     const faceY = 20; // Place the face at the top of the canvas

  //     // Draw the cropped face at the top of the canvas
  //     ctx.drawImage(
  //       croppedCanvas,
  //       dragPos.x,
  //       dragPos.y,
  //       croppedCanvas.width * dragPos.scale,
  //       croppedCanvas.height * dragPos.scale,
  //       faceX, // X position of the face (centered horizontally)
  //       faceY, // Y position of the face (at the top)
  //       faceWidth, // Width of the face
  //       faceHeight // Height of the face
  //     );

  //     // Set the final processed image
  //     setProcessedImage(canvas.toDataURL());
  //   };
  // };

  // const applyCoatOverlay = async () => {
  //   if (!cropperRef.current) return;

  //   const canvas = document.createElement("canvas");
  //   const ctx = canvas.getContext("2d");

  //   const croppedCanvas = cropperRef.current.getCroppedCanvas();
  //   canvas.width = 300;
  //   canvas.height = 400; // Standard LinkedIn photo size

  //   // Load Coat
  //   const coatImg = new Image();
  //   coatImg.src = blackCoat;

  //   // Ensure the face-api.js models are loaded
  //   await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
  //   const detections = await faceapi.detectAllFaces(croppedCanvas);

  //   if (detections.length > 0) {
  //     const face = detections[0]; // Assuming the first detected face
  //     const { x, y, width, height } = face.alignedRect._box; // Get face bounding box

  //     // Draw Coat at the bottom of the canvas
  //     const coatHeight = 200;
  //     ctx.drawImage(
  //       coatImg,
  //       0,
  //       canvas.height - coatHeight, // Position coat at the bottom of the canvas
  //       canvas.width,
  //       coatHeight
  //     );

  //     // Calculate face position and adjust its size
  //     const faceWidth = width;
  //     const faceHeight = height;
  //     const faceX = (canvas.width - faceWidth) / 2; // Center the face horizontally
  //     const faceY = 0; // Place the face at the top of the canvas

  //     // Draw the cropped face at the top of the canvas
  //     ctx.drawImage(
  //       croppedCanvas,
  //       x,
  //       y,
  //       width,
  //       height,
  //       faceX, // X position of the face (centered horizontally)
  //       faceY, // Y position of the face (at the top)
  //       faceWidth, // Width of the face
  //       faceHeight // Height of the face
  //     );

  //     // Set the final processed image
  //     setProcessedImage(canvas.toDataURL());
  //   } else {
  //     alert("No face detected");
  //   }
  // };

  // Upload Final Image
  const handleUpload = async () => {
    if (!processedImage) return;
    const blob = await fetch(processedImage).then((res) => res.blob());
    const formData = new FormData();
    formData.append("image", blob, "profile.png");

    const response = await axios.post(
      "http://localhost:5000/upload",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    alert(`Image uploaded: ${response.data.imageUrl}`);
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <div style={{ position: "relative", width: 300, height: 400 }}>
        {image && (
          <img
            ref={imgRef}
            src={image}
            alt="Profile"
            style={{
              position: "absolute",
              top: dragPos.y,
              left: dragPos.x,
              width: 100 * dragPos.scale,
              height: 100 * dragPos.scale,
              cursor: "move",
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              document.onmousemove = handleDrag;
              document.onmouseup = () => (document.onmousemove = null);
            }}
          />
        )}
        <img src={blackCoat} alt="Coat" style={{ width: "100%" }} />
      </div>
      <button onClick={() => handleZoom(0.1)}>Zoom In</button>
      <button onClick={() => handleZoom(-0.1)}>Zoom Out</button>
      <button onClick={applyCoatOverlay}>Merge & Apply Coat</button>
      {processedImage && <img src={processedImage} alt="Processed" />}
      <button onClick={handleUpload}>Upload Image</button>
    </div>
  );
};

export default ImageEditor;
