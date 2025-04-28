import React from 'react';
import { ImageIcon } from 'lucide-react';

const NftPreview = ({ name, description, image }) => {
  const imageUrl = image ? URL.createObjectURL(image) : null;

  return (
    <div className="bg-transparent border border-gray-700 overflow-hidden rounded-xl shadow-md">
      <div className="p-0">
        <div className="relative">
          {imageUrl ? (
            <div className="aspect-square w-full overflow-hidden">
              <img 
                src={imageUrl} 
                alt={name} 
                className="w-full h-full object-contain" 
              />
            </div>
          ) : (
            <div className="aspect-square w-full flex items-center justify-center">
              <ImageIcon size={100} className="text-gray-500" />
            </div>
          )}

          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-2 truncate">{name}</h3>
            <p className="text-gray-300 text-sm line-clamp-3">{description}</p>

            <div className="mt-4 pt-4 border-t border-gray-700 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
                <span className="ml-2 text-xs text-gray-400">Preview</span>
              </div>
              <div className="px-3 py-1 bg-gray-800 rounded-full">
                <span className="text-xs font-medium text-purple-400">PREVIEW</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NftPreview;
