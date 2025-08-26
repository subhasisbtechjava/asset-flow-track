import { useState,useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Loader from '../../components/loader/Loader';
import { useLoadertime } from "../../contexts/loadertimeContext";
import { storeAssetAPI } from "@/api/storeAPI";
import { useToast } from '@/hooks/use-toast';


export default function DescriptionPopup({ description,descripUpdateId }) {
  
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
   const [isPopupOpen, setIsPopupOpen] = useState(false);
     const [loading, setLoading] = useState(false);
     const [updateDescription,setUpdateDescription] = useState("");
     const loadintime = useLoadertime();

     const [formData, setFormData] = useState({   
    description: description || '',    
  });


    useEffect(() => {
    setFormData({ description: description || '' });
  }, [description, descripUpdateId]);


  const handleUpdateDescription = async () => {
   
    setLoading(true);
    try {
      const formDataToSubmit = new FormData();      
      formDataToSubmit.append('updateDescription', formData.description);
      formDataToSubmit.append('description_id', descripUpdateId);
      const payload:any = {
        updateDescription: formData.description,
        description_id: descripUpdateId
      }
      await storeAssetAPI.updateDescriptionDetails(payload);
      toast({
        title: "Description Update!",
        description: `Description has been updated successfully.`,
      });

      setIsPopupOpen(false);
    }catch (error) {
      console.error('Error updating description:', error);
      toast({
        title: "Error",
        //description: error instanceof Error ? error.message : "Something went wrong",
        description:  error.response.data.error ? error.response.data.error : "Something went wrong",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };




  return (
    <div>
      {/* Trigger link/button */}
      {/* <Button
      variant="outline"
        onClick={() => setIsPopupOpen(true)}
         className="flex items-center gap-2"
      >
        View
      </Button> */}

      <span
  onClick={() => setIsPopupOpen(true)}
  className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer flex items-center gap-1"
>
  View
</span>

      {/* Modal */}

        {isPopupOpen && (
      
        <>
           { description !== "" && (<Loader loading={loading} />)}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsPopupOpen(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b p-4 bg-gray-50 rounded-t-lg">
              <h2 className="text-xl font-semibold flex items-center gap-2">              
                Additional Description  
              </h2>
              <button 
                onClick={() => setIsPopupOpen(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close history popup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
                

                { description !== "" && (<Loader loading={loading} />)}
                {/* <p className="text-gray-700">{description}</p> */}
            <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-700"
            placeholder="Enter description here..."
            />
             
            </div>

            {/* Footer */}
            <div className="border-t p-4 flex justify-end bg-gray-50 rounded-b-lg">
              <Button 
                onClick={() => handleUpdateDescription()}
                variant="outline"
                 className="flex items-center gap-2"
              >
                Update
              </Button>
            </div>
          </div>
        </div>
        </>
      )}      
    </div>
  );
}
