
import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, Heart, Mic, ArrowRight, Activity, Shield, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const Index = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Stethoscope,
      title: t('home.features.diagnosis'),
      description: t('home.features.diagnosis.desc'),
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      icon: Heart,
      title: t('home.features.firstAid'),
      description: t('home.features.firstAid.desc'),
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      icon: Mic,
      title: t('home.features.voice'),
      description: t('home.features.voice.desc'),
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
  ];

  const stats = [
    { icon: Activity, label: 'Symptoms Analyzed', value: '10,000+' },
    { icon: Shield, label: 'Accuracy Rate', value: '95%' },
    { icon: Clock, label: 'Response Time', value: '<30s' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 medical-gradient opacity-10" />
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="slide-in">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              {t('home.title')}
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              {t('home.subtitle')}
            </p>
            <Link to="/diagnosis">
              <Button 
                size="lg" 
                className="medical-gradient text-white px-8 py-4 text-lg font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                {t('home.cta')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 opacity-20">
          <div className="float">
            <div className="w-20 h-20 bg-blue-500 rounded-full blur-xl" />
          </div>
        </div>
        <div className="absolute bottom-20 right-10 opacity-20">
          <div className="float" style={{ animationDelay: '2s' }}>
            <div className="w-16 h-16 bg-green-500 rounded-full blur-xl" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Comprehensive Medical Support
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Advanced AI technology combined with medical expertise to provide you with reliable health guidance
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="slide-in hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <CardContent className="p-8 text-center">
                    <div className={`inline-flex p-4 rounded-full ${feature.bgColor} mb-6`}>
                      <Icon className={`h-8 w-8 ${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex p-3 rounded-full bg-blue-100 mb-4">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-slate-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 medical-gradient">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Experience the future of medical assistance with our AI-powered platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/diagnosis">
              <Button 
                size="lg" 
                variant="secondary"
                className="px-8 py-4 text-lg font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
              >
                Start Diagnosis
              </Button>
            </Link>
            <Link to="/first-aid">
              <Button 
                size="lg" 
                variant="outline"
                className="px-8 py-4 text-lg font-semibold rounded-xl bg-white/10 border-white/20 text-white hover:bg-white/20 hover:shadow-lg transition-all duration-300"
              >
                Emergency Guide
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
