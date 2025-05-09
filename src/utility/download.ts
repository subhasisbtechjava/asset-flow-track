import { getFileNameFromUrl } from "./get_file_type";


  export const downloadFile = async (fileUrl: string, ) => {
    try {
      const fileName = getFileNameFromUrl(fileUrl)
      const response = await fetch(fileUrl, {
        method: 'GET',
        // Uncomment and set token if needed
        // headers: {
        //   Authorization: `Bearer YOUR_TOKEN`,
        // },
      });
  
      if (!response.ok) throw new Error("Network response was not ok");
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
  
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName); // force download
      document.body.appendChild(link);
      link.click();
      link.remove();
  
      // Cleanup
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };


