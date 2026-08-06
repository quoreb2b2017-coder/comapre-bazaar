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
  QuoteFormCheckboxOption,
  QuoteFormOptionGrid,
  QuoteFormRadioOption,
  QuoteFormShell,
  QuoteFormStepTitle,
  QuoteFormTextField,
} from '@/components/quotes/QuotePopupUi';
import {
  CRM_EMPLOYEE_ICONS,
  FEATURE_ICONS,
  INDUSTRY_ICONS,
  Building2,
  CheckCircle2,
  Headphones,
  Lightbulb,
  Mail,
  MapPin,
  Phone,
  Target,
  User,
  Users,
} from '@/lib/quoteFormIcons';

const TOTAL_STEPS = 8;

const CRMForm = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    usingCRM: '',
    employeeCountcrm: '',
    importantFeaturescrm: [], // Changed from string to array for multiple selections
    industrycrm: '',
    otherIndustry: '',
    zipCode: '',
    email: '',
    firstName: '',
    lastName: '',
    company: '',
    phoneNumber: '',
  });
  const [errors, setErrors] = useState({
    zipCode: false,
    phoneNumber: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null); // State to track CAPTCHA value
  const captchaRef = useRef(null);

  // Auto-hide success message after 10 seconds
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

    if (name === 'phoneNumber') {
      const phoneValue = sanitizePhoneInput(value);

      setFormData({
        ...formData,
        [name]: phoneValue,
      });

      setErrors((prev) => ({
        ...prev,
        phoneNumber: phoneValue.length > 0 && !isValidPhoneNumber(phoneValue),
      }));
    } else if (name === 'zipCode') {
      // Only allow digits for ZIP code
      const numericValue = value.replace(/\D/g, '');

      // Validate ZIP code (must be 5 digits)
      setErrors((prev) => ({
        ...prev,
        zipCode: numericValue.length > 0 && numericValue.length !== 5,
      }));

      setFormData({
        ...formData,
        [name]: numericValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleRadioChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear the otherIndustry field if industry is not "Other"
    if (name === 'industrycrm' && value !== 'Other') {
      setFormData((prev) => ({
        ...prev,
        otherIndustry: '',
      }));
    }
  };

  // Handle multi-select option toggle
  const handleMultiSelectToggle = (feature) => {
    setFormData((prevData) => {
      if (prevData.importantFeaturescrm.includes(feature)) {
        // Remove the feature
        return {
          ...prevData,
          importantFeaturescrm: prevData.importantFeaturescrm.filter((item) => item !== feature),
        };
      } else {
        // Add the feature
        return {
          ...prevData,
          importantFeaturescrm: [...prevData.importantFeaturescrm, feature],
        };
      }
    });
  };

  const nextStep = () => {
    // Validate current step before proceeding
    if (currentStep === 4) {
      // Validate "Other" industry input if "Other" is selected
      if (formData.industrycrm === 'Other' && !formData.otherIndustry) {
        return;
      }
    }

    if (currentStep === 5) {
      // Validate zip code
      if (formData.zipCode.length !== 5) {
        setErrors((prev) => ({
          ...prev,
          zipCode: true,
        }));
        return;
      }
    }

    if (currentStep === 7) {
      if (!isValidPhoneNumber(formData.phoneNumber)) {
        setErrors((prev) => ({
          ...prev,
          phoneNumber: true,
        }));
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
      usingCRM: '',
      employeeCountcrn: '',
      importantFeaturescrm: [],
      industrycrm: '',
      otherIndustry: '',
      zipCode: '',
      email: '',
      firstName: '',
      lastName: '',
      company: '',
      phoneNumber: '',
    });
    setErrors({
      zipCode: false,
      phoneNumber: false,
    });
    setCurrentStep(1);
    setCaptchaValue(null);
    if (captchaRef.current) {
      captchaRef.current.reset();
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    // Check if reCAPTCHA is completed
    if (!captchaValue) {
      alert('Please complete the reCAPTCHA verification.');
      return;
    }
    
    setIsSubmitting(true);
     try {
                // Prepare the data to send - combine the desired feature with the "Other" text if needed
                let dataToSend = {...formData};
                if (formData.importantFeaturescrm === 'Other') {
                    dataToSend.importantFeaturescrm =`Other: ${formData.otherFeatureText}`;
                }
                
                // Use the emailService to send the form data with Web3Forms
                const response = await sendFormData(dataToSend, 'CRM Form', captchaValue);
                console.log('Form submitted successfully:', response);
                setShowSuccess(true);
                resetForm();
            } catch (error) {
                console.error('Email sending failed:', error);
                alert('Sorry, there was a problem submitting your information. Please try again later.');
            } finally {
                setIsSubmitting(false);
            }
        };
    

    

  const features = [
    'Lead tracking and management',
    'Customer service and success',
    'Sales and forecasting tools',
    '3rd party integrations',
    'Email marketing',
  ];

  const industries = [
    'Construction',
    'Ecommerce',
    'Education',
    'Financial Services',
    'Healthcare',
    'Manufacturing',
    'Professional Services',
    'Real Estate',
    'Retail',
    'Technology',
    'Other',
  ];

  // Validation functions
  const isZipCodeValid = (zipCode) => {
    return /^\d{5}$/.test(zipCode);
  };

  const isPhoneNumberValid = (phoneNumber) => isValidPhoneNumber(phoneNumber);

  // Form step validation
  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.usingCRM !== '';
      case 2:
        return formData.employeeCountcrm !== '';
      case 3:
        return formData.importantFeaturescrm.length > 0;
      case 4:
        return formData.industrycrm !== '' && (formData.industrycrm !== 'Other' || formData.otherIndustry.trim() !== '');
      case 5:
        return formData.zipCode !== '' && isZipCodeValid(formData.zipCode) && !errors.zipCode;
      case 6:
        return formData.email !== '' && formData.email.includes('@');
      case 7:
        return (
          formData.firstName !== '' &&
          formData.lastName !== '' &&
          formData.phoneNumber !== '' &&
          isPhoneNumberValid(formData.phoneNumber) &&
          !errors.phoneNumber
        );
      case 8:
        return captchaValue !== null; // Ensure CAPTCHA is completed
      default:
        return true;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <QuoteFormStepTitle title="Are you currently using a CRM?" />
            <QuoteFormOptionGrid cols={2}>
              <QuoteFormRadioOption
                selected={formData.usingCRM === 'Yes'}
                onSelect={() => handleRadioChange('usingCRM', 'Yes')}
                label="Yes"
                icon={CheckCircle2}
              />
              <QuoteFormRadioOption
                selected={formData.usingCRM === 'No'}
                onSelect={() => handleRadioChange('usingCRM', 'No')}
                label="No"
                icon={Lightbulb}
              />
            </QuoteFormOptionGrid>
          </div>
        );

      case 2:
        return (
          <div>
            <QuoteFormStepTitle title="Roughly how many employees will need access?" />
            <QuoteFormOptionGrid cols={3}>
              {['100+', '50-99', '21-49', '11-20', 'Less than 10'].map((option) => (
                <QuoteFormRadioOption
                  key={option}
                  selected={formData.employeeCountcrm === option}
                  onSelect={() => handleRadioChange('employeeCountcrm', option)}
                  label={option}
                  icon={CRM_EMPLOYEE_ICONS[option] || Users}
                />
              ))}
            </QuoteFormOptionGrid>
          </div>
        );

      case 3:
        return (
          <div>
            <QuoteFormStepTitle
              title="What features are most important for your evaluation?"
              subtitle="Select all that apply. Tap again to deselect."
            />
            <QuoteFormOptionGrid cols={3}>
              {features.map((feature) => (
                <QuoteFormCheckboxOption
                  key={feature}
                  selected={formData.importantFeaturescrm.includes(feature)}
                  onSelect={() => handleMultiSelectToggle(feature)}
                  label={feature}
                  icon={FEATURE_ICONS[feature] || Target}
                />
              ))}
            </QuoteFormOptionGrid>
          </div>
        );

      case 4:
        return (
          <div>
            <QuoteFormStepTitle title="What industry are you in?" />
            <QuoteFormOptionGrid cols={3}>
              {industries.map((industrycrm) => (
                <QuoteFormRadioOption
                  key={industrycrm}
                  selected={formData.industrycrm === industrycrm}
                  onSelect={() => handleRadioChange('industrycrm', industrycrm)}
                  label={industrycrm}
                  icon={INDUSTRY_ICONS[industrycrm] || Building2}
                />
              ))}
            </QuoteFormOptionGrid>

            {formData.industrycrm === 'Other' && (
              <div className="mt-2">
                <QuoteFormTextField
                  label="Please specify your industry"
                  name="otherIndustry"
                  value={formData.otherIndustry}
                  onChange={handleInputChange}
                  placeholder="Enter your industry"
                />
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div>
            <QuoteFormStepTitle title="What's your zip code?" />
            <QuoteFormTextField
              name="zipCode"
              value={formData.zipCode}
              onChange={handleInputChange}
              placeholder="Enter 5-digit zip code"
              maxLength={5}
              icon={MapPin}
              error={errors.zipCode ? 'Please enter a valid 5-digit zip code' : undefined}
            />
          </div>
        );

      case 6:
        return (
          <div>
            <QuoteFormStepTitle title="What's your email address?" />
            <QuoteFormTextField
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="you@company.com"
              icon={Mail}
              error={
                formData.email && !formData.email.includes('@')
                  ? 'Please enter a valid email address'
                  : undefined
              }
            />
          </div>
        );

      case 7:
        return (
          <div>
            <QuoteFormStepTitle title="Tell us about yourself" />
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <QuoteFormTextField
                label="First name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="First name"
                icon={User}
              />
              <QuoteFormTextField
                label="Last name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Last name"
                icon={User}
              />
              <QuoteFormTextField
                label="Company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="Company name"
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
          </div>
        );

      case 8:
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

export default CRMForm;