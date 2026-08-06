'use client';

import React, { useState, useEffect, useRef } from 'react';
import { sendFormData } from './emailService';
import {
  isValidPhoneNumber,
  phoneHasError,
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
  Building2,
  CircleHelp,
  FLEET_SIZE_ICONS,
  Mail,
  MapPin,
  Phone,
  Truck,
  User,
  Users,
  VEHICLE_TYPE_ICONS,
} from '@/lib/quoteFormIcons';

const TOTAL_STEPS = 6;

const GPSFleetForm = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fleetSize: '',
    vehicleTypes: [],
    zipCode: '',
    email: '',
    fullName: '',
    companyName: '',
    phoneNumber: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);
  const captchaRef = useRef(null);

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
      [name]: name === 'phoneNumber' ? sanitizePhoneInput(value) : value,
    });
  };

  const handleCheckboxChange = (e) => {
   const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
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
      fleetSize: '',
      vehicleTypes: [],
      zipCode: '',
      email: '',
      fullName: '',
      companyName: '',
      phoneNumber: ''
    });
    setCurrentStep(1);
    setCaptchaValue(null);
    if (captchaRef.current) {
      captchaRef.current.reset();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!captchaValue) {
      alert('Please complete the reCAPTCHA verification.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await sendFormData(formData, 'GPS Fleet Management Form', captchaValue);
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

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <QuoteFormStepTitle title="What is the size of the fleet you are looking to manage?" />
            <QuoteFormOptionGrid cols={3}>
              {['1 - 4', '5 - 9', '10 - 19', '20 - 49', '50 - 99', '100 or more'].map((size) => (
                <QuoteFormRadioOption
                  key={size}
                  selected={formData.fleetSize === size}
                  onSelect={() => handleInputChange({ target: { name: 'fleetSize', value: size } })}
                  label={size}
                  icon={FLEET_SIZE_ICONS[size] || Truck}
                />
              ))}
            </QuoteFormOptionGrid>
          </div>
        );
      case 2:
        return (
          <div>
            <QuoteFormStepTitle title="What do you need to track?" />
            <QuoteFormOptionGrid cols={3}>
              {['Vans or trucks', 'Heavy duty or semi trucks', 'Cars or limousines', 'Trailers', 'Construction machinery', 'Buses', 'Other'].map((type) => (
                <QuoteFormRadioOption
                  key={type}
                  selected={formData.vehicleTypes === type}
                  onSelect={() => handleCheckboxChange({ target: { name: 'vehicleTypes', value: type } })}
                  label={type}
                  icon={VEHICLE_TYPE_ICONS[type] || Factory}
                />
              ))}
            </QuoteFormOptionGrid>
          </div>
        );
      case 3:
        return (
          <div>
            <QuoteFormStepTitle title="Please enter the ZIP / postal code where service is requested." />
            <QuoteFormTextField
              name="zipCode"
              value={formData.zipCode}
              onChange={handleInputChange}
              placeholder="Zip Code"
              maxLength={5}
              icon={MapPin}
            />
          </div>
        );
      case 4:
        return (
          <div>
            <QuoteFormStepTitle title="Good news! We've found suppliers for you. Please tell us where to send your free quotes." />
            <QuoteFormTextField
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              icon={Mail}
            />
            <p className="text-xs text-gray-600 mt-2">We respect your privacy and will securely store your email and will share your request with up to 5 suppliers.</p>
          </div>
        );
      case 5:
        return (
          <div>
            <QuoteFormStepTitle title="Last step! Fill in the last few details to get your free quotes!" />
            <div className="grid grid-cols-1 gap-2">
              <QuoteFormTextField
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Full Name"
                icon={User}
              />
              <QuoteFormTextField
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                placeholder="Company Name"
                icon={Building2}
              />
              <QuoteFormTextField
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder={PHONE_PLACEHOLDER}
                icon={Phone}
                error={phoneHasError(formData.phoneNumber) ? PHONE_VALIDATION_MESSAGE : undefined}
              />
            </div>
            <p className="text-xs text-gray-600 mt-2">
              By clicking "Compare Prices" below, I consent to receive automated marketing or other calls and texts which may use autodialer, prerecorded or artificial voice technology from or on behalf of 360Connect LLC and up to five marketing partners in the phone number provided above, even if my number is listed on any state or national Do Not Call Registry. I understand consent is not a condition of purchase. By clicking "Compare Prices" below, I also agree to 360Connect LLC's Terms of Use, including submitting any disputes to mandatory individual binding arbitration.
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
        return formData.fleetSize !== '';
      case 2:
        return formData.vehicleTypes.length > 0;
      case 3:
        return formData.zipCode !== '';
      case 4:
        return formData.email !== '' && formData.email.includes('@');
      case 5:
        return formData.fullName !== '' && formData.companyName !== '' && isValidPhoneNumber(formData.phoneNumber);
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

export default GPSFleetForm;
