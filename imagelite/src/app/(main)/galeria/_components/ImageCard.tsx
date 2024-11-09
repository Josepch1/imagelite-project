'use client';

import { FaDownload } from 'react-icons/fa6';

interface ImageCardProps {
  name?: string;
  url?: string;
  size?: number;
  uploadDate?: string;
  extension?: string;
}

export default function ImageCard(props: ImageCardProps) {
  function downloadImage() {
    // Implementar download da imagem
    window.open(props.url, '_blank');
  }

  function formatBytes(bytes: number = 0, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  return (
    <div className="card relative bg-white rounded-md shadow-md transition-transform ease-in duration-300 transform hover:shadow-lg hover:-translate-y-2">
      <img className="h-56 w-full object-cover rounded-t-md" 
        alt={ props.name }
        src={ props.url }
      />
      <div className="card-body p-4 text-gray-600">
        <div className='mb-2 font-semibold text-gray-600 flex flex-row justify-between'>
        <h5 className='flex gap-0.5 items-baseline'>
          <span className="text-lg">
            { props.name }
          </span>
          <span className='text-xs'>
            { props?.extension?.toLowerCase() }
          </span>
        </h5>
        <button onClick={downloadImage} className='text-sm hover:text-gray-900'><FaDownload /></button>
        </div>
        <p className='text-sm'>{ formatBytes(props.size) }</p>
        <p className='text-sm'>{ props.uploadDate }</p>
      </div>
    </div>
  );
}
