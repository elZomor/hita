import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { AlertCircle, CheckCircle, File, Upload, X } from 'lucide-react';
import { uploadShowReel } from '../../utils/restUtils.ts';
import { useTranslation } from 'react-i18next';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ACCEPTED_VIDEO_TYPES = {
  'video/mp4': ['.mp4'],
  'video/quicktime': ['.mov'],
  'video/x-msvideo': ['.avi'],
  'video/webm': ['.webm'],
};

type VideoUploadProps = {
  handleSavedSuccessfully?: () => void;
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
  const { t } = useTranslation();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage('File size exceeds 50MB limit');
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
      await uploadShowReel(selectedFile, setUploadProgress);
      setUploadStatus('success');
      if (handleSavedSuccessfully) {
        handleSavedSuccessfully();
      }
    } catch {
      setUploadStatus('error');
      setErrorMessage('Failed to upload video');
    }
  };

  const handleCancel = (event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedFile(null);
    setUploadStatus('idle');
    setErrorMessage('');
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_VIDEO_TYPES,
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
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
          ${uploadStatus === 'uploading' ? 'pointer-events-none' : ''}
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
              {addTranslationPrefix('MAX_SIZE')}: 50{addTranslationPrefix('MB')}
              )
            </p>
          </>
        )}
      </div>

      {selectedFile && (
        <div className="mt-4 flex">
          <button
            onClick={handleUpload}
            className="bg-purple-500 text-white px-4 py-2 mx-3 rounded hover:bg-purple-600"
            disabled={uploadStatus === 'uploading'}
          >
            {t('SAVE')}
          </button>
          <button
            onClick={handleCancel}
            className="bg-gray-300 text-gray-700 px-4 py-2 mx-3 rounded hover:bg-gray-400"
            disabled={uploadStatus === 'uploading'}
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
