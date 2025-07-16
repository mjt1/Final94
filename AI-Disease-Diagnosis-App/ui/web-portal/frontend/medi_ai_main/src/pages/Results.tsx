import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Info, CheckCircle, ExternalLink, Calendar, MapPin, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVoice } from '@/contexts/VoiceContext';
import { SymptomAnalysisResponse } from '@/services/api';

interface DiagnosisResult {
  condition: string;
  probability: number;
  severity: 'low' | 'medium' | 'high';
  description: string;
  recommendations: string[];
  urgency: 'routine' | 'soon' | 'urgent' | 'emergency';
}

interface NextSteps {
  immediate: string[];
  shortTerm: string[];
  monitoring: string[];
}

const Results = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const { speak } = useVoice();
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<DiagnosisResult[]>([]);
  const [nextSteps, setNextSteps] = useState<NextSteps | null>(null);

  const symptoms = location.state?.symptoms || [];
  const voiceInput = location.state?.voiceInput || '';
  const mediaFiles = location.state?.mediaFiles || [];
  const apiResponse: SymptomAnalysisResponse | undefined = location.state?.apiResponse;
  const inputText = location.state?.inputText || '';

  useEffect(() => {
    console.log('Results page received:', { symptoms, voiceInput, mediaFiles, apiResponse, inputText });
    
    if (apiResponse) {
      // Process real API response
      const processedResults: DiagnosisResult[] = apiResponse.conditions.map((condition, index) => ({
        condition: condition,
        probability: Math.round(apiResponse.confidence * 100),
        severity: apiResponse.severity === 'high' ? 'high' : (apiResponse.confidence > 0.7 ? 'medium' : 'low'),
        description: `Based on your symptoms, this condition has been identified with ${Math.round(apiResponse.confidence * 100)}% confidence.`,
        recommendations: [
          'Monitor your symptoms closely',
          'Stay hydrated and get adequate rest',
          'Consider consulting a healthcare professional',
          'Follow up if symptoms worsen or persist'
        ],
        urgency: apiResponse.severity === 'high' ? 'urgent' : 'routine'
      }));

      const processedNextSteps: NextSteps = {
        immediate: [
          'Monitor your symptoms for the next 24-48 hours',
          'Stay hydrated and get adequate rest',
          'Take note of any changes in your condition'
        ],
        shortTerm: [
          'Schedule a follow-up with your primary care physician',
          'Keep a symptom diary',
          'Consider lifestyle modifications based on recommendations'
        ],
        monitoring: [
          'Seek immediate medical attention if symptoms worsen',
          'Watch for any emergency warning signs',
          `Monitor confidence level: ${Math.round(apiResponse.confidence * 100)}%`
        ]
      };

      setResults(processedResults);
      setNextSteps(processedNextSteps);
      setIsLoading(false);
    } else {
      // Fallback to mock data if no API response
      setTimeout(() => {
        const mockResults: DiagnosisResult[] = [
          {
            condition: 'Unable to analyze - No API response',
            probability: 0,
            severity: 'low',
            description: 'The analysis service is currently unavailable. Please try again later.',
            recommendations: [
              'Check your internet connection',
              'Ensure the backend service is running',
              'Try again in a few moments'
            ],
            urgency: 'routine'
          }
        ];

        setResults(mockResults);
        setIsLoading(false);
      }, 1000);
    }
  }, [apiResponse]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'routine': return 'text-blue-600 bg-blue-100';
      case 'soon': return 'text-yellow-600 bg-yellow-100';
      case 'urgent': return 'text-orange-600 bg-orange-100';
      case 'emergency': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const speakResults = () => {
    if (results.length > 0 && apiResponse) {
      const topResult = results[0];
      const message = `Based on your symptoms: ${inputText}, the analysis shows ${topResult.condition} with ${topResult.probability}% confidence and ${apiResponse.severity} severity.`;
      speak(message);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Analyzing Your Symptoms</h2>
          <p className="text-slate-600">Our AI is processing your information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 pb-24 md:pb-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/diagnosis">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('common.back')}
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-900">Analysis Results</h1>
            <p className="text-slate-600 mt-1">
              Based on {symptoms.length} symptoms {voiceInput && '+ voice input'} {mediaFiles.length > 0 && `+ ${mediaFiles.length} media files`}
            </p>
            {apiResponse && (
              <p className="text-sm text-blue-600 mt-1">
                API Confidence: {Math.round(apiResponse.confidence * 100)}% | Severity: {apiResponse.severity}
              </p>
            )}
          </div>
          <Button onClick={speakResults} variant="outline">
            🔊 Listen to Results
          </Button>
        </div>

        {/* API Status Indicator */}
        {apiResponse ? (
          <Card className="mb-8 border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-green-900 mb-2">AI Analysis Complete</h3>
                  <p className="text-green-800 text-sm">
                    Successfully analyzed your input: "{inputText}" with {Math.round(apiResponse.confidence * 100)}% confidence.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-8 border-amber-200 bg-amber-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-amber-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-amber-900 mb-2">API Service Unavailable</h3>
                  <p className="text-amber-800 text-sm">
                    Unable to connect to the AI diagnosis service. Please ensure the backend is running at http://127.0.0.1:8000
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Medical Disclaimer */}
        <Card className="mb-8 border-amber-200 bg-amber-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-amber-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-900 mb-2">Medical Disclaimer</h3>
                <p className="text-amber-800 text-sm">
                  This analysis is for informational purposes only and should not replace professional medical advice. 
                  Always consult with a healthcare provider for proper diagnosis and treatment.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Results */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Possible Conditions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {results.map((result, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-900 mb-1">
                          {result.condition}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getSeverityColor(result.severity)}>
                            {result.severity} severity
                          </Badge>
                          <Badge className={getUrgencyColor(result.urgency)}>
                            {result.urgency}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {result.probability}%
                        </div>
                        <div className="text-sm text-slate-500">confidence</div>
                      </div>
                    </div>

                    <Progress value={result.probability} className="mb-3" />

                    <p className="text-slate-700 mb-4">{result.description}</p>

                    <div>
                      <h4 className="font-medium text-slate-900 mb-2">Recommendations:</h4>
                      <ul className="space-y-1">
                        {result.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Symptoms Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Your Symptoms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-3">
                  {symptoms.map((symptom: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="font-medium">{symptom.name}</span>
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {symptom.severity}
                      </Badge>
                    </div>
                  ))}
                </div>
                {voiceInput && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-1">Voice Input:</h4>
                    <p className="text-blue-800 text-sm">{voiceInput}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Next Steps */}
          <div className="space-y-6">
            {nextSteps && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Next Steps
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-slate-900 mb-2">Immediate Actions</h4>
                    <ul className="space-y-2">
                      {nextSteps.immediate.map((step, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2"></div>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-slate-900 mb-2">Short-term</h4>
                    <ul className="space-y-2">
                      {nextSteps.shortTerm.map((step, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2"></div>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-slate-900 mb-2">Monitoring</h4>
                    <ul className="space-y-2">
                      {nextSteps.monitoring.map((step, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Appointment
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <MapPin className="h-4 w-4 mr-2" />
                  Find Nearby Clinics
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Phone className="h-4 w-4 mr-2" />
                  Telemedicine Consult
                </Button>
                <Link to="/first-aid">
                  <Button className="w-full justify-start" variant="outline">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    First Aid Guide
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="text-center">
                  <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-red-900 mb-2">Emergency?</h3>
                  <p className="text-red-800 text-sm mb-3">
                    If you're experiencing severe symptoms, call emergency services immediately.
                  </p>
                  <Button variant="destructive" className="w-full">
                    <Phone className="h-4 w-4 mr-2" />
                    Call 911
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
