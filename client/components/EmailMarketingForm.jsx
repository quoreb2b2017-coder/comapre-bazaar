'use client';

import React, { useState, useEffect, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { sendFormData } from './emailService';

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
        phoneNumber: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [captchaValue, setCaptchaValue] = useState(null); // State for CAPTCHA value
    const captchaRef = useRef(null); // Ref for CAPTCHA component


    const handleCheckboxChange = (name, value) => {
        console.log('Checkbox changed:', name, value); // Debugging
        setFormData(prev => {
            const currentValues = Array.isArray(prev[name]) ? [...prev[name]] : [];
            if (currentValues.includes(value)) {
                return {
                    ...prev,
                    [name]: currentValues.filter(item => item !== value)
                };
            } else {
                return {
                    ...prev,
                    [name]: [...currentValues, value]
                };
            }
        });
    };


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
            featureswithEmail: [],
            zipCode: '',
            customService: '',
            email: '',
            firstName: '',
            lastName: '',
            companyName: '',
            phoneNumber: ''
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

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div>
                        <h2 className="text-base font-semibold mb-3">Do You have a list of email addresses for your email marketing campaigns</h2>
                        <div className="space-y-2">
                            <div
                                className={`p-3 rounded-md bg-blue-50 cursor-pointer ${formData.emailList === 'Yes- We already have a list of addresses' ? 'border-2 border-[#ff8633]' : ''}`}
                                onClick={() => handleRadioChange('emailList', 'Yes- We already have a list of addresses')}
                            >
                                <label className="flex items-center cursor-pointer">
                                    <div className="relative flex items-center justify-center">
                                        <input
                                            type="radio"
                                            name="emailList"
                                            className="sr-only"
                                            checked={formData.emailList === 'Yes- We already have a list of addresses'}
                                            onChange={() => { }}
                                        />
                                        <div className={`w-4 h-4 border rounded-full flex items-center justify-center ${formData.emailList === 'Yes- We already have a list of addresses' ? 'bg-[#ff8633] border-[#ff8633]' : 'border-gray-400 bg-white'}`}>
                                            {formData.emailList === 'Yes- We already have a list of addresses' && (
                                                <div className="w-2 h-2 rounded-full bg-white"></div>
                                            )}
                                        </div>
                                    </div>
                                    <span className="ml-2 text-sm">Yes- We already have a list of addresses</span>
                                </label>
                            </div>

                            <div
                                className={`p-3 rounded-md bg-blue-50 cursor-pointer ${formData.emailList === 'No We will have to obtain a list of addresses' ? 'border-2 border-[#ff8633]' : ''}`}
                                onClick={() => handleRadioChange('emailList', 'No We will have to obtain a list of addresses')}
                            >
                                <label className="flex items-center cursor-pointer">
                                    <div className="relative flex items-center justify-center">
                                        <input
                                            type="radio"
                                            name="emailList"
                                            className="sr-only"
                                            checked={formData.emailList === 'No We will have to obtain a list of addresses'}
                                            onChange={() => { }}
                                        />
                                        <div className={`w-4 h-4 border rounded-full flex items-center justify-center ${formData.emailList === 'No We will have to obtain a list of addresses' ? 'bg-[#ff8633] border-[#ff8633]' : 'border-gray-400 bg-white'}`}>
                                            {formData.emailList === 'No We will have to obtain a list of addresses' && (
                                                <div className="w-2 h-2 rounded-full bg-white"></div>
                                            )}
                                        </div>
                                    </div>
                                    <span className="ml-2 text-sm">No We will have to obtain a list of addresses</span>
                                </label>
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div>
                        <h2 className="text-base font-semibold mb-3">Approximately how many individual emails will you be sending per mailing??</h2>
                        <div className="space-y-2">
                            {['Less than 1000,', '1,000 - 5,000', '5,000 - 10,000', '10,000 - 50,000', '50,000 - 100,000', '100,000 - 500,000', '500,000+'].map((option) => (
                                <div
                                    key={option}
                                    className={`p-3 rounded-md bg-blue-50 cursor-pointer ${formData.emailVolume === option ? 'border-2 border-[#ff8633]' : ''}`}
                                    onClick={() => handleRadioChange('emailVolume', option)}
                                >
                                    <label className="flex items-center cursor-pointer">
                                        <div className="relative flex items-center justify-center">
                                            <input
                                                type="radio"
                                                name="emailVolume"
                                                className="sr-only"
                                                checked={formData.emailVolume === option}
                                                onChange={() => { }}
                                            />
                                            <div className={`w-4 h-4 border rounded-full flex items-center justify-center ${formData.emailVolume === option ? 'bg-[#ff8633] border-[#ff8633]' : 'border-gray-400 bg-white'}`}>
                                                {formData.emailVolume === option && (
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
                        <h2 className="text-base font-semibold mb-3">Approximately how often will you send out email campaigns??</h2>
                        <div className="space-y-2">
                            {['Not Sure,', 'Less than 1 per month', '1-2 times  per month', '3-5 times  per month', '6-10 times  per month', '11+ times  per month',].map((option) => (
                                <div
                                    key={option}
                                    className={`p-3 rounded-md bg-blue-50 cursor-pointer ${formData.emailCampaign === option ? 'border-2 border-[#ff8633]' : ''}`}
                                    onClick={() => handleRadioChange('emailCampaign', option)}
                                >
                                    <label className="flex items-center cursor-pointer">
                                        <div className="relative flex items-center justify-center">
                                            <input
                                                type="radio"
                                                name="emailCampaign"
                                                className="sr-only"
                                                checked={formData.emailCampaign === option}
                                                onChange={() => { }}
                                            />
                                            <div className={`w-4 h-4 border rounded-full flex items-center justify-center ${formData.emailCampaign === option ? 'bg-[#ff8633] border-[#ff8633]' : 'border-gray-400 bg-white'}`}>
                                                {formData.emailCampaign === option && (
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

            case 4:
                return (
                    <div>
                        <h2 className="text-base font-semibold mb-3">What additional email services are you interested in?</h2>
                        <div className="space-y-2">
                            {['Not Sure,', 'Creative Design', 'Creative production', 'Database hosting', 'Data cleansing', 'Others',].map((option) => (
                                <div
                                    key={option}
                                    className={`p-3 rounded-md bg-blue-50 cursor-pointer ${formData.otherServices === option ? 'border-2 border-[#ff8633]' : ''}`}
                                    onClick={() => handleRadioChange('otherServices', option)}
                                >
                                    <label className="flex items-center cursor-pointer">
                                        <div className="relative flex items-center justify-center">
                                            <input
                                                type="radio"
                                                name="otherServices"
                                                className="sr-only"
                                                checked={formData.otherServices === option}
                                                onChange={() => { }}
                                            />
                                            <div className={`w-4 h-4 border rounded-full flex items-center justify-center ${formData.otherServices === option ? 'bg-[#ff8633] border-[#ff8633]' : 'border-gray-400 bg-white'}`}>
                                                {formData.otherServices === option && (
                                                    <div className="w-2 h-2 rounded-full bg-white"></div>
                                                )}
                                            </div>
                                        </div>
                                        <span className="ml-2 text-sm">{option}</span>
                                    </label>

                                    {option === 'Others' && formData.otherServices === 'Others' && (
                                        <div className="mt-2 ml-6">
                                            <input
                                                type="text"
                                                placeholder="Please specify your service requirements"
                                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#ff8633] focus:border-[#ff8633]"
                                                value={formData.customService || ''}
                                                onChange={(e) => {
                                                    const updatedFormData = {
                                                        ...formData,
                                                        customService: e.target.value
                                                    };
                                                    setFormData(updatedFormData);
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 5:
                return (
                    <div>
                        <h2 className="text-base font-semibold mb-3">Which features do you need with your email marketing services or software?</h2>
                        <div className="max-h-64 md:max-h-96 overflow-y-auto pr-1">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                                    'Others'
                                ].map((option) => {
                                    // Check if the option is selected
                                    const isSelected = Array.isArray(formData.featureswithEmail) &&
                                        formData.featureswithEmail.includes(option);

                                    return (
                                        <div
                                            key={option}
                                            className={`p-3 rounded-md bg-blue-50 cursor-pointer ${isSelected ? 'border-2 border-[#ff8633]' : ''}`}
                                        >
                                            <label className="flex items-center cursor-pointer">
                                                <div className="relative flex items-center justify-center">
                                                    <input
                                                        type="checkbox"
                                                        name="featureswithEmail"
                                                        className="sr-only"
                                                        checked={isSelected}
                                                        onChange={() => handleCheckboxChange('featureswithEmail', option)}
                                                    />
                                                    <div className={`w-4 h-4 border rounded flex items-center justify-center ${isSelected ? 'bg-[#ff8633] border-[#ff8633]' : 'border-gray-400 bg-white'}`}>
                                                        {isSelected && (
                                                            <svg
                                                                className="w-2 h-2 text-white"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={3}
                                                                    d="M5 13l4 4L19 7"
                                                                />
                                                            </svg>
                                                        )}
                                                    </div>
                                                </div>
                                                <span className="ml-2 text-sm">{option}</span>
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                );

            case 6:
                return (
                    <div>
                        <h2 className="text-base font-semibold mb-3">When are you planning to make your buying decision for these email marketing products or services?</h2>
                        <div className="space-y-2">
                            {['Immediately', 'Within 1 month', 'Within 2 months', 'More than 2 months', 'Not Sure',].map((option) => (
                                <div
                                    key={option}
                                    className={`p-3 rounded-md bg-blue-50 cursor-pointer ${formData.buyingTime === option ? 'border-2 border-[#ff8633]' : ''}`}
                                    onClick={() => handleRadioChange('buyingTime', option)}
                                >
                                    <label className="flex items-center cursor-pointer">
                                        <div className="relative flex items-center justify-center">
                                            <input
                                                type="radio"
                                                name="buyingTime"
                                                className="sr-only"
                                                checked={formData.buyingTime === option}
                                                onChange={() => { }}
                                            />
                                            <div className={`w-4 h-4 border rounded-full flex items-center justify-center ${formData.buyingTime === option ? 'bg-[#ff8633] border-[#ff8633]' : 'border-gray-400 bg-white'}`}>
                                                {formData.buyingTime === option && (
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

            case 7:
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

            case 8:
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
                        <p className="text-xs text-gray-500 mt-2">By entering your email above, you consent to receive marketing emails from Compare-Bazaar.<a href="/terms-of-use" className="text-[#ff8633] hover:underline">Terms and Conditions</a> and <a href="/privacy-policy" className="text-[#ff8633] hover:underline">Privacy Policy</a> which are also linked at the bottom of this page.</p>
                    </div>
                );

            case 9:
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
        for (let i = 1; i <= 9; i++) {
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
                            onClick={currentStep === 9 ? handleSubmit : nextStep}
                            className={`ml-auto px-6 py-2 rounded-md font-medium text-sm ${isStepValid()
                                ? 'bg-orange-400 hover:bg-orange-500 text-white'
                                : 'bg-gray-300 cursor-not-allowed text-gray-500'
                                }`}
                            disabled={!isStepValid() || isSubmitting}
                        >
                            {isSubmitting
                                ? 'Processing...'
                                : currentStep === 9
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

export default EmailMarketingForm;