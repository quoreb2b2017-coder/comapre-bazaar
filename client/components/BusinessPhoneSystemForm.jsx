'use client';

import React, { useState, useEffect, useRef } from 'react';
import { sendFormData } from './emailService';
import {
  isValidPhoneNumber,
  PHONE_PLACEHOLDER,
  PHONE_VALIDATION_MESSAGE,
  sanitizePhoneInput,
} from '@/lib/phoneValidation';
import {
  QuoteFormCaptchaStep,
  QuoteFormOptionGrid,
  QuoteFormRadioOption,
  QuoteFormShell,
  QuoteFormStepTitle,
  QuoteFormTextField,
} from '@/components/quotes/QuotePopupUi';
import {
  Building,
  Building2,
  Cloud,
  Layers,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Rocket,
  Sparkles,
  TrendingUp,
  User,
  Users,
  UsersRound,
} from '@/lib/quoteFormIcons';

const TOTAL_STEPS = 6;

const PHONE_SYSTEM_ICONS = {
  'Installing new phone system': Rocket,
  'Replacing existing phone system': RefreshCw,
  'Expanding existing phone system': TrendingUp,
};

const PHONES_NEEDED_ICONS = {
  '50+': Building,
  '4-49': UsersRound,
  '1-3': Phone,
};

const BusinessPhoneSystemForm = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    phoneSystemNeeds: '',
    phonesNeeded: '',
    zipCode: '',
    email: '',
    firstName: '',
    lastName: '',
    companyName: '',
    phoneNumber: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);
  const captchaRef = useRef(null);
  
  const [errors, setErrors] = useState({
    zipCode: false,
    phoneNumber: false
  });

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
    
    if (name === 'zipCode' || name === 'phoneNumber') {
      setErrors({
        ...errors,
        [name]: false
      });
    }
    
    if (name === 'zipCode') {
      const zipValue = value.replace(/[^\d]/g, '').slice(0, 5);
      setFormData({
        ...formData,
        [name]: zipValue
      });
      
      if (zipValue.length > 0 && zipValue.length < 5) {
        setErrors({
          ...errors,
          zipCode: true
        });
      }
      return;
    }
    
    if (name === 'phoneNumber') {
      const phoneValue = sanitizePhoneInput(value);

      setFormData({
        ...formData,
        [name]: phoneValue
      });

      if (phoneValue.length > 0 && !isValidPhoneNumber(phoneValue)) {
        setErrors({
          ...errors,
          phoneNumber: true
        });
      }
      return;
    }
    
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleRadioChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const nextStep = () => {
    if (currentStep === 3) {
      if (formData.zipCode.length < 5) {
        setErrors({
          ...errors,
          zipCode: true
        });
        return;
      }
    }
    
    if (currentStep === 5) {
      if (!isValidPhoneNumber(formData.phoneNumber)) {
        setErrors({
          ...errors,
          phoneNumber: true
        });
        return;
      }
    }
    
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const resetForm = () => {
    setFormData({
      phoneSystemNeeds: '',
      phonesNeeded: '',
      zipCode: '',
      email: '',
      firstName: '',
      lastName: '',
      companyName: '',
      phoneNumber: ''
    });
    setCurrentStep(1);
    setCaptchaValue(null);
    setErrors({
      zipCode: false,
      phoneNumber: false
    });
    if (captchaRef.current) {
      captchaRef.current.reset();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const zipCodeValid = formData.zipCode.length === 5;
    const phoneNumberValid = isValidPhoneNumber(formData.phoneNumber);
    
    if (!zipCodeValid || !phoneNumberValid) {
      setErrors({
        zipCode: !zipCodeValid,
        phoneNumber: !phoneNumberValid
      });
      return;
    }
    
    if (!captchaValue) {
      alert('Please complete the reCAPTCHA verification.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await sendFormData(formData, 'Business Phone System Form', captchaValue);
      console.log('Form submitted successfully:', response);
      
      setShowSuccess(true);
      resetForm();
      
      setTimeout(() => {
        window.open('/technology/get-free-quotes', '_blank');
      }, 2000);
      
    } catch (error) {
      console.error('Form submission failed:', error);
      alert('Sorry, there was a problem submitting your information. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <QuoteFormStepTitle title="Which best describes your phone system needs?" />
            <QuoteFormOptionGrid cols={3}>
              {['Installing new phone system', 'Replacing existing phone system', 'Expanding existing phone system'].map((option) => (
                <QuoteFormRadioOption
                  key={option}
                  selected={formData.phoneSystemNeeds === option}
                  onSelect={() => handleRadioChange('phoneSystemNeeds', option)}
                  label={option}
                  icon={PHONE_SYSTEM_ICONS[option] || Phone}
                />
              ))}
            </QuoteFormOptionGrid>
          </div>
        );
        
      case 2:
        return (
          <div>
            <QuoteFormStepTitle title="Approximately how many phones do you need?" />
            <QuoteFormOptionGrid cols={3}>
              {['50+', '4-49', '1-3'].map((option) => (
                <QuoteFormRadioOption
                  key={option}
                  selected={formData.phonesNeeded === option}
                  onSelect={() => handleRadioChange('phonesNeeded', option)}
                  label={option}
                  icon={PHONES_NEEDED_ICONS[option] || Phone}
                />
              ))}
            </QuoteFormOptionGrid>
          </div>
        );
        
      case 3:
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
              error={errors.zipCode ? 'Please enter a valid 5-digit zip code' : undefined}
            />
          </div>
        );
        
      case 4:
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
            />
            <p className="text-xs text-gray-500 mt-2">By entering your email above, you consent to receive marketing emails from compare-bazaar.com.</p>
          </div>
        );
        
      case 5:
        return (
          <div>
            <QuoteFormStepTitle title="Last step! Who do we have the pleasure of working with?" />
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <QuoteFormTextField
                label="First name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="First Name"
                icon={User}
              />
              <QuoteFormTextField
                label="Last name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Last Name"
                icon={User}
              />
              <QuoteFormTextField
                label="Company"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                placeholder="Company Name"
                icon={Building2}
                className="sm:col-span-2"
              />
              <QuoteFormTextField
                label="Phone number"
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder={PHONE_PLACEHOLDER}
                icon={Phone}
                className="sm:col-span-2"
                error={errors.phoneNumber ? PHONE_VALIDATION_MESSAGE : undefined}
              />
            </div>
            <p className="text-xs text-gray-500 mt-3">
              By clicking "Finish" above, I consent to receive from compare-bazaar.com and any party on its behalf at any time e-mails, 
              telemarketing calls using an autodialer, artificial/prerecorded voice or pre-recordings and SMS text messages, which could result 
              in wireless charges at the number provided above. I understand that consent is not a condition of purchase. I also 
              agree to the <a href="/terms-of-use" className="text-[#ff8633] hover:underline">Terms and Conditions</a> and <a href="/privacy-policy" className="text-[#ff8633] hover:underline">Privacy Policy</a> which are also linked at the bottom of this page.
            </p>
          </div>
        );
        
      case 6:
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

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.phoneSystemNeeds !== '';
      case 2:
        return formData.phonesNeeded !== '';
      case 3:
        return formData.zipCode !== '' && formData.zipCode.length === 5 && !errors.zipCode;
      case 4:
        return formData.email !== '' && formData.email.includes('@');
      case 5:
        return formData.firstName !== '' && 
               formData.lastName !== '' && 
               isValidPhoneNumber(formData.phoneNumber) &&
               !errors.phoneNumber;
      case 6:
        return captchaValue !== null;
      default:
        return true;
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

export default BusinessPhoneSystemForm;
