'use client';

import React, { useState, useEffect, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { sendFormData } from './emailService';

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
  const [captchaValue, setCaptchaValue] = useState(null); // State for CAPTCHA value
  const captchaRef = useRef(null); // Ref for CAPTCHA component
  
  // Add validation state
  const [errors, setErrors] = useState({
    zipCode: false,
    phoneNumber: false
  });

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
    
    // Clear errors when user starts typing
    if (name === 'zipCode' || name === 'phoneNumber') {
      setErrors({
        ...errors,
        [name]: false
      });
    }
    
    // Handle zipCode validation - only allow numbers and max 5 digits
    if (name === 'zipCode') {
      const zipValue = value.replace(/[^\d]/g, '').slice(0, 5);
      setFormData({
        ...formData,
        [name]: zipValue
      });
      
      // Set error if length is less than 5 and user has entered something
      if (zipValue.length > 0 && zipValue.length < 5) {
        setErrors({
          ...errors,
          zipCode: true
        });
      }
      return;
    }
    
    // Handle phoneNumber validation - format as +XX followed by 10 digits
    if (name === 'phoneNumber') {
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
        [name]: phoneValue
      });
      
      // Validate phone number format
      const phoneRegex = /^\+\d{2}\d{10}$/;
      if (phoneValue.length > 0 && !phoneRegex.test(phoneValue)) {
        setErrors({
          ...errors,
          phoneNumber: true
        });
      }
      return;
    }
    
    // Default handler for other fields
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
    // Validate current step before proceeding
    if (currentStep === 3) {
      // Validate zip code
      if (formData.zipCode.length < 5) {
        setErrors({
          ...errors,
          zipCode: true
        });
        return;
      }
    }
    
    if (currentStep === 5) {
      // Validate phone number
      const phoneRegex = /^\+\d{2}\d{10}$/;
      if (!phoneRegex.test(formData.phoneNumber)) {
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
    setCaptchaValue(null); // Reset CAPTCHA value
    setErrors({
      zipCode: false,
      phoneNumber: false
    });
    if (captchaRef.current) {
      captchaRef.current.reset(); // Reset CAPTCHA widget
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Final validation
    const zipCodeValid = formData.zipCode.length === 5;
    const phoneRegex = /^\+\d{2}\d{10}$/;
    const phoneNumberValid = phoneRegex.test(formData.phoneNumber);
    
    if (!zipCodeValid || !phoneNumberValid) {
      setErrors({
        zipCode: !zipCodeValid,
        phoneNumber: !phoneNumberValid
      });
      return;
    }
    
    // Check if reCAPTCHA is completed
    if (!captchaValue) {
      alert('Please complete the reCAPTCHA verification.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Use the emailService to send the form data with Web3Forms
      const response = await sendFormData(formData, 'Business Phone System Form', captchaValue);
      console.log('Form submitted successfully:', response);
      
      // Show success message and reset form
      setShowSuccess(true);
      resetForm();
      
      // Redirect to quotes page after successful submission
      setTimeout(() => {
        window.open('/Technology/business-phone-systems/get-free-quotes', '_blank');
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
            <h2 className="text-base font-semibold mb-3">Which best describes your phone system needs?</h2>
            <div className="space-y-2">
              <div 
                className={`p-3 rounded-md bg-blue-50 cursor-pointer ${formData.phoneSystemNeeds === 'Installing new phone system' ? 'border-2 border-[#ff8633]' : ''}`}
                onClick={() => handleRadioChange('phoneSystemNeeds', 'Installing new phone system')}
              >
                <label className="flex items-center cursor-pointer">
                  <div className="relative flex items-center justify-center">
                    <input 
                      type="radio" 
                      name="phoneSystemNeeds" 
                      className="sr-only"
                      checked={formData.phoneSystemNeeds === 'Installing new phone system'}
                      onChange={() => {}}
                    />
                    <div className={`w-4 h-4 border rounded-full flex items-center justify-center ${formData.phoneSystemNeeds === 'Installing new phone system' ? 'bg-[#ff8633] border-[#ff8633]' : 'border-gray-400 bg-white'}`}>
                      {formData.phoneSystemNeeds === 'Installing new phone system' && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                  </div>
                  <span className="ml-2 text-sm">Installing new phone system</span>
                </label>
              </div>
              
              <div 
                className={`p-3 rounded-md bg-blue-50 cursor-pointer ${formData.phoneSystemNeeds === 'Replacing existing phone system' ? 'border-2 border-[#ff8633]' : ''}`}
                onClick={() => handleRadioChange('phoneSystemNeeds', 'Replacing existing phone system')}
              >
                <label className="flex items-center cursor-pointer">
                  <div className="relative flex items-center justify-center">
                    <input 
                      type="radio" 
                      name="phoneSystemNeeds" 
                      className="sr-only"
                      checked={formData.phoneSystemNeeds === 'Replacing existing phone system'}
                      onChange={() => {}}
                    />
                    <div className={`w-4 h-4 border rounded-full flex items-center justify-center ${formData.phoneSystemNeeds === 'Replacing existing phone system' ? 'bg-[#ff8633] border-[#ff8633]' : 'border-gray-400 bg-white'}`}>
                      {formData.phoneSystemNeeds === 'Replacing existing phone system' && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                  </div>
                  <span className="ml-2 text-sm">Replacing existing phone system</span>
                </label>
              </div>
              
              <div 
                className={`p-3 rounded-md bg-blue-50 cursor-pointer ${formData.phoneSystemNeeds === 'Expanding existing phone system' ? 'border-2 border-[#ff8633]' : ''}`}
                onClick={() => handleRadioChange('phoneSystemNeeds', 'Expanding existing phone system')}
              >
                <label className="flex items-center cursor-pointer">
                  <div className="relative flex items-center justify-center">
                    <input 
                      type="radio" 
                      name="phoneSystemNeeds" 
                      className="sr-only"
                      checked={formData.phoneSystemNeeds === 'Expanding existing phone system'}
                      onChange={() => {}}
                    />
                    <div className={`w-4 h-4 border rounded-full flex items-center justify-center ${formData.phoneSystemNeeds === 'Expanding existing phone system' ? 'bg-[#ff8633] border-[#ff8633]' : 'border-gray-400 bg-white'}`}>
                      {formData.phoneSystemNeeds === 'Expanding existing phone system' && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                  </div>
                  <span className="ml-2 text-sm">Expanding existing phone system</span>
                </label>
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div>
            <h2 className="text-base font-semibold mb-3">Approximately how many phones do you need?</h2>
            <div className="space-y-2">
              <div 
                className={`p-3 rounded-md bg-blue-50 cursor-pointer ${formData.phonesNeeded === '50+' ? 'border-2 border-[#ff8633]' : ''}`}
                onClick={() => handleRadioChange('phonesNeeded', '50+')}
              >
                <label className="flex items-center cursor-pointer">
                  <div className="relative flex items-center justify-center">
                    <input 
                      type="radio" 
                      name="phonesNeeded" 
                      className="sr-only"
                      checked={formData.phonesNeeded === '50+'}
                      onChange={() => {}}
                    />
                    <div className={`w-4 h-4 border rounded-full flex items-center justify-center ${formData.phonesNeeded === '50+' ? 'bg-[#ff8633] border-[#ff8633]' : 'border-gray-400 bg-white'}`}>
                      {formData.phonesNeeded === '50+' && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                  </div>
                  <span className="ml-2 text-sm">50+</span>
                </label>
              </div>
              
              <div 
                className={`p-3 rounded-md bg-blue-50 cursor-pointer ${formData.phonesNeeded === '4-49' ? 'border-2 border-[#ff8633]' : ''}`}
                onClick={() => handleRadioChange('phonesNeeded', '4-49')}
              >
                <label className="flex items-center cursor-pointer">
                  <div className="relative flex items-center justify-center">
                    <input 
                      type="radio" 
                      name="phonesNeeded" 
                      className="sr-only"
                      checked={formData.phonesNeeded === '4-49'}
                      onChange={() => {}}
                    />
                    <div className={`w-4 h-4 border rounded-full flex items-center justify-center ${formData.phonesNeeded === '4-49' ? 'bg-[#ff8633] border-[#ff8633]' : 'border-gray-400 bg-white'}`}>
                      {formData.phonesNeeded === '4-49' && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                  </div>
                  <span className="ml-2 text-sm">4-49</span>
                </label>
              </div>
              
              <div 
                className={`p-3 rounded-md bg-blue-50 cursor-pointer ${formData.phonesNeeded === '1-3' ? 'border-2 border-[#ff8633]' : ''}`}
                onClick={() => handleRadioChange('phonesNeeded', '1-3')}
              >
                <label className="flex items-center cursor-pointer">
                  <div className="relative flex items-center justify-center">
                    <input 
                      type="radio" 
                      name="phonesNeeded" 
                      className="sr-only"
                      checked={formData.phonesNeeded === '1-3'}
                      onChange={() => {}}
                    />
                    <div className={`w-4 h-4 border rounded-full flex items-center justify-center ${formData.phonesNeeded === '1-3' ? 'bg-[#ff8633] border-[#ff8633]' : 'border-gray-400 bg-white'}`}>
                      {formData.phonesNeeded === '1-3' && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                  </div>
                  <span className="ml-2 text-sm">1-3</span>
                </label>
              </div>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div>
            <h2 className="text-base font-semibold mb-3">What's your zip code?</h2>
            <div className="relative">
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                placeholder="Enter zip code"
                className={`w-full p-2 border ${errors.zipCode ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 ${errors.zipCode ? 'focus:ring-red-500' : 'focus:ring-[#ff8633]'}`}
                maxLength="5"
              />
              {errors.zipCode && (
                <p className="text-red-500 text-xs mt-1">Please enter a valid 5-digit zip code</p>
              )}
            </div>
          </div>
        );
        
      case 4:
        return (
          <div>
            <h2 className="text-base font-semibold mb-3">What's your email address?</h2>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email Address"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff8633]"
            />
            <p className="text-xs text-gray-500 mt-2">By entering your email above, you consent to receive marketing emails from compare-bazaar.com.</p>
          </div>
        );
        
      case 5:
        return (
          <div>
            <h2 className="text-base font-semibold mb-3">Last step! Who do we have the pleasure of working with?</h2>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="First Name"
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff8633]"
              />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Last Name"
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff8633]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                placeholder="Company Name"
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff8633]"
              />
              <div className="relative">
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="+XX1234567890"
                  className={`w-full p-2 border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 ${errors.phoneNumber ? 'focus:ring-red-500' : 'focus:ring-[#ff8633]'}`}
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-xs mt-1">Please enter a valid phone number (+XX followed by 10 digits)</p>
                )}
              </div>
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
          <div>
            <h2 className="text-base font-semibold mb-3">Please verify that you're not a robot</h2>
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
        );
        
      default:
        return null;
    }
  };

  const renderProgressDots = () => {
    const dots = [];
    for (let i = 1; i <= 6; i++) {
      dots.push(
        <div 
          key={i} 
          className={`h-2 w-2 rounded-full ${currentStep === i ? 'bg-[#ff8633]' : 'bg-gray-300'}`}
        ></div>
      );
    }
    return <div className="flex justify-center space-x-2 my-3">{dots}</div>;
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
        const phoneRegex = /^\+\d{2}\d{10}$/;
        return formData.firstName !== '' && 
               formData.lastName !== '' && 
               formData.phoneNumber !== '' &&
               phoneRegex.test(formData.phoneNumber) &&
               !errors.phoneNumber;
      case 6:
        return captchaValue !== null; // CAPTCHA must be filled
      default:
        return true;
    }
  };

  return (
    <div className="w-full bg-white relative">
      {/* Success notification */}
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
      <div>
        <form onSubmit={handleSubmit}>
          <div className="px-1 py-2">
            {renderStep()}
          </div>
          
          <div className="mt-6 flex items-center">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center text-gray-600 px-3 py-1 rounded-md hover:bg-gray-100 text-sm"
                disabled={isSubmitting}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Back
              </button>
            )}
            
            {currentStep === 6 ? (
              <button
                type="submit"
                className={`ml-auto px-6 py-2 rounded-md font-medium text-sm ${
                  isStepValid() 
                    ? 'bg-orange-400 hover:bg-orange-500 text-white' 
                    : 'bg-gray-300 cursor-not-allowed text-gray-500'
                }`}
                disabled={!isStepValid() || isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  nextStep();
                }}
                className={`ml-auto px-6 py-2 rounded-md font-medium text-sm ${
                  isStepValid() 
                    ? 'bg-orange-400 hover:bg-orange-500 text-white' 
                    : 'bg-gray-300 cursor-not-allowed text-gray-500'
                }`}
                disabled={!isStepValid() || isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'NEXT'}
              </button>
            )}
          </div>
          
          {renderProgressDots()}
        </form>
      </div>

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

export default BusinessPhoneSystemForm;