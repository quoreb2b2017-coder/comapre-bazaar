'use client';

import React, { useState, useEffect, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { sendFormData } from './emailService';

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
      // Format phone number as +XX followed by 10 digits
      let phoneValue = value.replace(/[^\d+]/g, '');

      // Ensure it starts with +
      if (!phoneValue.startsWith('+') && phoneValue.length > 0) {
        phoneValue = '+' + phoneValue;
      }

      // Format as +XX followed by 10 digits
      if (phoneValue.length > 1) {
        const countryCode = phoneValue.slice(0, 3); // +XX
        const number = phoneValue.slice(3).replace(/\s/g, ''); // Remove any spaces

        phoneValue = countryCode + number;
      }

      setFormData({
        ...formData,
        [name]: phoneValue,
      });

      // Validate phone number format using regex
      const phoneRegex = /^\+\d{2}\d{10}$/;
      setErrors((prev) => ({
        ...prev,
        phoneNumber: phoneValue.length > 0 && !phoneRegex.test(phoneValue),
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
      // Validate phone number
      const phoneRegex = /^\+\d{2}\d{10}$/;
      if (!phoneRegex.test(formData.phoneNumber)) {
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

  const isPhoneNumberValid = (phoneNumber) => {
    return /^\+\d{2}\d{10}$/.test(phoneNumber);
  };

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
            <h2 className="text-base font-semibold mb-3 text-center">Are you currently using a CRM?</h2>
            <div className="space-y-2">
              <label
                className={`block p-3 rounded-md bg-blue-50 cursor-pointer ${
                  formData.usingCRM === 'Yes' ? 'border-2 border-[#ff8633]' : ''
                }`}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="usingCRM"
                    value="Yes"
                    checked={formData.usingCRM === 'Yes'}
                    onChange={() => handleRadioChange('usingCRM', 'Yes')}
                    className="opacity-0 absolute"
                  />
                  <div
                    className={`w-4 h-4 border rounded-full flex items-center justify-center ${
                      formData.usingCRM === 'Yes' ? 'bg-[#ff8633] border-[#ff8633]' : 'border-gray-400 bg-white'
                    }`}
                  >
                    {formData.usingCRM === 'Yes' && <div className="w-2 h-2 rounded-full bg-white"></div>}
                  </div>
                  <span className="ml-2 text-sm">Yes</span>
                </div>
              </label>

              <label
                className={`block p-3 rounded-md bg-blue-50 cursor-pointer ${
                  formData.usingCRM === 'No' ? 'border-2 border-[#ff8633]' : ''
                }`}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="usingCRM"
                    value="No"
                    checked={formData.usingCRM === 'No'}
                    onChange={() => handleRadioChange('usingCRM', 'No')}
                    className="opacity-0 absolute"
                  />
                  <div
                    className={`w-4 h-4 border rounded-full flex items-center justify-center ${
                      formData.usingCRM === 'No' ? 'bg-[#ff8633] border-[#ff8633]' : 'border-gray-400 bg-white'
                    }`}
                  >
                    {formData.usingCRM === 'No' && <div className="w-2 h-2 rounded-full bg-white"></div>}
                  </div>
                  <span className="ml-2 text-sm">No</span>
                </div>
              </label>
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <h2 className="text-base font-semibold mb-3">Roughly how many employees will need access?</h2>
            <div className="space-y-2">
              {['100+', '50-99', '21-49', '11-20', 'Less than 10'].map((option) => (
                <label
                  key={option}
                  className={`block p-3 rounded-md bg-blue-50 cursor-pointer ${
                    formData.employeeCountcrm === option ? 'border-2 border-[#ff8633]' : ''
                  }`}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="employeeCountcrm"
                      value={option}
                      checked={formData.employeeCountcrm === option}
                      onChange={() => handleRadioChange('employeeCountcrm', option)}
                      className="opacity-0 absolute"
                    />
                    <div
                      className={`w-4 h-4 border rounded-full flex items-center justify-center ${
                        formData.employeeCountcrm === option ? 'bg-[#ff8633] border-[#ff8633]' : 'border-gray-400 bg-white'
                      }`}
                    >
                      {formData.employeeCountcrm === option && <div className="w-2 h-2 rounded-full bg-white"></div>}
                    </div>
                    <span className="ml-2 text-sm">{option}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <h2 className="text-base font-semibold mb-3">What features are most important for your evaluation?</h2>
            <p className="text-sm text-gray-600 mb-3">Select all that apply. Double-click to deselect.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {features.map((feature) => (
                <div
                  key={feature}
                  className={`block p-3 rounded-md bg-blue-50 cursor-pointer ${
                    formData.importantFeaturescrm.includes(feature) ? 'border-2 border-[#ff8633]' : ''
                  }`}
                  onClick={() => handleMultiSelectToggle(feature)}
                  onDoubleClick={() => {
                    if (formData.importantFeaturescrm.includes(feature)) {
                      handleMultiSelectToggle(feature);
                    }
                  }}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-4 h-4 border ${
                        formData.importantFeaturescrm.includes(feature)
                          ? 'bg-[#ff8633] border-[#ff8633]'
                          : 'border-gray-400 bg-white'
                      } rounded flex items-center justify-center`}
                    >
                      {formData.importantFeaturescrm.includes(feature) && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                        </svg>
                      )}
                    </div>
                    <span className="ml-2 text-sm">{feature}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div>
            <h2 className="text-base font-semibold mb-3">What industry are you in?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {industries.map((industrycrm) => (
                <label
                  key={industrycrm}
                  className={`block p-3 rounded-md bg-blue-50 cursor-pointer ${
                    formData.industrycrm === industrycrm ? 'border-2 border-[#ff8633]' : ''
                  }`}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="industrycrm"
                      value={industrycrm}
                      checked={formData.industrycrm === industrycrm}
                      onChange={() => handleRadioChange('industrycrm', industrycrm)}
                      className="opacity-0 absolute"
                    />
                    <div
                      className={`w-4 h-4 border rounded-full flex items-center justify-center ${
                        formData.industrycrm === industrycrm ? 'bg-[#ff8633] border-[#ff8633]' : 'border-gray-400 bg-white'
                      }`}
                    >
                      {formData.industrycrm === industrycrm && <div className="w-2 h-2 rounded-full bg-white"></div>}
                    </div>
                    <span className="ml-2 text-sm">{industrycrm}</span>
                  </div>
                </label>
              ))}
            </div>

            {/* Show "Other" input field if "Other" is selected */}
            {formData.industrycrm === 'Other' && (
              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">Please specify your industry</label>
                <input
                  type="text"
                  name="otherIndustry"
                  value={formData.otherIndustry}
                  onChange={handleInputChange}
                  placeholder="Enter your industry"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff8633]"
                />
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div>
            <h2 className="text-base font-semibold mb-3">What's your zip code?</h2>
            <div className="mb-4">
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                placeholder="Enter your zip code"
                maxLength="5"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff8633] ${
                  errors.zipCode ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.zipCode && (
                <p className="text-red-500 text-sm mt-1">Please enter a valid 5-digit zip code</p>
              )}
            </div>
          </div>
        );

      case 6:
        return (
          <div>
            <h2 className="text-base font-semibold mb-3">What's your email address?</h2>
            <div className="mb-4">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff8633] ${
                  formData.email && !formData.email.includes('@') ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {formData.email && !formData.email.includes('@') && (
                <p className="text-red-500 text-sm mt-1">Please enter a valid email address</p>
              )}
            </div>
          </div>
        );

      case 7:
        return (
          <div>
            <h2 className="text-base font-semibold mb-3">Tell us about yourself</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter your first name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff8633]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter your last name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff8633]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Company</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Enter your company name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff8633]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="+XX1234567890"
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff8633] ${
                    errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">Please enter a valid phone number (+XX followed by 10 digits)</p>
                )}
              </div>
            </div>
          </div>
        );

      case 8:
        return (
          <div>
            <h2 className="text-base font-semibold mb-3">Verify you're not a robot</h2>
            <div className="flex justify-center mb-4">
              {captchaValue ? (
                <div className="flex items-center justify-center gap-2 p-4 bg-green-50 border border-green-200 rounded-md">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-green-600 font-semibold">Verified</span>
                </div>
              ) : (
                <ReCAPTCHA
                  ref={captchaRef}
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                  onChange={(value) => setCaptchaValue(value)}
                />
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg overflow-hidden">
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm w-full border-l-4 border-[#ff8633] z-1000 slide-in-right">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-[#ff8633]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="ml-3 w-0 flex-1">
              <h3 className="text-base font-medium text-gray-900">Thank you!</h3>
              <p className="mt-1 text-xs text-gray-500">
                Your submission has been received. We will get back to you soon.
              </p>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                onClick={() => setShowSuccess(false)}
                className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <span className="sr-only">Close</span>
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="p-6">
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div
              className="bg-[#ff8633] h-2 rounded-full transition-all duration-300"
              style={{ width:` ${(currentStep / 8) * 100}%`}}
            ></div>
          </div>

          {/* Step content */}
          {renderStep()}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-6">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Back
              </button>
            )}

            {currentStep < 8 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={!isStepValid()}
                className={`px-4 py-2 rounded-md ml-auto transition-colors ${
                  isStepValid() ? 'bg-[#ff8633] text-white hover:bg-[#e67a2e]' : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={!captchaValue || isSubmitting} // Disable if CAPTCHA is not completed
                className={`px-4 py-2 rounded-md ml-auto transition-colors ${
                  !captchaValue || isSubmitting ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#ff8633] text-white hover:bg-[#e67a2e]'
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Add CSS for slide-in animation */}
      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .slide-in-right {
          animation: slideInRight 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default CRMForm;