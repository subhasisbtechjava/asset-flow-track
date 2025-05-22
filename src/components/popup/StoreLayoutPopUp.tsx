import { useState, useRef,useEffect } from 'react';
import { Plus, X, Download, Upload } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { storeAPI } from "@/api/storeAPI";
import { useParams, Link, useNavigate } from "react-router-dom";
import { downloadFile } from "@/utility/download";

const StoreLayoutPopUp = () => {
  const { id } = useParams();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{name: string, file: File, url: string} | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [storeDetails, setStoreDetails] = useState<any>({});
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isPopupDone, setIsUploadDone] = useState(false);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };
  
  const getstoredetail = async()=>{
       const storesdata = await storeAPI.getStoreById(id); 
       setStoreDetails(storesdata);
    }
 

  useEffect(() => {    
     getstoredetail();        
    }, []);

     useEffect(() => {    
     getstoredetail();        
     setIsUploadDone(false);
    }, [isPopupDone]);

      

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Only take the first file
      const file = files[0];
      setUploadedFile({
        name: file.name,
        file: file,
        url: URL.createObjectURL(file) // Create object URL for preview/download
      });
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownload = (url:string,filename:string) => {    
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.download = filename || 'download';;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteLayout = async(storeid,fileid) => {  
    const deletelayout = await storeAPI.deleteStorelayout(storeid,fileid); 
    setIsUploadDone(true);
  };

  const uploadFileToAPI = async () => {
    if (!uploadedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      
      // Append the file and additional metadata
      formData.append('attachment', uploadedFile.file);
      formData.append('upload_date', new Date().toISOString());

      // Get store ID from wherever it's available in your app
      // Replace this with how you get your store ID
      const storeId = id; 

      // Call the API using the imported storeAPI function
      const result = await storeAPI.createStoreLayout(storeId, formData);
      
      console.log('Upload successful:', result);
      
      // Clear file after successful upload
      
      URL.revokeObjectURL(uploadedFile.url);
      setUploadedFile(null);
      setIsUploadDone(true);
      alert('File uploaded successfully!');
      
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading file');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <Button onClick={togglePopup} className="flex items-center gap-2">
        <Plus className="w-4 h-4" />
        Store Layout
      </Button>

      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center border-b p-4">
              <h2 className="text-xl font-semibold">Upload File</h2>
              <button 
                onClick={togglePopup}
                className="text-gray-500 hover:text-gray-700"
                disabled={isUploading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4">
              {/* File upload area */}
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => !isUploading && fileInputRef.current?.click()}
              >
                <Upload className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-600">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-500 mt-1">Only single file upload supported</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </div>

              {/* Upload progress indicator */}
              {isUploading && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 text-center">
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              )}

              {/* Uploaded file display */}
             <div className="flex-1 max-h-60 overflow-y-auto mb-4 border border-gray-200 rounded-lg">
              {storeDetails.storelayout.length > 0 ? (
  storeDetails.storelayout.map((dtls) => (
    <div key={dtls.uploadId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="truncate flex-1 mr-2">
        {/* Extract filename from URL if you want to show just the filename */}
        <p className="text-sm font-medium truncate">
          {dtls.layout_attachment_url.split('/').pop()}
        </p>
        {/* Optional: Show upload date */}
        <p className="text-xs text-gray-500">
         Uploaded Date : {new Date(dtls.upload_date).toLocaleDateString('en-GB')}
        </p>
      </div>
      <div className="flex space-x-2">
        <button        
                onClick={() =>
                  handleDownload(
                    dtls.layout_attachment_url,
                    dtls.layout_attachment_url.split('/').pop()
                  )
                }

                //onClick={() => downloadFile (dtls.layout_attachment_url)}

                className="p-2 text-blue-600 hover:text-blue-800"
                title="Download"
                disabled={isUploading}
              >
          <Download className="w-4 h-4" />
        </button>
        {/* <button
          onClick={() => handleDeleteLayout(id,dtls.uploadId)} // You'll need to implement this
          className="p-2 text-red-600 hover:text-red-800"
          title="Remove"
          disabled={isUploading}
        >
          <X className="w-4 h-4" />
        </button> */}
      </div>
    </div>
  ))
) : (
  <p className="text-center text-gray-500 py-4">No file uploaded yet</p>
)}
              </div>
            </div>

            <div className="border-t p-4 flex justify-end">
              <Button 
                onClick={togglePopup} 
                variant="outline" 
                className="mr-2"
                disabled={isUploading}
              >
                Close
              </Button>
              <Button 
                onClick={uploadFileToAPI}
                disabled={!uploadedFile || isUploading}
              >
                {isUploading ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StoreLayoutPopUp;