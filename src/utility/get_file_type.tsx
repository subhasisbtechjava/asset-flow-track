

export const  getFileTypeCategory = (url)=> {
    const extension = url.split('.').pop().split('?')[0].toLowerCase();
  
    const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
    const videoTypes = ['mp4', 'avi', 'mov', 'mkv', 'webm'];
    const pdfTypes   = ['pdf'];
    const excelTypes = ['xls', 'xlsx', 'csv'];
    const wordTypes  = ['doc', 'docx'];
    const pptTypes   = ['ppt', 'pptx'];
    const archiveTypes = ['zip', 'rar', '7z', 'tar', 'gz'];
  
    if (imageTypes.includes(extension)) return 'image';
    if (videoTypes.includes(extension)) return 'video';
    if (pdfTypes.includes(extension))   return 'pdf';
    if (excelTypes.includes(extension)) return 'excel';
    if (wordTypes.includes(extension))  return 'word';
    if (pptTypes.includes(extension))   return 'presentation';
    if (archiveTypes.includes(extension)) return 'archive';
  
    return 'unknown';
  }

  export const getFileNameFromUrl = (url:string) => {
    try {
      const pathname = new URL(url).pathname;
      return pathname.substring(pathname.lastIndexOf('/') + 1);
    } catch (e) {
      // fallback if url is a plain string (not a full URL)
      return url.split('/').pop().split('?')[0];
    }
  };

  // file: utils/getFileIconComponent.js

import {
    File,
    FileText,
    FileImage,
    FileVideo,
    FileSpreadsheet,
    FileArchive,
    FileAudio,
    FileCode2,
    FileX,
    FileImageIcon,
    FileSpreadsheetIcon,
  } from 'lucide-react';
  
  export const getFileIconComponent = (type, size = 24, color = 'currentColor') => {
    const props = { size, color };
  
    switch (type) {
      case 'image':
        return <FileImageIcon {...props} />;
      case 'video':
        return <FileVideo {...props} />;
      case 'pdf':
      case 'word':
        return <FileText {...props} />;
      case 'excel':
        return <FileSpreadsheetIcon {...props} />;
      case 'presentation':
        return <FileText {...props} />;
      case 'archive':
        return <FileArchive {...props} />;
      case 'audio':
        return <FileAudio {...props} />;
      case 'code':
        return <FileCode2 {...props} />;
      case 'unknown':
        return <FileX {...props} />;
      default:
        return <File {...props} />;
    }
  };
  