'use client'

import React, { useState, useEffect, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { sendFormData } from './emailService';

const CallCenterForm = ({ onClose }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        emailList: '',
        emailVolume: '',
        emailCampaign: '',
        otherServices: '',
        buyingTime: '',
        featureswithEmail: '',
        zipCode: '',
        email: '',
        customService: '',
        firstName: '',
        lastName: '',
        companyName: '',
        phoneNumber: '',
        importantFeature: '',
        inboundCalls: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [captchaValue, setCaptchaValue] = useState(null); // State for CAPTCHA value
    const captchaRef = useRef(null); // Ref for CAPTCHA component

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
            featureswithEmail: '',
            zipCode: '',
            customService: '',
            email: '',
            firstName: '',
            lastName: '',
            companyName: '',
            phoneNumber: '',
            importantFeature: '',
            inboundCalls: '',
        });
        setCurrentStep(1);
        setCaptchaValue(null); // Reset CAPTCHA value
        if (captchaRef.current) {
            captchaRef.current.reset(); // Reset CAPTCHA widget
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
            const response = await sendFormData(formData, 'Call Center Form', captchaValue);
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
                        <h2 className="text-base font-semibold mb-3">What is the most important feature you need?</h2>
                        <div className="space-y-2">
                            {['Answering/Reception services', 'Scripted customer service/technical support', 'Appointment setting', 'Taking sales order', 'Qualifying sales leads', 'Other or not sure'].map((option) => (
                                <div
                                    key={option}
                                    className={`p-3 rounded-md bg-blue-50 cursor-pointer ${formData.importantFeature === option ? 'border-2 border-[#ff8633]' : ''}`}
                                    onClick={() => handleRadioChange('importantFeature', option)}
                                >
                                    <label className="flex items-center cursor-pointer">
                                        <div className="relative flex items-center justify-center">
                                            <input
                                                type="radio"
                                                name="importantFeature"
                                                className="sr-only"
                                                checked={formData.importantFeature === option}
                                                onChange={() => { }}
                                            />
                                            <div className={`w-4 h-4 border rounded-full flex items-center justify-center ${formData.importantFeature === option ? 'bg-[#ff8633] border-[#ff8633]' : 'border-gray-400 bg-white'}`}>
                                                {formData.importantFeature === option && (
                                                    <div className="w-2 h-2 rounded-full bg-white"></div>
                                                )}
                                            </div>
                                        </div>
                                        <span className="ml-2 text-sm">{option}</span>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div>
                        <h2 className="text-base font-semibold mb-3">Roughly how many inbound calls do you receive each month?</h2>
                        <div className="space-y-2">
                            {['Not Sure', '1 to 499', '500 to 1,999', '2,000 to 4,999', '5,000+'].map((option) => (
                                <div
                                    key={option}
                                    className={`p-3 rounded-md bg-blue-50 cursor-pointer ${formData.inboundCalls === option ? 'border-2 border-[#ff8633]' : ''}`}
                                    onClick={() => handleRadioChange('inboundCalls', option)}
                                >
                                    <label className="flex items-center cursor-pointer">
                                        <div className="relative flex items-center justify-center">
                                            <input
                                                type="radio"
                                                name="inboundCalls"
                                                className="sr-only"
                                                checked={formData.inboundCalls === option}
                                                onChange={() => { }}
                                            />
                                            <div className={`w-4 h-4 border rounded-full flex items-center justify-center ${formData.inboundCalls === option ? 'bg-[#ff8633] border-[#ff8633]' : 'border-gray-400 bg-white'}`}>
                                                {formData.inboundCalls === option && (
                                                    <div className="w-2 h-2 rounded-full bg-white"></div>
                                                )}
                                            </div>
                                        </div>
                                        <span className="ml-2 text-sm">{option}</span>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div>
                        <h2 className="text-base font-semibold mb-3">What's your zip code?</h2>
                        <input
                            type="text"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleInputChange}
                            placeholder="Enter zip code"
                            className={`w-full p-2 border ${formData.zipCode && formData.zipCode.length < 5
                                ? 'border-red-500'
                                : 'border-gray-300'
                                } rounded-md focus:outline-none focus:ring-2 ${formData.zipCode && formData.zipCode.length < 5
                                    ? 'focus:ring-red-500'
                                    : 'focus:ring-[#ff8633]'
                                }`}
                            maxLength="5"
                        />
                        {formData.zipCode && formData.zipCode.length < 5 && (
                            <p className="text-red-500 text-xs mt-1">
                                Please enter a valid 5-digit zip code
                            </p>
                        )}
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
                        <p className="text-xs text-gray-500 mt-2">By entering your email above, you consent to receive marketing emails from Compare-bazaar.<a href="/terms-of-use" className="text-[#ff8633] hover:underline">Terms and Conditions</a> and <a href="/privacy-policy" className="text-[#ff8633] hover:underline">Privacy Policy</a> which are also linked at the bottom of this page.</p>
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
                                    placeholder="+XX 1234567890"
                                    className={`p-2 border ${formData.phoneNumber && !/^\+[0-9]{2} [0-9]{10}$/.test(formData.phoneNumber)
                                        ? 'border-red-500'
                                        : 'border-gray-300'
                                        } rounded-md focus:outline-none focus:ring-2 ${formData.phoneNumber && !/^\+[0-9]{2} [0-9]{10}$/.test(formData.phoneNumber)
                                            ? 'focus:ring-red-500'
                                            : 'focus:ring-[#ff8633]'
                                        }`}
                                />
                                {formData.phoneNumber && !/^\+[0-9]{2} [0-9]{10}$/.test(formData.phoneNumber) && (
                                    <p className="text-red-500 text-xs mt-1">
                                        Please enter a valid phone number in the format: +XX 1234567890
                                    </p>
                                )}
                            </div>
                        </div>
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
                return formData.importantFeature !== '';
            case 2:
                return formData.inboundCalls !== '';
            case 3:
                return formData.zipCode !== '' && formData.zipCode.length === 5;
            case 4:
                return formData.email !== '' && formData.email.includes('@');
            case 5:
                const phoneRegex = /^\+[0-9]{2} [0-9]{10}$/;
                return formData.firstName !== '' &&
                    formData.lastName !== '' &&
                    formData.phoneNumber !== '' &&
                    phoneRegex.test(formData.phoneNumber);

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
                <div className="fixed top-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm w-full border-l-4 border-[#ff8633] z-900 slide-in-right">
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

                        <button
                            type="button"
                            onClick={currentStep === 6 ? handleSubmit : nextStep}
                            className={`ml-auto px-6 py-2 rounded-md font-medium text-sm ${isStepValid()
                                ? 'bg-orange-400 hover:bg-orange-500 text-white'
                                : 'bg-gray-300 cursor-not-allowed text-gray-500'
                                }`}
                            disabled={!isStepValid() || isSubmitting}
                        >
                            {isSubmitting
                                ? 'Processing...'
                                : currentStep === 6
                                    ? 'FINISH'
                                    : 'NEXT'
                            }
                        </button>
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

export default CallCenterForm;