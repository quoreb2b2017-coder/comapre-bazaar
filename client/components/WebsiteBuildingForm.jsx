'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Layout, Zap } from 'lucide-react';
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
  CalendarClock,
  CheckCircle2,
  CircleHelp,
  Clock,
  Mail,
  MapPin,
  Monitor,
  Phone,
  ShoppingCart,
  Sparkles,
  User,
  Wallet,
  Wrench,
  XCircle,
} from '@/lib/quoteFormIcons';

const TOTAL_STEPS = 12;

const WEBSITE_TYPE_ICONS = {
  'Ecommerce services': ShoppingCart,
  'Web design services': Monitor,
};

const DESIGN_TYPE_ICONS = {
  'New Design': Sparkles,
  Redesign: Layout,
  'Existing site maintainance or upgrade': Wrench,
  Other: CircleHelp,
};

const BUSINESS_TYPE_ICONS = {
  'New Business': Sparkles,
  'Established Business': Building2,
};

const BUDGET_ICONS = {
  '$500-999': Wallet,
  '$1,000-1,499': Wallet,
  '$1,500-2,499': Wallet,
  '$2,500+': Wallet,
};

const DECISION_ICONS = {
  ASAP: Zap,
  'In 1 month': CalendarClock,
  'In 2 months or more': Clock,
};

const US_STATES = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Pennsylvania',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming',
];

const WebsiteBuildingForm = ({ onClose }) => {
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

    wdtypeofwebsite: '',
    wdtypeofdesign: '',
    wdregistered: '',
    wdbusiness: '',
    wdbudget: '',
    wddecision: '',
    wdadditionalFeatures: '',
    streetAddress: '',
    wdstate: 'California',
    wdcity: 'Ashland',
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

      wdtypeofwebsite: '',
      wdtypeofdesign: '',
      wdregistered: '',
      wdbusiness: '',
      wdbudget: '',
      wddecision: '',
      wdadditionalFeatures: '',
      streetAddress: '',
      wdstate: 'California',
      wdcity: 'Ashland',
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
      const response = await sendFormData(formData, 'Website Building Form', captchaValue);
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
        return formData.wdtypeofwebsite !== '';
      case 2:
        return formData.wdtypeofdesign !== '';
      case 3:
        return formData.wdregistered !== '';
      case 4:
        return formData.wdbusiness !== '';
      case 5:
        return formData.wdbudget !== '';
      case 6:
        return formData.wddecision !== '';
      case 7:
        return formData.zipCode !== '' && formData.zipCode.length === 5;
      case 8:
        return formData.email !== '' && formData.email.includes('@');
      case 9:
        return formData.wdadditionalFeatures && formData.wdadditionalFeatures.trim().length > 0;
      case 10:
        return (
          formData.firstName !== '' &&
          formData.lastName !== '' &&
          isValidPhoneNumber(formData.phoneNumber)
        );
      case 11:
        return (
          formData.streetAddress &&
          formData.streetAddress.trim() !== '' &&
          formData.wdcity &&
          formData.wdcity.trim() !== '' &&
          formData.wdstate &&
          formData.wdstate.trim() !== '' &&
          formData.zipCode &&
          formData.zipCode.length === 5
        );
      case 12:
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
            <QuoteFormStepTitle title="Are you interested in cart-based ecommerce services or a general website deisgn project?" />
            <QuoteFormOptionGrid cols={2}>
              {['Ecommerce services', 'Web design services'].map((option) => (
                <QuoteFormRadioOption
                  key={option}
                  selected={formData.wdtypeofwebsite === option}
                  onSelect={() => handleRadioChange('wdtypeofwebsite', option)}
                  label={option}
                  icon={WEBSITE_TYPE_ICONS[option] || Monitor}
                />
              ))}
            </QuoteFormOptionGrid>
          </div>
        );

      case 2:
        return (
          <div>
            <QuoteFormStepTitle title="What type of design services are you considering?" />
            <QuoteFormOptionGrid cols={2}>
              {['New Design', 'Redesign', 'Existing site maintainance or upgrade', 'Other'].map(
                (option) => (
                  <QuoteFormRadioOption
                    key={option}
                    selected={formData.wdtypeofdesign === option}
                    onSelect={() => handleRadioChange('wdtypeofdesign', option)}
                    label={option}
                    icon={DESIGN_TYPE_ICONS[option] || CircleHelp}
                  />
                ),
              )}
            </QuoteFormOptionGrid>
          </div>
        );

      case 3:
        return (
          <div>
            <QuoteFormStepTitle title="Have you registered a domain name for this site?" />
            <QuoteFormOptionGrid cols={2}>
              {['Yes', 'No'].map((option) => (
                <QuoteFormRadioOption
                  key={option}
                  selected={formData.wdregistered === option}
                  onSelect={() => handleRadioChange('wdregistered', option)}
                  label={option}
                  icon={option === 'Yes' ? CheckCircle2 : XCircle}
                />
              ))}
            </QuoteFormOptionGrid>
          </div>
        );

      case 4:
        return (
          <div>
            <QuoteFormStepTitle title="How would you describe your business?" />
            <QuoteFormOptionGrid cols={2}>
              {['New Business', 'Established Business'].map((option) => (
                <QuoteFormRadioOption
                  key={option}
                  selected={formData.wdbusiness === option}
                  onSelect={() => handleRadioChange('wdbusiness', option)}
                  label={option}
                  icon={BUSINESS_TYPE_ICONS[option] || Building2}
                />
              ))}
            </QuoteFormOptionGrid>
          </div>
        );

      case 5:
        return (
          <div>
            <QuoteFormStepTitle title="What is your approximate budget for this project?" />
            <QuoteFormOptionGrid cols={2}>
              {['$500-999', '$1,000-1,499', '$1,500-2,499', '$2,500+'].map((option) => (
                <QuoteFormRadioOption
                  key={option}
                  selected={formData.wdbudget === option}
                  onSelect={() => handleRadioChange('wdbudget', option)}
                  label={option}
                  icon={BUDGET_ICONS[option] || Wallet}
                />
              ))}
            </QuoteFormOptionGrid>
          </div>
        );

      case 6:
        return (
          <div>
            <QuoteFormStepTitle title="When do you anticipate making a decision?" />
            <QuoteFormOptionGrid cols={3}>
              {['ASAP', 'In 1 month', 'In 2 months or more'].map((option) => (
                <QuoteFormRadioOption
                  key={option}
                  selected={formData.wddecision === option}
                  onSelect={() => handleRadioChange('wddecision', option)}
                  label={option}
                  icon={DECISION_ICONS[option] || CalendarClock}
                />
              ))}
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
                  By entering your email above, you consent to receive marketing emails from compare-bazaar.com.
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
          <div>
            <QuoteFormStepTitle title="Please share any additional features or information about your needs." />
            <textarea
              name="wdadditionalFeatures"
              value={formData.wdadditionalFeatures || ''}
              onChange={handleInputChange}
              placeholder="Enter additional features or information"
              className="h-32 w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-cb-orange focus:ring-4 focus:ring-cb-orange-ring"
              maxLength={1000}
            />
            <p className="mt-1.5 text-xs text-gray-500">
              Note: There is a 1000 character limit for this answer.
            </p>
          </div>
        );

      case 10:
        return (
          <div>
            <QuoteFormStepTitle title="Last step! Who do we have the pleasure of working with?" />
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <QuoteFormTextField
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="First Name"
                icon={User}
              />
              <QuoteFormTextField
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Last Name"
                icon={User}
              />
              <QuoteFormTextField
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                placeholder="Company Name"
                icon={Building2}
                className="sm:col-span-2"
              />
              <QuoteFormTextField
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder={PHONE_PLACEHOLDER}
                icon={Phone}
                className="sm:col-span-2"
                error={phoneHasError(formData.phoneNumber) ? PHONE_VALIDATION_MESSAGE : undefined}
              />
            </div>
          </div>
        );

      case 11:
        return (
          <div>
            <QuoteFormStepTitle title="Last step! Tell us where you're located:" />
            <div className="space-y-2">
              <QuoteFormTextField
                name="streetAddress"
                value={formData.streetAddress || ''}
                onChange={handleInputChange}
                placeholder="Your Street Address"
                icon={MapPin}
                error={!formData.streetAddress ? 'This information is required.' : undefined}
              />
              <QuoteFormTextField
                name="wdcity"
                value={formData.wdcity || 'Ashland'}
                onChange={handleInputChange}
                placeholder="City"
                icon={Building2}
              />
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-navy">State</label>
                <select
                  name="wdstate"
                  value={formData.wdstate || 'California'}
                  onChange={handleInputChange}
                  className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 outline-none transition-all focus:border-cb-orange focus:ring-4 focus:ring-cb-orange-ring"
                >
                  {US_STATES.map((stateName) => (
                    <option key={stateName} value={stateName}>
                      {stateName}
                    </option>
                  ))}
                </select>
              </div>
              <QuoteFormTextField
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                placeholder="Zip Code"
                maxLength={5}
                icon={MapPin}
                error={
                  formData.zipCode && formData.zipCode.length < 5
                    ? 'Please enter a valid 5-digit zip code'
                    : undefined
                }
              />
            </div>
          </div>
        );

      case 12:
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

export default WebsiteBuildingForm;
