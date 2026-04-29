'use client';

import React, { useState, useEffect, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { sendFormData } from './emailService';

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
      [name]: value
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
    
    // Check if reCAPTCHA is completed
    if (!captchaValue) {
      alert('Please complete the reCAPTCHA verification.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Use the emailService to send the form data with Web3Forms
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
            <h2 className="text-lg font-semibold mb-3 text-gray-800">What is the size of the fleet you are looking to manage?</h2>
            <div className="space-y-2">
              {['1 - 4', '5 - 9', '10 - 19', '20 - 49', '50 - 99', '100 or more'].map((size) => (
                <div 
                  key={size}
                  className={`p-3 rounded-md bg-blue-50 cursor-pointer ${formData.fleetSize === size ? 'border-2 border-[#ff8633]' : ''}`}
                  onClick={() => handleInputChange({ target: { name: 'fleetSize', value: size } })}
                >
                  <label className="flex items-center cursor-pointer">
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="radio" 
                        name="fleetSize" 
                        className="sr-only"
                        checked={formData.fleetSize === size}
                        onChange={() => {}}
                      />
                      <div className={`w-4 h-4 border rounded-full flex items-center justify-center ${formData.fleetSize === size ? 'bg-[#ff8633] border-[#ff8633]' : 'border-gray-400 bg-white'}`}>
                        {formData.fleetSize === size && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                    </div>
                    <span className="ml-2 text-sm text-gray-700">{size}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-lg font-semibold mb-3 text-gray-800">What do you need to track?</h2>
            <div className="space-y-2">
              {['Vans or trucks', 'Heavy duty or semi trucks', 'Cars or limousines', 'Trailers', 'Construction machinery', 'Buses', 'Other'].map((type) => (
                <div 
                  key={type}
                  className={`p-3 rounded-md bg-blue-50 cursor-pointer ${formData.vehicleTypes === type ? 'border-2 border-[#ff8633]' : ''}`}
                  onClick={() => handleCheckboxChange({ target: { name: 'vehicleTypes', value: type } })}
                >
                  <label className="flex items-center cursor-pointer">
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="radio" 
                        name="vehicleTypes" 
                        className="sr-only"
                        checked={formData.vehicleTypes === type}
                        onChange={() => {}}
                      />
                      <div className={`w-4 h-4 border rounded-full flex items-center justify-center ${formData.vehicleTypes === type ? 'bg-[#ff8633] border-[#ff8633]' : 'border-gray-400 bg-white'}`}>
                        {formData.vehicleTypes === type && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                    </div>
                    <span className="ml-2 text-sm text-gray-700">{type}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="text-lg font-semibold mb-3 text-gray-800">Please enter the ZIP / postal code where service is requested.</h2>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleInputChange}
              placeholder="Zip Code"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff8633] text-gray-700"
              maxLength="5"
            />
          </div>
        );
      case 4:
        return (
          <div>
            <h2 className="text-lg font-semibold mb-3 text-gray-800">Good news! We've found suppliers for you. Please tell us where to send your free quotes.</h2>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff8633] text-gray-700"
            />
            <p className="text-xs text-gray-600 mt-2">We respect your privacy and will securely store your email and will share your request with up to 5 suppliers.</p>
          </div>
        );
      case 5:
        return (
          <div>
            <h2 className="text-lg font-semibold mb-3 text-gray-800">Last step! Fill in the last few details to get your free quotes!</h2>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Full Name"
              className="w-full p-2 border border-gray-300 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-[#ff8633] text-gray-700"
            />
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              placeholder="Company Name"
              className="w-full p-2 border border-gray-300 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-[#ff8633] text-gray-700"
            />
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="Phone Number"
              className="w-full p-2 border border-gray-300 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-[#ff8633] text-gray-700"
            />
            <p className="text-xs text-gray-600 mt-2">
              By clicking "Compare Prices" below, I consent to receive automated marketing or other calls and texts which may use autodialer, prerecorded or artificial voice technology from or on behalf of 360Connect LLC and up to five marketing partners in the phone number provided above, even if my number is listed on any state or national Do Not Call Registry. I understand consent is not a condition of purchase. By clicking "Compare Prices" below, I also agree to 360Connect LLC's Terms of Use, including submitting any disputes to mandatory individual binding arbitration.
            </p>
          </div>
        );
      case 6:
        return (
          <div>
            <h2 className="text-lg font-semibold mb-3 text-gray-800">Please verify that you're not a robot</h2>
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
        return formData.fleetSize !== '';
      case 2:
        return formData.vehicleTypes.length > 0;
      case 3:
        return formData.zipCode !== '';
      case 4:
        return formData.email !== '' && formData.email.includes('@');
      case 5:
        return formData.fullName !== '' && formData.companyName !== '' && formData.phoneNumber !== '';
      case 6:
        return captchaValue !== null;
      default:
        return true;
    }
  };

  return (
    <div className="w-full bg-white relative">
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm w-full border-l-4 border-[#ff8633] z-50 slide-in-right">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-[#ff8633]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="ml-3 w-0 flex-1">
              <h3 className="text-base font-medium text-gray-900">Thank you!</h3>
              <p className="mt-1 text-xs text-gray-600">
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
            
            <button
              type={currentStep === 6 ? "submit" : "button"}
              onClick={currentStep === 6 ? null : nextStep}
              className={`ml-auto px-6 py-2 rounded-md font-medium text-sm ${
                isStepValid() 
                  ? 'bg-orange-400 hover:bg-orange-500 text-white' 
                  : 'bg-gray-300 cursor-not-allowed text-gray-500'
              }`}
              disabled={!isStepValid() || isSubmitting}
            >
              {isSubmitting 
                ? 'Processing...' 
                : currentStep === 6 
                  ? 'COMPARE PRICES' 
                  : 'NEXT'
              }
            </button>
          </div>
          
          {renderProgressDots()}
        </form>
      </div>

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

export default GPSFleetForm;