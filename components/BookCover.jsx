'use client';

import React from 'react';
import { Card } from '@/components/ui/card';

export default function BookCover({ book, className }) {
  const { title, authors, cover, publishYear } = book;
  const authorText = authors.join(', ');

  const getContrastColor = (bgColor) => {
    const hexColor = bgColor.charAt(0) === '#' ? bgColor.substring(1, 7) : bgColor;
    const r = parseInt(hexColor.substring(0, 2), 16);
    const g = parseInt(hexColor.substring(2, 4), 16);
    const b = parseInt(hexColor.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness > 125 ? '#000000' : '#FFFFFF';
  };

  const textColor = getContrastColor(cover.bgColor);

  const renderCoverStyle = () => {
    switch (cover.type) {
      case 0:
        return (
          <div className="flex flex-col justify-between h-full p-4 text-center">
            <div className="mt-8">
              <h3 className="font-bold text-lg" style={{ color: textColor }}>{title}</h3>
            </div>
            <div>
              <p className="text-sm italic" style={{ color: textColor }}>{authorText}</p>
              <p className="text-xs mt-1" style={{ color: textColor }}>{publishYear}</p>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="flex flex-col justify-between h-full p-4">
            <h3 className="font-bold text-lg" style={{ color: textColor }}>{title}</h3>

            <div className="flex justify-center items-center my-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: cover.accentColor }}
              >
                <span className="text-2xl font-bold" style={{ color: getContrastColor(cover.accentColor) }}>
                  {title.charAt(0)}
                </span>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm italic" style={{ color: textColor }}>{authorText}</p>
            </div>
          </div>
        );
      case 2:
      default:
        return (
          <div className="flex flex-col justify-between h-full p-4">
            <div>
              <div
                className="w-full h-1 mb-4"
                style={{ backgroundColor: cover.accentColor }}
              />
              <h3 className="font-bold text-lg" style={{ color: textColor }}>{title}</h3>
            </div>

            <div>
              <div
                className="w-full h-1 mb-2"
                style={{ backgroundColor: cover.accentColor }}
              />
              <p className="text-sm" style={{ color: textColor }}>{authorText}</p>
              <p className="text-xs mt-1" style={{ color: textColor }}>{publishYear}</p>
            </div>
          </div>
        );
    }
  };

  return (
    <Card
      className={`overflow-hidden ${className}`}
      style={{
        backgroundColor: cover.bgColor,
        boxShadow: `0 10px 15px -3px ${cover.bgColor}40, 0 4px 6px -4px ${cover.bgColor}40`
      }}
    >
      {renderCoverStyle()}
    </Card>
  );
};

