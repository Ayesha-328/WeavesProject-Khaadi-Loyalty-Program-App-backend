'use client';

import React, { useState, DragEvent, ChangeEvent } from 'react';

const BulkUploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setMessage('');
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      setMessage('');
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a CSV file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    const performedByUserId = 1; // hardcoded for now

    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5085/update/bulk-upload?performedByUserId=${performedByUserId}`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const result = await response.json();

      if (response.ok) {
        setMessage(result.message || 'Upload successful.');
        setFile(null); // Reset after upload
      } else {
        setMessage(result.message || 'Upload failed.');
      }
    } catch (err) {
      console.error(err);
      setMessage('Error uploading file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Bulk Credit Upload</h1>
      <p className='mb-3 text-slate-700'>Upload a CSV file with these fields <span className='font-bold'>CustId</span>(CustomerID) and the <span className='font-bold'>Credit</span>(Credits to add) </p>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-md p-10 text-center transition ${
          isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
        }`}
      >
        <p className="text-gray-600">Drag & drop your CSV file here</p>
        <p className="text-sm text-gray-400 mt-2">or</p>
        <label className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700">
          Choose File
          <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
        </label>

        {file && <p className="mt-4 text-orange-600">Selected file: {file.name}</p>}
      </div>

      <button
        onClick={handleUpload}
        className="mt-6 bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700 disabled:opacity-50"
        disabled={loading || !file}
      >
        {loading ? 'Uploading...' : 'Upload'}
      </button>

      {message && (
        <div className="mt-4 text-center text-blue-700 bg-blue-50 p-3 rounded border border-blue-300">
          {message}
        </div>
      )}
    </div>
  );
};

export default BulkUploadPage;
