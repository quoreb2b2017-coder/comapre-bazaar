'use client';

import React, { useState, useEffect, useRef } from 'react';
import { sendFormData } from './emailService';
import {
  QuoteFormCaptchaStep,
  QuoteFormCheckboxOption,
  QuoteFormOptionGrid,
  QuoteFormRadioOption,
  QuoteFormShell,
  QuoteFormStepTitle,
  QuoteFormTextField,
} from '@/components/quotes/QuotePopupUi';
import { BarChart3, Filter, Palette, Shield, Timer, Zap } from 'lucide-react';
import {
  CalendarClock,
  CheckCircle2,
  CircleHelp,
  Clock,
  Cloud,
  Inbox,
  Layers,
  ListChecks,
  Mail,
  MapPin,
  Megaphone,
  Send,
  Sparkles,
  Target,
  Users,
} from '@/lib/quoteFormIcons';

const TOTAL_STEPS = 9;

const EMAIL_LIST_ICONS = {
  'Yes- We already have a list of addresses': ListChecks,
  'No We will have to obtain a list of addresses': Target,
};

const EMAIL_VOLUME_ICONS = {
  'Less than 1000,': Mail,
  '1,000 - 5,000': Send,
  '5,000 - 10,000': Inbox,
  '10,000 - 50,000': Megaphone,
  '50,000 - 100,000': Megaphone,
  '100,000 - 500,000': Megaphone,
  '500,000+': Megaphone,
};

const EMAIL_CAMPAIGN_ICONS = {
  'Not Sure,': CircleHelp,
  'Less than 1 per month': CalendarClock,
  '1-2 times  per month': CalendarClock,
  '3-5 times  per month': Clock,
  '6-10 times  per month': Clock,
  '11+ times  per month': Zap,
};

const OTHER_SERVICES_ICONS = {
  'Not Sure,': CircleHelp,
  'Creative Design': Palette,
  'Creative production': Layers,
  'Database hosting': Cloud,
  'Data cleansing': Filter,
  Others: Sparkles,
};

const EMAIL_FEATURE_ICONS = {
  'Reporting on open and click-through rates, bad email addresses, unsubscribe notices etc.': BarChart3,
  'Response tracking per campaign recipient': Target,
  'Built in CAN_SPAM Compliance Features': Shield,
  'Ability to send email in multiple formats (HTML, plain text, AOL Mail)': Mail,
  'Automatic bounce-back filtering': Filter,
  'Configurable Demographic Records & Segmentation Filters': Users,
  'List export features (opt-out lists, responder lists, etc)': Layers,
  'Dynamic content capabilities': Sparkles,
  'Timed release emails': Timer,
  'Event/Trigger Based-Emails': Zap,
  Others: CircleHelp,
};

const BUYING_TIME_ICONS = {
  Immediately: Zap,
  'Within 1 month': CalendarClock,
  'Within 2 months': Clock,
  'More than 2 months': Clock,
  'Not Sure': CircleHelp,
};

const EmailMarketingForm = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    emailList: '',
    emailVolume: '',
    emailCampaign: '',
    otherServices: '',
    buyingTime: '',
    featureswithEmail: [],
    zipCode: '',
    email: '',
    customService: '',
    firstName: '',
    lastName: '',
    companyName: '',
    phoneNumber: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);
  const captchaRef = useRef(null);

  const handleCheckboxChange = (name, value) => {
    setFormData((prev) => {
      const currentValues = Array.isArray(prev[name]) ? [...prev[name]] : [];
      if (currentValues.includes(value)) {
        return {
          ...prev,
          [name]: currentValues.filter((item) => item !== value),
        };
      }
      return {
        ...prev,
        [name]: [...currentValues, value],
      };
    });
  };

  useEffect(() => {
    let timer;
    if (showSuccess) {
      timer = setTimeout(() => {
        setShowSuccess(false);
        if (onClose) onClose();
      }, 10000);
    }
    return () => clearTimeout(timer);
  }, [showSuccess, onClose]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRadioChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const resetForm = () => {
    setFormData({
      emailList: '',
      emailVolume: '',
      emailCampaign: '',
      otherServices: '',
      buyingTime: '',
      featureswithEmail: [],
      zipCode: '',
      customService: '',
      email: '',
      firstName: '',
      lastName: '',
      companyName: '',
      phoneNumber: '',
    });
    setCurrentStep(1);
    setCaptchaValue(null);
    if (captchaRef.current) {
      captchaRef.current.reset();
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!captchaValue) {
      alert('Please complete the reCAPTCHA verification.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await sendFormData(formData, 'Email Marketing Form', captchaValue);
      console.log('Form submitted successfully:', response);
      setShowSuccess(true);
      resetForm();
    } catch (error) {
      console.error('Form submission failed:', error);
      alert('Sorry, there was a problem submitting your information. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.emailList !== '';
      case 2:
        return formData.emailVolume !== '';
      case 3:
        return formData.emailCampaign !== '';
      case 4:
        return formData.otherServices !== '';
      case 5:
        return Array.isArray(formData.featureswithEmail) && formData.featureswithEmail.length > 0;
      case 6:
        return formData.buyingTime !== '';
      case 7:
        return formData.zipCode !== '' && formData.zipCode.length === 5;
      case 8:
        return formData.email !== '' && formData.email.includes('@');
      case 9:
        return captchaValue !== null;
      default:
        return true;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <QuoteFormStepTitle title="Do You have a list of email addresses for your email marketing campaigns" />
            <QuoteFormOptionGrid cols={2}>
              {[
                'Yes- We already have a list of addresses',
                'No We will have to obtain a list of addresses',
              ].map((option) => (
                <QuoteFormRadioOption
                  key={option}
                  selected={formData.emailList === option}
                  onSelect={() => handleRadioChange('emailList', option)}
                  label={option}
                  icon={EMAIL_LIST_ICONS[option] || CheckCircle2}
                />
              ))}
            </QuoteFormOptionGrid>
          </div>
        );

      case 2:
        return (
          <div>
            <QuoteFormStepTitle title="Approximately how many individual emails will you be sending per mailing??" />
            <QuoteFormOptionGrid cols={3}>
              {[
                'Less than 1000,',
                '1,000 - 5,000',
                '5,000 - 10,000',
                '10,000 - 50,000',
                '50,000 - 100,000',
                '100,000 - 500,000',
                '500,000+',
              ].map((option) => (
                <QuoteFormRadioOption
                  key={option}
                  selected={formData.emailVolume === option}
                  onSelect={() => handleRadioChange('emailVolume', option)}
                  label={option}
                  icon={EMAIL_VOLUME_ICONS[option] || Megaphone}
                />
              ))}
            </QuoteFormOptionGrid>
          </div>
        );

      case 3:
        return (
          <div>
            <QuoteFormStepTitle title="Approximately how often will you send out email campaigns??" />
            <QuoteFormOptionGrid cols={3}>
              {[
                'Not Sure,',
                'Less than 1 per month',
                '1-2 times  per month',
                '3-5 times  per month',
                '6-10 times  per month',
                '11+ times  per month',
              ].map((option) => (
                <QuoteFormRadioOption
                  key={option}
                  selected={formData.emailCampaign === option}
                  onSelect={() => handleRadioChange('emailCampaign', option)}
                  label={option}
                  icon={EMAIL_CAMPAIGN_ICONS[option] || CalendarClock}
                />
              ))}
            </QuoteFormOptionGrid>
          </div>
        );

      case 4:
        return (
          <div>
            <QuoteFormStepTitle title="What additional email services are you interested in?" />
            <QuoteFormOptionGrid cols={3}>
              {[
                'Not Sure,',
                'Creative Design',
                'Creative production',
                'Database hosting',
                'Data cleansing',
                'Others',
              ].map((option) => (
                <QuoteFormRadioOption
                  key={option}
                  selected={formData.otherServices === option}
                  onSelect={() => handleRadioChange('otherServices', option)}
                  label={option}
                  icon={OTHER_SERVICES_ICONS[option] || CircleHelp}
                />
              ))}
            </QuoteFormOptionGrid>
            {formData.otherServices === 'Others' && (
              <div className="mt-2">
                <QuoteFormTextField
                  name="customService"
                  value={formData.customService || ''}
                  onChange={handleInputChange}
                  placeholder="Please specify your service requirements"
                />
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div>
            <QuoteFormStepTitle
              title="Which features do you need with your email marketing services or software?"
              subtitle="Select all that apply. Tap again to deselect."
            />
            <div className="max-h-64 overflow-y-auto pr-1 md:max-h-96">
              <QuoteFormOptionGrid cols={2}>
                {[
                  'Reporting on open and click-through rates, bad email addresses, unsubscribe notices etc.',
                  'Response tracking per campaign recipient',
                  'Built in CAN_SPAM Compliance Features',
                  'Ability to send email in multiple formats (HTML, plain text, AOL Mail)',
                  'Automatic bounce-back filtering',
                  'Configurable Demographic Records & Segmentation Filters',
                  'List export features (opt-out lists, responder lists, etc)',
                  'Dynamic content capabilities',
                  'Timed release emails',
                  'Event/Trigger Based-Emails',
                  'Others',
                ].map((option) => (
                  <QuoteFormCheckboxOption
                    key={option}
                    selected={
                      Array.isArray(formData.featureswithEmail) &&
                      formData.featureswithEmail.includes(option)
                    }
                    onSelect={() => handleCheckboxChange('featureswithEmail', option)}
                    label={option}
                    icon={EMAIL_FEATURE_ICONS[option] || CircleHelp}
                  />
                ))}
              </QuoteFormOptionGrid>
            </div>
          </div>
        );

      case 6:
        return (
          <div>
            <QuoteFormStepTitle title="When are you planning to make your buying decision for these email marketing products or services?" />
            <QuoteFormOptionGrid cols={3}>
              {['Immediately', 'Within 1 month', 'Within 2 months', 'More than 2 months', 'Not Sure'].map(
                (option) => (
                  <QuoteFormRadioOption
                    key={option}
                    selected={formData.buyingTime === option}
                    onSelect={() => handleRadioChange('buyingTime', option)}
                    label={option}
                    icon={BUYING_TIME_ICONS[option] || CalendarClock}
                  />
                ),
              )}
            </QuoteFormOptionGrid>
          </div>
        );

      case 7:
        return (
          <div>
            <QuoteFormStepTitle title="What's your zip code?" />
            <QuoteFormTextField
              name="zipCode"
              value={formData.zipCode}
              onChange={handleInputChange}
              placeholder="Enter zip code"
              maxLength={5}
              icon={MapPin}
              error={
                formData.zipCode && formData.zipCode.length < 5
                  ? 'Please enter a valid 5-digit zip code'
                  : undefined
              }
            />
          </div>
        );

      case 8:
        return (
          <div>
            <QuoteFormStepTitle title="What's your email address?" />
            <QuoteFormTextField
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email Address"
              icon={Mail}
              hint={
                <>
                  By entering your email above, you consent to receive marketing emails from Compare-Bazaar.
                  <a href="/terms-of-use" className="text-cb-orange hover:underline">
                    Terms and Conditions
                  </a>{' '}
                  and{' '}
                  <a href="/privacy-policy" className="text-cb-orange hover:underline">
                    Privacy Policy
                  </a>{' '}
                  which are also linked at the bottom of this page.
                </>
              }
            />
          </div>
        );

      case 9:
        return (
          <QuoteFormCaptchaStep
            captchaRef={captchaRef}
            captchaValue={captchaValue}
            onChange={(value) => setCaptchaValue(value)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <QuoteFormShell
      totalSteps={TOTAL_STEPS}
      currentStep={currentStep}
      showSuccess={showSuccess}
      onCloseSuccess={() => setShowSuccess(false)}
      onSubmit={handleSubmit}
      isStepValid={isStepValid}
      isSubmitting={isSubmitting}
      onBack={prevStep}
      onNext={nextStep}
      backDisabled={isSubmitting}
    >
      {renderStep()}
    </QuoteFormShell>
  );
};

export default EmailMarketingForm;
