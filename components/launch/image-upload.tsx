'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [imageUrl, setImageUrl] = useState(value || '');

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
  };

  const handleSetImage = () => {
    onChange(imageUrl);
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          type="url"
          placeholder="Enter image URL"
          value={imageUrl}
          onChange={handleUrlChange}
        />
        <Button type="button" onClick={handleSetImage}>Set Image</Button>
      </div>
      {value && (
        <div className="relative h-40 w-40">
          <Image
            src={value}
            alt="Token icon"
            fill
            className="rounded-lg object-cover"
          />
        </div>
      )}
    </div>
  );
}
