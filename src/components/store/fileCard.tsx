import { getFileIconComponent, getFileNameFromUrl, getFileTypeCategory } from '@/utility/get_file_type';
import { Download } from 'lucide-react';
import React from 'react';
import { Button } from '../ui/button';

interface FileCardProps {
  fileUrl: string;
}

const FileCard: React.FC<FileCardProps> = ({ fileUrl }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(128, 128, 128, 0.1)',
        padding: '5px',
        borderRadius: '10px',
      }}
    >
      {/* Left side: Icon + filename */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
        {getFileTypeCategory(fileUrl) === 'image' ? (
          <img src={fileUrl} alt="" width="30px" />
        ) : (
          getFileIconComponent(getFileTypeCategory(fileUrl))
        )}

        <p
          style={{
            fontSize: '10px',
            maxWidth: '150px',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}
        >
          {getFileNameFromUrl(fileUrl)}
        </p>
      </div>

      {/* Right side: Download button */}
      <Button
        size="icon"
        variant="ghost"
        className="h-6 w-6"
        onClick={() => window.open(fileUrl)}
      >
        <Download className="h-3 w-3" />
      </Button>
    </div>
  );
};

export default FileCard;
