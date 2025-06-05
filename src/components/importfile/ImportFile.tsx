import { useState, useRef,useEffect } from 'react';
import { useParams, Link, useNavigate } from "react-router-dom";
import { X, Clock, User,Upload } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { assetAPI } from "@/api/storeAPI";
import { useToast } from "@/hooks/use-toast";


const ImportFile = ({onupload}) => {
 
 const { id } = useParams();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{name: string, file: File, url: string} | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [storeDetails, setStoreDetails] = useState<any>({});
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isPopupDone, setIsUploadDone] = useState(false);
  const { toast } = useToast();

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

       useEffect(() => { 
       setIsUploadDone(false);
      }, [isPopupDone]);
  
        
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;


    const allowedExtensions = ['.csv', '.txt'];
    const fileExtension = files[0].name.slice(
      ((files[0].name.lastIndexOf('.') - 1) >>> 0) + 2
    ).toLowerCase();

    // Check MIME type (some browsers don't report CSV MIME types consistently)
    const allowedMimeTypes = [
      'text/csv',
      'text/plain',
      'application/vnd.ms-excel',
      'application/csv',
      'application/x-csv',
      'text/x-csv',
      'text/comma-separated-values',
      'text/x-comma-separated-values'
    ];

    if (
      !allowedExtensions.includes('.' + fileExtension) ||
      !allowedMimeTypes.includes(files[0].type)
    ) {

      toast({
        title: "Error in upload",
        description: "File must be in CSV format",
        variant: "destructive"
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Clear the file input
      }
      setIsPopupOpen(false);
    } else {
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
    }
  }

      

  const uploadFileToAPI = async () => {
      if (!uploadedFile) return;
  
      setIsUploading(true);
      setUploadProgress(0);
  
      try {
        const formData = new FormData();
        
        // Append the file and additional metadata
        formData.append('attachment', uploadedFile.file);
        //formData.append('upload_date', new Date().toISOString());
  
        // Get store ID from wherever it's available in your app
        // Replace this with how you get your store ID
        const storeId = id; 
  
        // Call the API using the imported storeAPI function
        const result = await assetAPI.uploadAssets(formData);
        
        console.log('Upload successful:', result);
        
        // Clear file after successful upload
        
        URL.revokeObjectURL(uploadedFile.url);
        setUploadedFile(null);
        setIsUploadDone(false);
        //alert('File uploaded successfully!');

        toast({
        title: "File Uploaded",
        description: `Assets master has been uploaded successfully.`,        
      });
      
      onupload();

      } catch (error) {
        console.error('Upload error:', error);
        alert('Error uploading file');
      } finally {
        setIsUploading(false); 
        setIsPopupOpen(false);
      }
    };
 
  return (
    <>      

        <Button variant="outline" onClick={() => setIsPopupOpen(true)} >
        <Upload className="mr-2 h-4 w-4" />
        Import
        </Button>

  {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center border-b p-4">
              <h2 className="text-xl font-semibold">Upload Assets File</h2>
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

export default ImportFile;