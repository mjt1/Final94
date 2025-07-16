
import React, { useState } from 'react';
import { Search, AlertTriangle, Clock, Phone, Heart, Thermometer, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVoice } from '@/contexts/VoiceContext';

interface FirstAidGuide {
  id: string;
  title: string;
  category: string;
  severity: 'emergency' | 'urgent' | 'moderate';
  symptoms: string[];
  steps: string[];
  warnings: string[];
  callEmergency: boolean;
}

const FirstAid = () => {
  const { t } = useLanguage();
  const { speak } = useVoice();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const firstAidGuides: FirstAidGuide[] = [
    {
      id: '1',
      title: 'Choking',
      category: 'Respiratory Emergency',
      severity: 'emergency',
      symptoms: ['Unable to speak or breathe', 'Clutching throat', 'Blue lips or face'],
      steps: [
        'Encourage coughing if person can cough',
        'Give 5 back blows between shoulder blades',
        'Give 5 abdominal thrusts (Heimlich maneuver)',
        'Alternate between back blows and abdominal thrusts',
        'Continue until object is expelled or person becomes unconscious'
      ],
      warnings: ['Do not put fingers in mouth to remove object', 'Call emergency services if unsuccessful'],
      callEmergency: true
    },
    {
      id: '2',
      title: 'Heart Attack',
      category: 'Cardiac Emergency',
      severity: 'emergency',
      symptoms: ['Chest pain or pressure', 'Shortness of breath', 'Nausea', 'Sweating'],
      steps: [
        'Call emergency services immediately',
        'Help person sit down and rest',
        'Loosen any tight clothing',
        'Give aspirin if not allergic (chew, don\'t swallow whole)',
        'Be prepared to perform CPR if person becomes unconscious'
      ],
      warnings: ['Do not leave person alone', 'Do not drive to hospital yourself'],
      callEmergency: true
    },
    {
      id: '3',
      title: 'Severe Bleeding',
      category: 'Trauma',
      severity: 'emergency',
      symptoms: ['Heavy bleeding', 'Blood soaking through bandages', 'Signs of shock'],
      steps: [
        'Apply direct pressure with clean cloth',
        'Elevate injured area above heart level',
        'Apply pressure bandage over wound',
        'Do not remove embedded objects',
        'Monitor for signs of shock'
      ],
      warnings: ['Do not remove bandages once applied', 'Seek immediate medical attention'],
      callEmergency: true
    },
    {
      id: '4',
      title: 'Burns',
      category: 'Trauma',
      severity: 'urgent',
      symptoms: ['Red, swollen skin', 'Blisters', 'Pain', 'Possible charring'],
      steps: [
        'Remove from heat source',
        'Cool burn with running water for 10-15 minutes',
        'Remove jewelry or tight clothing',
        'Cover with sterile, non-adherent bandage',
        'Do not apply ice, butter, or ointments'
      ],
      warnings: ['Seek medical attention for large or severe burns', 'Watch for signs of infection'],
      callEmergency: false
    },
    {
      id: '5',
      title: 'Allergic Reaction',
      category: 'Allergy',
      severity: 'urgent',
      symptoms: ['Hives or rash', 'Swelling', 'Difficulty breathing', 'Rapid pulse'],
      steps: [
        'Remove or avoid allergen if known',
        'Use epinephrine auto-injector if available',
        'Take antihistamine if conscious and able to swallow',
        'Monitor breathing and pulse',
        'Position person comfortably'
      ],
      warnings: ['Severe reactions can be life-threatening', 'Be prepared for anaphylaxis'],
      callEmergency: true
    },
    {
      id: '6',
      title: 'Fractures',
      category: 'Trauma',
      severity: 'moderate',
      symptoms: ['Pain and swelling', 'Visible deformity', 'Unable to move affected area'],
      steps: [
        'Do not move the injured person unless necessary',
        'Immobilize the injured area',
        'Apply ice wrapped in cloth',
        'Support the injured area with splint or sling',
        'Monitor for circulation below injury'
      ],
      warnings: ['Do not try to realign broken bones', 'Seek medical attention promptly'],
      callEmergency: false
    }
  ];

  const categories = ['all', ...Array.from(new Set(firstAidGuides.map(guide => guide.category)))];

  const filteredGuides = firstAidGuides.filter(guide => {
    const matchesSearch = guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.symptoms.some(symptom => symptom.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || guide.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'emergency': return 'bg-red-100 text-red-800 border-red-200';
      case 'urgent': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'emergency': return <AlertTriangle className="h-4 w-4" />;
      case 'urgent': return <Clock className="h-4 w-4" />;
      case 'moderate': return <Activity className="h-4 w-4" />;
      default: return <Heart className="h-4 w-4" />;
    }
  };

  const speakInstructions = (guide: FirstAidGuide) => {
    const instructions = guide.steps.join('. ');
    speak(`First aid for ${guide.title}. Steps: ${instructions}`);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 pb-24 md:pb-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            {t('firstAid.title')}
          </h1>
          <p className="text-lg text-slate-600">
            Step-by-step emergency first aid instructions
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder={t('firstAid.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "secondary"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'all' ? 'All Categories' : category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Emergency Warning */}
        <Card className="mb-8 border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-red-100 rounded-full">
                <Phone className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-900 mb-2">
                  {t('firstAid.emergency')}
                </h3>
                <p className="text-red-800">
                  In life-threatening emergencies, call emergency services immediately. 
                  First aid is not a substitute for professional medical care.
                </p>
                <div className="mt-4 flex gap-4">
                  <Button variant="destructive" size="sm">
                    <Phone className="h-4 w-4 mr-2" />
                    Call 911
                  </Button>
                  <Button variant="outline" size="sm">
                    <Heart className="h-4 w-4 mr-2" />
                    Poison Control
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* First Aid Guides */}
        <div className="space-y-6">
          {filteredGuides.map((guide) => (
            <Card key={guide.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-3 mb-2">
                      {getSeverityIcon(guide.severity)}
                      {guide.title}
                      {guide.callEmergency && (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          Call 911
                        </Badge>
                      )}
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">{guide.category}</Badge>
                      <Badge className={getSeverityColor(guide.severity)}>
                        {guide.severity}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => speakInstructions(guide)}
                  >
                    🔊 Listen
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  <AccordionItem value="symptoms">
                    <AccordionTrigger>Symptoms & Signs</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-1">
                        {guide.symptoms.map((symptom, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            {symptom}
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="steps">
                    <AccordionTrigger>First Aid Steps</AccordionTrigger>
                    <AccordionContent>
                      <ol className="space-y-3">
                        {guide.steps.map((step, index) => (
                          <li key={index} className="flex gap-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </div>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="warnings">
                    <AccordionTrigger>Important Warnings</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2">
                        {guide.warnings.map((warning, index) => (
                          <li key={index} className="flex items-start gap-2 text-red-800">
                            <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            {warning}
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredGuides.length === 0 && (
          <div className="text-center py-12">
            <Thermometer className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No guides found</h3>
            <p className="text-slate-600">Try adjusting your search terms or category filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FirstAid;
