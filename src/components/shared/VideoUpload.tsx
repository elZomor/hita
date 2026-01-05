import React, { useCallback, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { AlertCircle, CheckCircle, File, Upload, X } from 'lucide-react';
import {
  getPresignedUploadUrl,
  confirmShowReelUpload,
} from '../../utils/restUtils.ts';
import { useTranslation } from 'react-i18next';

const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB (increased for direct S3 upload)
const ACCEPTED_VIDEO_TYPES = {
  'video/mp4': ['.mp4'],
  'video/quicktime': ['.mov'],
  'video/x-msvideo': ['.avi'],
  'video/webm': ['.webm'],
};

type VideoUploadProps = {
  handleSavedSuccessfully?: (fileKey: string) => void;
};

export const VideoUpload: React.FC<VideoUploadProps> = ({
  handleSavedSuccessfully,
}: VideoUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<
    'idle' | 'uploading' | 'success' | 'error'
  >('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const uploadRequestRef = useRef<XMLHttpRequest | null>(null);
  const uploadCancelledRef = useRef(false);
  const { t } = useTranslation();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage(t('PERFORMER_PAGE.SHOW_REEL.FILE_TOO_LARGE'));
      setUploadStatus('error');
      return;
    }

    setSelectedFile(file);
    setUploadStatus('idle');
    setErrorMessage('');
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploadStatus('uploading');
      setUploadProgress(0);
      uploadCancelledRef.current = false;

      // Get file extension from name
      const fileExtension = selectedFile.name.split('.').pop() || 'mp4';

      // Step 1: Get presigned URL from backend
      setUploadProgress(5);
      const { data: presignedData } = await getPresignedUploadUrl({
        content_type: selectedFile.type,
        file_extension: fileExtension,
      });

      const { upload_url, file_key } = presignedData.data;

      // Step 2: Upload directly to S3
      setUploadProgress(10);
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        uploadRequestRef.current = xhr;
        xhr.open('PUT', upload_url, true);
        xhr.setRequestHeader('Content-Type', selectedFile.type);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            // Progress from 10% to 90%
            const percent = Math.round((event.loaded / event.total) * 80) + 10;
            setUploadProgress(percent);
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200) {
            resolve();
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };

        xhr.onerror = () => reject(new Error('Upload failed'));
        xhr.onabort = () => reject(new Error('Upload aborted'));
        xhr.send(selectedFile);
      });

      // Step 3: Confirm upload with backend
      setUploadProgress(95);
      await confirmShowReelUpload({ file_key });

      setUploadProgress(100);
      setUploadStatus('success');
      if (handleSavedSuccessfully) {
        handleSavedSuccessfully(file_key);
      }
    } catch (error) {
      if (!uploadCancelledRef.current) {
        setUploadStatus('error');
        setErrorMessage(t('PERFORMER_PAGE.SHOW_REEL.UPLOAD_FAILED'));
      }
    }
    uploadRequestRef.current = null;
    uploadCancelledRef.current = false;
  };

  const handleCancel = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (uploadStatus === 'uploading' && uploadRequestRef.current) {
      uploadCancelledRef.current = true;
      uploadRequestRef.current.abort();
    }
    setSelectedFile(null);
    setUploadStatus('idle');
    setUploadProgress(0);
    setErrorMessage('');
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected: (fileRejections) => {
      const rejection = fileRejections[0];
      if (rejection) {
        const error = rejection.errors[0];
        if (error.code === 'file-too-large') {
          setErrorMessage(t('PERFORMER_PAGE.SHOW_REEL.FILE_TOO_LARGE'));
        } else if (error.code === 'file-invalid-type') {
          setErrorMessage(t('PERFORMER_PAGE.SHOW_REEL.INVALID_FILE_TYPE'));
        } else {
          setErrorMessage(error.message);
        }
        setUploadStatus('error');
      }
    },
    accept: ACCEPTED_VIDEO_TYPES,
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
    disabled: uploadStatus === 'uploading',
  });

  const addTranslationPrefix = (text: string) => {
    return t('PERFORMER_PAGE.SHOW_REEL.' + text);
  };

  return (
    <div className="w-full max-w-md mx-auto h-full">
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-lg p-3 md:p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-400'}
        `}
      >
        <input {...getInputProps()} disabled={uploadStatus === 'uploading'} />

        {selectedFile ? (
          <div className="relative flex items-center justify-center p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <File className="h-6 w-6 text-purple-500 mr-2" />
            <span className="text-purple-800 font-medium truncate">
              {selectedFile.name}
            </span>
            <button
              onClick={handleCancel}
              className="absolute top-1 right-1 text-purple-700 hover:text-purple-900"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <>
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-sm text-gray-600">
              {isDragActive
                ? addTranslationPrefix('DROP')
                : addTranslationPrefix('DRAG_OR_SELECT')}
            </p>
            <p className="mt-2 text-xs text-gray-500">
              {addTranslationPrefix('SUPPORTED_FORMATS')}: MP4, MOV, AVI, WebM (
              {addTranslationPrefix('MAX_SIZE')}: 200{addTranslationPrefix('MB')}
              )
            </p>
          </>
        )}
      </div>

      {selectedFile && (
        <div className="mt-4 flex">
          <button
            onClick={handleUpload}
            disabled={uploadStatus === 'uploading'}
            className={`bg-purple-500 text-white px-4 py-2 mx-3 rounded ${
              uploadStatus === 'uploading'
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-purple-600'
            }`}
          >
            {t('SAVE')}
          </button>
          <button
            onClick={handleCancel}
            className="bg-gray-300 text-gray-700 px-4 py-2 mx-3 rounded hover:bg-gray-400"
          >
            {t('CANCEL')}
          </button>
        </div>
      )}

      {uploadStatus === 'uploading' && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              {addTranslationPrefix('UPLOADING')}
            </span>
            <span className="text-sm text-gray-500">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {uploadStatus === 'success' && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg flex items-center">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
          <span className="text-green-700">
            {addTranslationPrefix('UPLOAD_SUCCESS')}
          </span>
        </div>
      )}

      {uploadStatus === 'error' && (
        <div className="mt-4 p-4 bg-red-50 rounded-lg flex items-center justify-between">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-red-700">{errorMessage}</span>
          </div>
          <button
            onClick={() => setUploadStatus('idle')}
            className="text-red-500 hover:text-red-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};
