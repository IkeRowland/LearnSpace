import React, { useState, useRef } from 'react';
import { validateFile } from '../../utils/validation';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const FileUpload = ({ 
    onUploadComplete,
    maxSize = 5 * 1024 * 1024, // 5MB
    allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'],
    endpoint,
    multiple = false
}) => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef(null);

    const handleFileSelect = async (event) => {
        const files = Array.from(event.target.files);
        
        for (const file of files) {
            const { isValid, errors } = validateFile(file, { maxSize, allowedTypes });
            
            if (!isValid) {
                errors.forEach(error => toast.error(error));
                return;
            }

            await uploadFile(file);
        }
        
        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const uploadFile = async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            setUploading(true);
            setProgress(0);

            const response = await api.post(endpoint, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setProgress(percentCompleted);
                }
            });

            if (response.data.success) {
                toast.success('File uploaded successfully');
                if (onUploadComplete) {
                    onUploadComplete(response.data);
                }
            }
        } catch (error) {
            toast.error('Failed to upload file');
            console.error('Upload error:', error);
        } finally {
            setUploading(false);
            setProgress(0);
        }
    };

    return (
        <div className="file-upload">
            <input
                type="file"
                onChange={handleFileSelect}
                multiple={multiple}
                accept={allowedTypes.join(',')}
                ref={fileInputRef}
                disabled={uploading}
            />
            
            {uploading && (
                <div className="progress-bar">
                    <div 
                        className="progress-bar-fill" 
                        style={{ width: `${progress}%` }}
                    />
                    <span className="progress-text">{progress}%</span>
                </div>
            )}
            
            <div className="file-info">
                <small>
                    Allowed types: {allowedTypes.join(', ')}
                    <br />
                    Max size: {maxSize / (1024 * 1024)}MB
                </small>
            </div>
        </div>
    );
};

export default FileUpload;
