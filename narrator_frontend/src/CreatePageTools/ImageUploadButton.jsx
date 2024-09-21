import React, { useState } from 'react';
import Cropper from 'react-cropper';
import ReactDOM from 'react-dom';


const ImageUploadButton = ({ onImageProcessed, setPopup, setIsEditing }) => {
  const [src, setSrc] = useState(null);
  const cropperRef = React.createRef();

  const extractBase64Data = (encodedString) => {
    const parts = encodedString.split(',');
    if (parts.length > 1) {
      return parts[1];
    }
    return encodedString;
  };

  const handleChange = (event) => {
    const file = event.target.files[0];
    if (file.type === 'image/gif' || file.type === 'image/webp') {
      // Use the file directly for .gif and .webp to maintain animations without cropping
      const objectURL = URL.createObjectURL(file);
      onImageProcessed(objectURL); // Assuming onImageProcessed can handle Object URLs
      setPopup(false);
      setIsEditing(false);
  } else {
      const objectURL = URL.createObjectURL(file);
      setSrc(objectURL); // Continue with cropping for other types
  }
  };

  const cropImage = () => {
    const imageElement = cropperRef.current;
    const cropper = imageElement.cropper;
    if (cropper) {
      const canvas = cropper.getCroppedCanvas({ width: 512, height: 512 });
      const base64String = extractBase64Data(canvas.toDataURL('image/png'));
      onImageProcessed(base64String);
      setSrc(null);
      setPopup(false);
      setIsEditing(false);
    }
  };

  return (
    <div>
      <input type='file' accept='image/*' onChange={handleChange} style={{ display: 'none' }} id='file-upload' />
      <label htmlFor='file-upload' className='image-upload-button' style={{ cursor: 'pointer', color:'white',fontSize:'16px',fontFamily:'arial' }}>
        Upload an image instead
      </label>
      {src && ReactDOM.createPortal(
       <div
  style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    zIndex: 9999,
  }}
>
  <div
    style={{
      backgroundColor: 'black',
      padding: '20px',
      borderRadius: '8px',
      border: '2px solid #b4ecee',
      color: '#000',
      boxShadow: '0 4px 8px 0 #007a7a, 0 6px 20px 0 #007a7a',
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 1000,
      padding: '20px',
      borderRadius: '10px',
    }}
  >
            <Cropper
              ref={cropperRef}
              src={src}
              className="CropperWindow"
              style={{ height: 400, width: '100%', backgroundColor: 'black' }}
              aspectRatio={1}
              guides={false}
              dragMode="crop"
            />
            <button className='LoginBlock-emailLoginButton' style={{ marginTop: '1em' }} onClick={cropImage}>
              Use as Image
            </button>
          </div>
        </div>,
      document.body
      )}
    </div>
  );
};

export default ImageUploadButton;
