import React, { useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import NftPreview from './NftPReview';

const MintForm = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMint = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter a name for your NFT');
      return;
    }

    if (!description.trim()) {
      toast.error('Please enter a description for your NFT');
      return;
    }

    if (!image) {
      toast.error('Please upload an image for your NFT');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const newNFT = {
        id: Math.random().toString(36).substring(2, 9),
        name,
        description,
        image,
        creator: '0x' + Math.random().toString(36).substring(2, 12),
        createdAt: new Date().toISOString(),
        token: {
          name: 'NiyiToken',
          symbol: 'NTK',
        },
      };

      onMintSuccess(newNFT);

      // Reset form
      setName('');
      setDescription('');
      setImage(null);

      setIsLoading(false);
      toast.success('NTK NFT minted successfully!');
    }, 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className=" border border-gray-600 rounded-lg p-6">
        <form onSubmit={handleMint} className="space-y-6">
          <h2 className="text-2xl font-bold text-white mb-6">Create Your NFT</h2>

          <div className="space-y-2">
            <label htmlFor="nftImage" className="text-white block">Upload Image</label>
            <div className="relative border-2 border-dashed border-gray-500 rounded-lg p-4 flex flex-col items-center justify-center h-48 bg-gray-700 hover:bg-gray-600 transition-colors cursor-pointer">
              <input
                id="nftImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {!image ? (
                <div className="flex flex-col items-center justify-center text-gray-300">
                  <Upload size={40} className="mb-2" />
                  <p className="text-sm">Click or drag to upload image</p>
                  <p className="text-xs mt-1">PNG, JPG, GIF up to 5MB</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-white">
                  <ImageIcon size={40} className="mb-2 text-blue-400" />
                  <p className="text-sm">Image uploaded successfully</p>
                  <p className="text-xs mt-1 text-blue-400">Click to change</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="nftName" className="text-white block">Name</label>
            <input
              id="nftName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter NFT name"
              className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="nftDescription" className="text-white block">Description</label>
            <textarea
              id="nftDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your NFT..."
              className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-500 text-white h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-6 rounded bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:opacity-90 transition-opacity"
          >
            {isLoading ? 'Minting...' : 'Mint NFT'}
          </button>
        </form>
      </div>

      <NftPreview
        name={name || 'NFT Name'}
        description={description || 'NFT Description'}
        image={image}
      />
    </div>
  );
};

export default MintForm;
