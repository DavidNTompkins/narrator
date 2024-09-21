import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

const ImageUploadWrapper = ({ children, onImageProcessed }) => {
    const [src, setSrc] = useState(null);
    const cropperRef = useRef(null);

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file.type === 'image/gif' || file.type === 'image/webp') {
            // Use the file directly for .gif and .webp to maintain animations without cropping
            const objectURL = URL.createObjectURL(file);
            onImageProcessed(objectURL); // Assuming onImageProcessed can handle Object URLs
        } else {
            const objectURL = URL.createObjectURL(file);
            setSrc(objectURL); // Continue with cropping for other types
        }
    }, [onImageProcessed]);

    const cropImage = () => {
        const imageElement = cropperRef.current;
        const cropper = imageElement.cropper;
        if (cropper) {
            cropper.getCroppedCanvas({ width: 512, height: 512 }).toBlob((blob) => {
                const objectURL = URL.createObjectURL(blob);
                onImageProcessed(objectURL); // Use Object URL for cropped image
                setSrc(null); // Cleanup
            }, 'image/png');
        }
    };

    useEffect(() => {
        return () => {
            // Cleanup Object URLs to free memory
            if (src) {
                URL.revokeObjectURL(src);
            }
        };
    }, [src]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        multiple: false,
        accept: 'image/jpeg, image/png, image/gif, image/webp',
        noClick: true,
        noKeyboard: true
    });

    return (
        <div {...getRootProps()} style={{ width: '100%', height: '100%', position: 'relative' }}>
            <input {...getInputProps()} />
            {children}
            {src && (
          <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#fff',
      zIndex: 9999,
    }}>
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
                    borderRadius: '10px'
                }}>
                    <Cropper
                        ref={cropperRef}
                        src={src}
                        className="CropperWindow"
                        style={{ height: 400, width: '40vw', backgroundColor:'black' }}
                        aspectRatio={1}
                        guides={false}
                    />
                  
                    <button className="LoginBlock-emailLoginButton" type="button" style={{marginTop:'1em'}} onClick={cropImage}>Use as Image</button>
                </div>
            </div>
            )}
        </div>
    );
};

export default ImageUploadWrapper;
