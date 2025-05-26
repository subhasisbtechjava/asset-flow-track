import { useState, useEffect } from 'react';
import { X, Clock, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
 import { assetAPI } from  "@/api/storeAPI";
import Loader from '../../components/loader/Loader';
import { useLoadertime } from "../../contexts/loadertimeContext";

interface HistoryItem {
  assets_attribute: string;
  updated_at: string;
  updated_by_name: string;
}

const HistoryLogPopUp = (assetsid:string) => {
 
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [datafound, setNodata] = useState("");
  const [datalenght, setDatalenght] = useState(0);
  const loadintime = useLoadertime();

 

  // Mock API call (replace with actual API call)
  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      setLoading(true);
      // Simulate API call
    //   const data = [
    //     { action: 'Store Created', date: '2023-05-15T10:30:00Z', user: 'John Doe' },
    //     { action: 'Assets Assigned', date: '2023-05-16T11:45:00Z', user: 'Jane Smith' },
    //     { action: 'PO Updated', date: '2023-05-17T09:15:00Z', user: 'Robert Johnson' },
    //     { action: 'Invoice Updated', date: '2023-05-18T14:20:00Z', user: 'Emily Davis' },
    //     { action: 'GRN Updated', date: '2023-05-19T16:10:00Z', user: 'Michael Wilson' },
    //     { action: 'Tagging Updated', date: '2023-05-20T10:00:00Z', user: 'Sarah Brown' },
    //     { action: 'Approval Updated', date: '2023-05-21T13:25:00Z', user: 'David Miller' },
    //     { action: 'Audit Updated', date: '2023-05-22T15:30:00Z', user: 'Lisa Taylor' },
    //     { action: 'Booking Updated', date: '2023-05-23T17:45:00Z', user: 'James Anderson' },
    //   ];
       const historyresult = await assetAPI.getAssetHistoryById(assetsid.storeassetId);
       console.log(historyresult);
      setHistoryData(historyresult);
      setDatalenght(historyresult.length);
      setIsLoading(false);
      setTimeout(() => {
          setLoading(false)
      }, loadintime); 

    };
    if (isPopupOpen) {
      fetchHistory();
    }
  }, [isPopupOpen]);

  console.log("len"+historyData.length );


  
    // const nodata = (datalenght > 0) ? true : false; 
    // if(nodata == false){
    //      setNodata("datanotfound");
    // }
    
    

//    useEffect(() => { 
//      setLoading(false)          
//    },[datafound]);

  // Format date in IST using Intl.DateTimeFormat
const formatDate = (dateString) => {
    const date = new Date(dateString);
    
    // Convert UTC to IST by adding 5 hours and 30 minutes (5.5 hours = 19800 seconds)
    const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
    const istDate = new Date(date.getTime() + istOffset);

    // Extract date components
    const day = String(istDate.getUTCDate()).padStart(2, '0');
    const month = String(istDate.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = istDate.getUTCFullYear();

    // Extract time components
    let hours = istDate.getUTCHours();
    const minutes = String(istDate.getUTCMinutes()).padStart(2, '0');
    const seconds = String(istDate.getUTCSeconds()).padStart(2, '0');
    
    // Determine AM/PM and convert hours to 12-hour format
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
    hours = String(hours).padStart(2, '0');

    // Construct the formatted string
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds} ${ampm}`;
  };

  return (
    <>   
      <Button onClick={() => setIsPopupOpen(true)} className="flex items-center gap-2">
        <Clock className="w-4 h-4" />
        History    
      </Button>

      { isPopupOpen && (
      
        <>
           { historyData.length > 0 && (<Loader loading={loading} />)}
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
                <Clock className="w-5 h-5 text-blue-600" />
                Assets Activity History 
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
                { historyData.length > 0 ?(
                <div className="relative space-y-6">
                  {/* Timeline line */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-indigo-500"></div>

                  {historyData.map((item, index) => (
                    <div
                      key={index}
                      className="relative pl-10 animate-fadeIn transition-all duration-300 ease-in-out hover:bg-gray-50 hover:shadow-md rounded-lg p-4"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Timeline dot */}
                      <div className="absolute left-2.5 top-5 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow"></div>

                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-800">{item?.assets_attribute?.charAt(0)?.toUpperCase() + item?.assets_attribute?.slice(1) || ''} Updated</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                            <Clock className="w-4 h-4 text-blue-500" />
                            <span>{formatDate(item.updated_at)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 bg-indigo-100 px-3 py-1 rounded-full shadow-sm">
                          <User className="w-5 h-5 text-indigo-600" />
                          <span className="text-sm font-medium text-indigo-800">{item.updated_by_name}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                ): (
                <div style={{ textAlign: 'center', color: '#6B7280', padding: '1.5rem', fontWeight: 'bold', fontSize: '1.25rem' }}>No history available</div>
                )}

                
             
            </div>

            {/* Footer */}
            <div className="border-t p-4 flex justify-end bg-gray-50 rounded-b-lg">
              <Button 
                onClick={() => setIsPopupOpen(false)}
                variant="outline"
                className="hover:bg-gray-100 transition-colors"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
        </>
      )}
    </>
  );
};

export default HistoryLogPopUp;