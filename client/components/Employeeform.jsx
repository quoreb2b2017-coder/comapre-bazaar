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
  Activity,
  Building,
  Building2,
  CircleHelp,
  Eye,
  Keyboard,
  Mail,
  MapPin,
  Monitor,
  Phone,
  ScanLine,
  User,
  Users,
  UsersRound,
} from '@/lib/quoteFormIcons';

const TOTAL_STEPS = 6;

const EMPLOYEE_COUNT_OPTIONS = ['1-19', '20-49', '50-99', '100-499', '500+'];

const EMPLOYEE_COUNT_ICONS = {
  '1-19': User,
  '20-49': Users,
  '50-99': UsersRound,
  '100-499': Building,
  '500+': Building2,
};

const FEATURE_ICONS = {
  'User behavior monitoring/logging': Eye,
  'User behavior analysis': Activity,
  'Screen capture': Monitor,
  'Keystroke logging': Keyboard,
  'Application/network/browsing activity': ScanLine,
  'Email monitoring and recording': Mail,
  Other: CircleHelp,
  'Not sure': CircleHelp,
};

const Employeeform = ({ onClose }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        employeeCount: '',
        desiredFeatures: '',
        otherFeatureText: '',
        zipCode: '',
        email: '',
        firstName: '',
        lastName: '',
        companyName: '',
        phoneNumber: '',
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
            [name]: value,
            ...(name === 'desiredFeatures' && value !== 'Other' ? { otherFeatureText: '' } : {})
        });
    };

    const nextStep = () => {
      if (currentStep === 2) {
        if (formData.desiredFeatures === 'Other' && !formData.otherFeatureText.trim()) {
          alert("Please specify your desired feature");
          return;
        }
      }
      
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
            employeeCount: '',
            desiredFeatures: '',
            otherFeatureText: '',
            zipCode: '',
            email: '',
            firstName: '',
            lastName: '',
            companyName: '',
            phoneNumber: '',
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
        
        if (formData.desiredFeatures === 'Other' && !formData.otherFeatureText.trim()) {
          alert("Please specify your desired feature");
          return;
        }
        
        if (!captchaValue) {
            alert('Please complete the reCAPTCHA verification.');
            return;
        }
        
        setIsSubmitting(true);

        try {
            let dataToSend = {...formData};
            if (formData.desiredFeatures === 'Other') {
                dataToSend.desiredFeatures =`Other: ${formData.otherFeatureText}`;
            }
            
            const response = await sendFormData(dataToSend, 'Employee Management Form', captchaValue);
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
                        <QuoteFormStepTitle title="Approximately how many employees do you have?" />
                        <QuoteFormOptionGrid cols={3}>
                            {EMPLOYEE_COUNT_OPTIONS.map((option) => (
                                <QuoteFormRadioOption
                                    key={option}
                                    selected={formData.employeeCount === option}
                                    onSelect={() => handleRadioChange('employeeCount', option)}
                                    label={option}
                                    icon={EMPLOYEE_COUNT_ICONS[option] || Users}
                                />
                            ))}
                        </QuoteFormOptionGrid>
                    </div>
                );

            case 2:
                return (
                    <div>
                        <QuoteFormStepTitle title="Are there specific features you are considering?" />
                        <QuoteFormOptionGrid cols={3}>
                            {[
                                'User behavior monitoring/logging',
                                'User behavior analysis',
                                'Screen capture',
                                'Keystroke logging',
                                'Application/network/browsing activity',
                                'Email monitoring and recording',
                                'Other',
                                'Not sure'
                            ].map((option) => (
                                <QuoteFormRadioOption
                                    key={option}
                                    selected={formData.desiredFeatures === option}
                                    onSelect={() => handleRadioChange('desiredFeatures', option)}
                                    label={option}
                                    icon={FEATURE_ICONS[option] || Monitor}
                                />
                            ))}
                        </QuoteFormOptionGrid>

                        {formData.desiredFeatures === 'Other' && (
                            <div className="mt-2">
                                <QuoteFormTextField
                                    label="Please specify your desired feature"
                                    name="otherFeatureText"
                                    value={formData.otherFeatureText}
                                    onChange={handleInputChange}
                                    placeholder="Please specify your desired feature"
                                />
                            </div>
                        )}
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
                        <p className="text-xs text-gray-500 mt-2">By entering your email above, you consent to receive marketing emails from Compare-Bazaar.</p>
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
                return formData.employeeCount !== '';
            case 2:
                if (formData.desiredFeatures === 'Other') {
                    return formData.otherFeatureText.trim() !== '';
                }
                return formData.desiredFeatures !== '';
            case 3:
                return formData.zipCode !== '' && formData.zipCode.length === 5;
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

export default Employeeform;
