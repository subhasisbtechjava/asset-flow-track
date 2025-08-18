import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Loader from '../../components/loader/Loader';
import { useLoadertime } from "../../contexts/loadertimeContext";

export default function DescriptionPopup({ description }) {
  const [isOpen, setIsOpen] = useState(false);
   const [isPopupOpen, setIsPopupOpen] = useState(false);
     const [loading, setLoading] = useState(false);
     const loadintime = useLoadertime();

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
                <p className="text-gray-700">{description}</p>
             
            </div>

            {/* Footer */}
            {/* <div className="border-t p-4 flex justify-end bg-gray-50 rounded-b-lg">
              <Button 
                onClick={() => setIsPopupOpen(false)}
                variant="outline"
                className="hover:bg-gray-100 transition-colors"
              >
                Close
              </Button>
            </div> */}
          </div>
        </div>
        </>
      )}      
    </div>
  );
}
