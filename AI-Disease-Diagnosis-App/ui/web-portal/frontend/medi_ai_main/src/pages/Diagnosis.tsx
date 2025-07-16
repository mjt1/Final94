import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Mic, MicOff, User, Activity, AlertCircle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVoice } from '@/contexts/VoiceContext';
import { toast } from '@/hooks/use-toast';
import { analyzeSymptoms } from '@/services/api';
import MultimediaUpload from '@/components/MultimediaUpload';

interface Symptom {
  id: string;
  name: string;
  category: string;
  severity: 'low' | 'medium' | 'high';
  bodyPart?: string;
}

interface MediaFile {
  id: string;
  file: File;
  type: 'image' | 'video' | 'audio';
  url: string;
  name: string;
}

const Diagnosis = () => {
  const { t } = useLanguage();
  const { isListening, transcript, startListening, stopListening, clearTranscript } = useVoice();
  const navigate = useNavigate();
  const [selectedSymptoms, setSelectedSymptoms] = useState<Symptom[]>([]);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const commonSymptoms: Symptom[] = [
    { id: '1', name: 'Fever', category: 'General', severity: 'medium' },
    { id: '2', name: 'Headache', category: 'Neurological', severity: 'low', bodyPart: 'head' },
    { id: '3', name: 'Cough', category: 'Respiratory', severity: 'low' },
    { id: '4', name: 'Chest Pain', category: 'Cardiovascular', severity: 'high', bodyPart: 'chest' },
    { id: '5', name: 'Abdominal Pain', category: 'Gastrointestinal', severity: 'medium', bodyPart: 'abdomen' },
    { id: '6', name: 'Nausea', category: 'Gastrointestinal', severity: 'low' },
    { id: '7', name: 'Dizziness', category: 'Neurological', severity: 'medium' },
    { id: '8', name: 'Shortness of Breath', category: 'Respiratory', severity: 'high' },
    { id: '9', name: 'Joint Pain', category: 'Musculoskeletal', severity: 'medium' },
    { id: '10', name: 'Skin Rash', category: 'Dermatological', severity: 'low', bodyPart: 'skin' },
    { id: '11', name: 'Back Pain', category: 'Musculoskeletal', severity: 'medium', bodyPart: 'back' },
    { id: '12', name: 'Fatigue', category: 'General', severity: 'low' },
  ];

  const bodyParts = [
    { id: 'head', name: 'Head', x: 50, y: 15 },
    { id: 'chest', name: 'Chest', x: 50, y: 35 },
    { id: 'abdomen', name: 'Abdomen', x: 50, y: 50 },
    { id: 'back', name: 'Back', x: 50, y: 35 },
    { id: 'leftArm', name: 'Left Arm', x: 25, y: 40 },
    { id: 'rightArm', name: 'Right Arm', x: 75, y: 40 },
    { id: 'leftLeg', name: 'Left Leg', x: 40, y: 75 },
    { id: 'rightLeg', name: 'Right Leg', x: 60, y: 75 },
  ];

  const filteredSymptoms = commonSymptoms.filter(symptom =>
    symptom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    symptom.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (transcript && transcript.trim()) {
      // Process voice input to extract symptoms
      const voiceSymptoms = commonSymptoms.filter(symptom =>
        transcript.toLowerCase().includes(symptom.name.toLowerCase())
      );
      
      voiceSymptoms.forEach(symptom => {
        if (!selectedSymptoms.find(s => s.id === symptom.id)) {
          addSymptom(symptom);
        }
      });
    }
  }, [transcript, selectedSymptoms]);

  const addSymptom = (symptom: Symptom) => {
    if (!selectedSymptoms.find(s => s.id === symptom.id)) {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
      toast({
        title: "Symptom Added",
        description: `${symptom.name} has been added to your symptoms`,
      });
    }
  };

  const removeSymptom = (symptomId: string) => {
    setSelectedSymptoms(selectedSymptoms.filter(s => s.id !== symptomId));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'General': 'bg-blue-100 text-blue-800',
      'Neurological': 'bg-purple-100 text-purple-800',
      'Respiratory': 'bg-cyan-100 text-cyan-800',
      'Cardiovascular': 'bg-red-100 text-red-800',
      'Gastrointestinal': 'bg-orange-100 text-orange-800',
      'Musculoskeletal': 'bg-indigo-100 text-indigo-800',
      'Dermatological': 'bg-pink-100 text-pink-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleAnalyze = async () => {
    if (selectedSymptoms.length === 0 && mediaFiles.length === 0 && !transcript.trim()) {
      toast({
        title: "No Input Provided",
        description: "Please select symptoms, upload media files, or provide voice input to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Combine selected symptoms and voice input into text
      const symptomNames = selectedSymptoms.map(s => s.name).join(', ');
      const combinedText = [symptomNames, transcript].filter(Boolean).join('. ');
      
      console.log('Sending to API:', combinedText);
      
      // Call the real API
      const apiResponse = await analyzeSymptoms(combinedText);
      
      console.log('API Response:', apiResponse);
      
      // Navigate to results with API data
      navigate('/results', { 
        state: { 
          symptoms: selectedSymptoms,
          mediaFiles: mediaFiles,
          voiceInput: transcript,
          apiResponse: apiResponse,
          inputText: combinedText
        } 
      });
    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to connect to the diagnosis service. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleVoice = () => {
    if (isListening) {
      stopListening();
    } else {
      clearTranscript();
      startListening();
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            {t('diagnosis.title')}
          </h1>
          <p className="text-lg text-slate-600">
            Select your symptoms, upload media files, or describe them using voice input
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Input Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Multimedia Upload */}
            <MultimediaUpload
              onFilesChange={setMediaFiles}
              maxFiles={5}
            />

            {/* Symptom Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  {t('diagnosis.symptoms')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Search symptoms..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    variant={isListening ? "destructive" : "outline"}
                    onClick={toggleVoice}
                    className={isListening ? "pulse-ring" : ""}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                </div>

                {isListening && (
                  <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                    <div className="flex items-center gap-2 text-blue-700 mb-2">
                      <Activity className="h-4 w-4 animate-pulse" />
                      {t('diagnosis.listening')}
                    </div>
                    <p className="text-sm text-slate-600">
                      {transcript || "Speak now to describe your symptoms..."}
                    </p>
                  </div>
                )}

                {/* Symptom Grid */}
                <div className="grid sm:grid-cols-2 gap-3">
                  {filteredSymptoms.map((symptom) => {
                    const isSelected = selectedSymptoms.find(s => s.id === symptom.id);
                    return (
                      <div
                        key={symptom.id}
                        onClick={() => isSelected ? removeSymptom(symptom.id) : addSymptom(symptom)}
                        className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                          isSelected 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-medium text-slate-900">{symptom.name}</h3>
                              {isSelected && <Check className="h-4 w-4 text-blue-600" />}
                            </div>
                            <div className="flex gap-2">
                              <Badge variant="secondary" className={getCategoryColor(symptom.category)}>
                                {symptom.category}
                              </Badge>
                              <Badge variant="secondary" className={getSeverityColor(symptom.severity)}>
                                {symptom.severity}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Selected Symptoms */}
            {selectedSymptoms.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Selected Symptoms ({selectedSymptoms.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {selectedSymptoms.map((symptom) => (
                      <Badge
                        key={symptom.id}
                        variant="secondary"
                        className="cursor-pointer hover:bg-red-100 hover:text-red-800"
                        onClick={() => removeSymptom(symptom.id)}
                      >
                        {symptom.name} ×
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Body Map and Analysis */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {t('diagnosis.bodyMap')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative bg-slate-50 rounded-lg p-4 aspect-[3/4]">
                  {/* Simple Body Diagram */}
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {/* Head */}
                    <circle cx="50" cy="15" r="8" fill="#e2e8f0" stroke="#64748b" strokeWidth="1" />
                    
                    {/* Body */}
                    <rect x="42" y="23" width="16" height="25" fill="#e2e8f0" stroke="#64748b" strokeWidth="1" rx="2" />
                    
                    {/* Arms */}
                    <rect x="30" y="25" width="8" height="20" fill="#e2e8f0" stroke="#64748b" strokeWidth="1" rx="2" />
                    <rect x="62" y="25" width="8" height="20" fill="#e2e8f0" stroke="#64748b" strokeWidth="1" rx="2" />
                    
                    {/* Legs */}
                    <rect x="44" y="50" width="5" height="30" fill="#e2e8f0" stroke="#64748b" strokeWidth="1" rx="2" />
                    <rect x="51" y="50" width="5" height="30" fill="#e2e8f0" stroke="#64748b" strokeWidth="1" rx="2" />
                  </svg>

                  {/* Body Part Markers */}
                  {bodyParts.map((part) => {
                    const hasSymptom = selectedSymptoms.some(s => s.bodyPart === part.id);
                    return (
                      <div
                        key={part.id}
                        className={`absolute w-4 h-4 rounded-full transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all ${
                          hasSymptom
                            ? 'bg-red-500 shadow-lg scale-125'
                            : 'bg-blue-500 hover:bg-blue-600 hover:scale-110'
                        }`}
                        style={{ left: `${part.x}%`, top: `${part.y}%` }}
                        title={part.name}
                      />
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Analysis Button */}
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || (selectedSymptoms.length === 0 && mediaFiles.length === 0)}
              className="w-full medical-gradient text-white py-6 text-lg font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
            >
              {isAnalyzing ? (
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 animate-spin" />
                  Analyzing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  {t('diagnosis.analyze')}
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Diagnosis;
