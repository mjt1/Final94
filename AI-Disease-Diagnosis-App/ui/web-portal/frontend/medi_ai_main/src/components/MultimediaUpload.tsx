
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, Video, Mic, Upload, X, Play, Pause, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';

interface MediaFile {
  id: string;
  file: File;
  type: 'image' | 'video' | 'audio';
  url: string;
  name: string;
}

interface MultimediaUploadProps {
  onFilesChange: (files: MediaFile[]) => void;
  maxFiles?: number;
}

const MultimediaUpload: React.FC<MultimediaUploadProps> = ({ onFilesChange, maxFiles = 5 }) => {
  const { t } = useLanguage();
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingType, setRecordingType] = useState<'video' | 'audio' | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles: MediaFile[] = [];
    
    Array.from(files).forEach((file) => {
      if (mediaFiles.length + newFiles.length >= maxFiles) {
        toast({
          title: "File limit reached",
          description: `Maximum ${maxFiles} files allowed`,
          variant: "destructive",
        });
        return;
      }

      let type: 'image' | 'video' | 'audio';
      if (file.type.startsWith('image/')) type = 'image';
      else if (file.type.startsWith('video/')) type = 'video';
      else if (file.type.startsWith('audio/')) type = 'audio';
      else {
        toast({
          title: "Unsupported file type",
          description: "Please upload images, videos, or audio files only",
          variant: "destructive",
        });
        return;
      }

      const mediaFile: MediaFile = {
        id: Date.now().toString() + Math.random(),
        file,
        type,
        url: URL.createObjectURL(file),
        name: file.name,
      };

      newFiles.push(mediaFile);
    });

    const updatedFiles = [...mediaFiles, ...newFiles];
    setMediaFiles(updatedFiles);
    onFilesChange(updatedFiles);

    toast({
      title: "Files uploaded",
      description: `${newFiles.length} file(s) added successfully`,
    });
  };

  const startRecording = async (type: 'video' | 'audio') => {
    try {
      const constraints = type === 'video' 
        ? { video: true, audio: true }
        : { audio: true };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (type === 'video' && videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { 
          type: type === 'video' ? 'video/webm' : 'audio/webm' 
        });
        const file = new File([blob], `recorded-${type}-${Date.now()}.webm`, {
          type: blob.type
        });

        const mediaFile: MediaFile = {
          id: Date.now().toString(),
          file,
          type,
          url: URL.createObjectURL(blob),
          name: file.name,
        };

        const updatedFiles = [...mediaFiles, mediaFile];
        setMediaFiles(updatedFiles);
        onFilesChange(updatedFiles);

        toast({
          title: "Recording saved",
          description: `${type} recording saved successfully`,
        });

        stopStream();
      };

      setMediaRecorder(recorder);
      setRecordingType(type);
      setIsRecording(true);
      recorder.start();

    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording failed",
        description: "Could not access camera/microphone",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      setRecordingType(null);
      setMediaRecorder(null);
    }
  };

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const removeFile = (id: string) => {
    const updatedFiles = mediaFiles.filter(file => file.id !== id);
    setMediaFiles(updatedFiles);
    onFilesChange(updatedFiles);
    
    // Clean up URL
    const fileToRemove = mediaFiles.find(f => f.id === id);
    if (fileToRemove) {
      URL.revokeObjectURL(fileToRemove.url);
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'audio': return <Mic className="h-4 w-4" />;
      default: return <Upload className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Media Upload
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Controls */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*,audio/*"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
          
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center gap-1 h-auto py-3"
          >
            <Upload className="h-4 w-4" />
            <span className="text-xs">Upload</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => startRecording('video')}
            disabled={isRecording}
            className="flex flex-col items-center gap-1 h-auto py-3"
          >
            <Video className="h-4 w-4" />
            <span className="text-xs">Video</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => startRecording('audio')}
            disabled={isRecording}
            className="flex flex-col items-center gap-1 h-auto py-3"
          >
            <Mic className="h-4 w-4" />
            <span className="text-xs">Audio</span>
          </Button>

          {isRecording && (
            <Button
              variant="destructive"
              onClick={stopRecording}
              className="flex flex-col items-center gap-1 h-auto py-3"
            >
              <Pause className="h-4 w-4" />
              <span className="text-xs">Stop</span>
            </Button>
          )}
        </div>

        {/* Recording Preview */}
        {isRecording && recordingType === 'video' && (
          <div className="relative">
            <video
              ref={videoRef}
              className="w-full max-w-sm mx-auto rounded-lg"
              muted
            />
            <Badge className="absolute top-2 left-2 bg-red-500">
              Recording...
            </Badge>
          </div>
        )}

        {isRecording && recordingType === 'audio' && (
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="flex items-center justify-center gap-2 text-red-700">
              <Mic className="h-4 w-4 animate-pulse" />
              Recording audio...
            </div>
          </div>
        )}

        {/* Uploaded Files */}
        {mediaFiles.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Uploaded Files ({mediaFiles.length})</h4>
            <div className="grid gap-2">
              {mediaFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-3 p-3 border rounded-lg"
                >
                  <div className="flex-shrink-0">
                    {getFileIcon(file.type)}
                  </div>
                  
                  {file.type === 'image' && (
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <Badge variant="secondary" className="text-xs">
                      {file.type}
                    </Badge>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file.id)}
                    className="flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {mediaFiles.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Upload photos, videos, or audio files</p>
            <p className="text-xs">Or record directly using your device</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MultimediaUpload;
