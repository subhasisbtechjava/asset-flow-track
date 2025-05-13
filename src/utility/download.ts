import { getFileNameFromUrl } from "./get_file_type";


  // export const downloadFile = async (fileUrl: string, ) => {
  //   try {
  //     // window.open(fileUrl);
  //     // return;
  //     const fileName = getFileNameFromUrl(fileUrl)
  //     const token = localStorage.getItem("token");
  //     const response = await fetch(fileUrl, {
  //       method: 'GET',
  //       // Uncomment and set token if needed
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  
  //     if (!response.ok) throw new Error("Network response was not ok");
  
  //     const blob = await response.blob();
  //     const url = window.URL.createObjectURL(blob);
  
  //     const link = document.createElement('a');
  //     link.href = url;
  //     link.setAttribute('download', fileName); // force download
  //     document.body.appendChild(link);
  //     link.click();
  //     link.remove();
  
  //     // Cleanup
  //     window.URL.revokeObjectURL(url);
  //   } catch (error) {
  //     console.error("Download failed:", error);
  //   }
  // };

  export const downloadFile = (fileUrl: string) => {
  const link = document.createElement('a');
  link.href = fileUrl;
  link.setAttribute('download', ''); // empty value triggers browser download
  document.body.appendChild(link);
  link.click();
  link.remove();
};



