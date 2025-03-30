'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { RefreshCcw } from 'lucide-react';

export default function SettingsPanel({ seed, region, avgLikes, avgReviews, onSettingsChange }) {
  const regions = [
    { value: 'en_US', label: 'English (USA)' },
    { value: 'fr_FR', label: 'French (France)' },
    { value: 'ja_JP', label: 'Japanese (Japan)' }
  ];

  const handleRandomSeed = () => {
    const newSeed = Math.random().toString(36).substring(7);
    onSettingsChange({ seed: newSeed });
  };

  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle>Book Generation Settings</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-between gap-6">
        <div className="space-y-2">
          <Label htmlFor="seed">Seed Value</Label>
          <div className="flex gap-2">
            <Input
              id="seed"
              value={seed}
              onChange={(e) => onSettingsChange({ seed: e.target.value })}
              placeholder="Enter seed value"
            />
            <Button onClick={handleRandomSeed} variant="outline">
              <RefreshCcw />
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="region">Language & Region</Label>
          <Select
            value={region}
            onValueChange={(value) => onSettingsChange({ region: value })}
          >
            <SelectTrigger id="region">
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              {regions.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between gap-2">
            <Label htmlFor="avgLikes">Average Likes</Label>
            <span className="text-sm">{avgLikes.toFixed(1)}</span>
          </div>
          <Slider
            id="avgLikes"
            min={0}
            max={10}
            step={0.1}
            value={[avgLikes]}
            onValueChange={(values) => onSettingsChange({ avgLikes: values[0] })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="avgReviews">Average Reviews</Label>
          <div className="flex items-center gap-4">
            <Input
              id="avgReviews"
              type="number"
              min={0}
              max={10}
              step={0.1}
              value={avgReviews}
              onChange={(e) => onSettingsChange({ avgReviews: parseFloat(e.target.value) })}
            />
          </div>
        </div>

      </CardContent>
    </Card>
  );
};
