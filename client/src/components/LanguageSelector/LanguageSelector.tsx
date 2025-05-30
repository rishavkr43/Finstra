import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageChange,
}) => {
  return (
    <div className="w-[180px]">
      <Select value={selectedLanguage} onValueChange={onLanguageChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select Language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="english">English</SelectItem>
          <SelectItem value="hindi">हिंदी (Hindi)</SelectItem>
          <SelectItem value="bengali">বাংলা (Bengali)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector; 