'use client';

import React, { useState, useEffect, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { sendFormData } from './emailService';

const WebsiteBuildingForm = ({ onClose }) => {
    const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
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
        wdstate: 'California', // Set default value
        wdcity: 'Ashland',
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
            phoneNumber: '',

            wdtypeofwebsite: '',
            wdtypeofdesign: '',
            wdregistered: '',
            wdbusiness: '',
            wdbudget: '',
            wddecision: '',
            wdadditionalFeatures: '',
            streetAddress: '',
            wdstate: 'California', // Set default value
            wdcity: 'Ashland',
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

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div>
                        <h2 className="text-base font-semibold mb-3">Are you interested in cart-based ecommerce services or a general website deisgn project?</h2>
                        <div className="space-y-2">
                            {['Ecommerce services', 'Web design services'].map((option) => (
                                <div
                                    key={option}
                                    className={`p-3 rounded-md bg-blue-50 cursor-pointer ${formData.wdtypeofwebsite === option ? 'border-2 border-[#ff8633]' : ''}`}
                                    onClick={() => handleRadioChange('wdtypeofwebsite', option)}
                                >
                                    <label className="flex items-center cursor-pointer">
                                        <div className="relative flex items-center justify-center">
                                            <input
                                                type="radio"
                                                name="wdtypeofwebsite"
                                                className="sr-only"
                                                checked={formData.wdtypeofwebsite === option}
                                                onChange={() => { }}
                                            />
                                            <div className={`w-4 h-4 border rounded-full flex items-center justify-center ${formData.wdtypeofwebsite === option ? 'bg-[#ff8633] border-[#ff8633]' : 'border-gray-400 bg-white'}`}>
                                                {formData.wdtypeofwebsite === option && (
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
                        <h2 className="text-base font-semibold mb-3">What type of design services are you considering?</h2>
                        <div className="space-y-2">
                            {['New Design', 'Redesign', 'Existing site maintainance or upgrade', 'Other'].map((option) => (
                                <div
                                    key={option}
                                    className={`p-3 rounded-md bg-blue-50 cursor-pointer ${formData.wdtypeofdesign === option ? 'border-2 border-[#ff8633]' : ''}`}
                                    onClick={() => handleRadioChange('wdtypeofdesign', option)}
                                >
                                    <label className="flex items-center cursor-pointer">
                                        <div className="relative flex items-center justify-center">
                                            <input
                                                type="radio"
                                                name="wdtypeofdesign"
                                                className="sr-only"
                                                checked={formData.wdtypeofdesign === option}
                                                onChange={() => { }}
                                            />
                                            <div className={`w-4 h-4 border rounded-full flex items-center justify-center ${formData.wdtypeofdesign === option ? 'bg-[#ff8633] border-[#ff8633]' : 'border-gray-400 bg-white'}`}>
                                                {formData.wdtypeofdesign === option && (
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
                        <h2 className="text-base font-semibold mb-3">Have you registered a domain name for this site?</h2>
                        <div className="space-y-2">
                            {['Yes', 'No'].map((option) => (
                                <div
                                    key={option}
                                    className={`p-3 rounded-md bg-blue-50 cursor-pointer ${formData.wdregistered === option ? 'border-2 border-[#ff8633]' : ''}`}
                                    onClick={() => handleRadioChange('wdregistered', option)}
                                >
                                    <label className="flex items-center cursor-pointer">
                                        <div className="relative flex items-center justify-center">
                                            <input
                                                type="radio"
                                                name="wdregistered"
                                                className="sr-only"
                                                checked={formData.wdregistered === option}
                                                onChange={() => { }}
                                            />
                                            <div className={`w-4 h-4 border rounded-full flex items-center justify-center ${formData.wdregistered === option ? 'bg-[#ff8633] border-[#ff8633]' : 'border-gray-400 bg-white'}`}>
                                                {formData.wdregistered === option && (
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
                        <h2 className="text-base font-semibold mb-3">How would you describe your business?</h2>
                        <div className="space-y-2">
                            {['New Business', 'Established Business'].map((option) => (
                                <div
                                    key={option}
                                    className={`p-3 rounded-md bg-blue-50 cursor-pointer ${formData.wdbusiness === option ? 'border-2 border-[#ff8633]' : ''}`}
                                    onClick={() => handleRadioChange('wdbusiness', option)}
                                >
                                    <label className="flex items-center cursor-pointer">
                                        <div className="relative flex items-center justify-center">
                                            <input
                                                type="radio"
                                                name="wdbusiness"
                                                className="sr-only"
                                                checked={formData.wdbusiness === option}
                                                onChange={() => { }}
                                            />
                                            <div className={`w-4 h-4 border rounded-full flex items-center justify-center ${formData.wdbusiness === option ? 'bg-[#ff8633] border-[#ff8633]' : 'border-gray-400 bg-white'}`}>
                                                {formData.wdbusiness === option && (
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

            case 5:
                return (
                    <div>
                        <h2 className="text-base font-semibold mb-3">What is your approximate budget for this project?</h2>
                        <div className="space-y-2">
                            {['$500-999', '$1,000-1,499', '$1,500-2,499', '$2,500+'].map((option) => (
                                <div
                                    key={option}
                                    className={`p-3 rounded-md bg-blue-50 cursor-pointer ${formData.wdbudget === option ? 'border-2 border-[#ff8633]' : ''}`}
                                    onClick={() => handleRadioChange('wdbudget', option)}
                                >
                                    <label className="flex items-center cursor-pointer">
                                        <div className="relative flex items-center justify-center">
                                            <input
                                                type="radio"
                                                name="wdbudget"
                                                className="sr-only"
                                                checked={formData.wdbudget === option}
                                                onChange={() => { }}
                                            />
                                            <div className={`w-4 h-4 border rounded-full flex items-center justify-center ${formData.wdbudget === option ? 'bg-[#ff8633] border-[#ff8633]' : 'border-gray-400 bg-white'}`}>
                                                {formData.wdbudget === option && (
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

            case 6:
                return (
                    <div>
                        <h2 className="text-base font-semibold mb-3">When do you anticipate making a decision?</h2>
                        <div className="space-y-2">
                            {['ASAP', 'In 1 month', 'In 2 months or more'].map((option) => (
                                <div
                                    key={option}
                                    className={`p-3 rounded-md bg-blue-50 cursor-pointer ${formData.wddecision === option ? 'border-2 border-[#ff8633]' : ''}`}
                                    onClick={() => handleRadioChange('wddecision', option)}
                                >
                                    <label className="flex items-center cursor-pointer">
                                        <div className="relative flex items-center justify-center">
                                            <input
                                                type="radio"
                                                name="wddecision"
                                                className="sr-only"
                                                checked={formData.wddecision === option}
                                                onChange={() => { }}
                                            />
                                            <div className={`w-4 h-4 border rounded-full flex items-center justify-center ${formData.wddecision === option ? 'bg-[#ff8633] border-[#ff8633]' : 'border-gray-400 bg-white'}`}>
                                                {formData.wddecision === option && (
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
                        <p className="text-xs text-gray-500 mt-2">By entering your email above, you consent to receive marketing emails from compare-bazaar.com.<a href="/terms-of-use" className="text-[#ff8633] hover:underline">Terms and Conditions</a> and <a href="/privacy-policy" className="text-[#ff8633] hover:underline">Privacy Policy</a> which are also linked at the bottom of this page.</p>
                    </div>
                );

            case 9:
                return (
                    <div>
                        <h2 className="text-base font-semibold mb-3">Please share any additional features or information about your needs.</h2>
                        <textarea
                            name="wdadditionalFeatures"
                            value={formData.wdadditionalFeatures || ''}
                            onChange={handleInputChange}
                            placeholder="Enter additional features or information"
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff8633] h-32 resize-none"
                            maxLength={1000}
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            Note: There is a 1000 character limit for this answer.
                        </p>
                    </div>
                );

            case 10:
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

            case 11: // or appropriate case number
                return (
                    <div>
                        <h2 className="text-base font-semibold mb-3">Last step! Tell us where you're located:</h2>
                        <div className="space-y-3">
                            <div>
                                <input
                                    type="text"
                                    name="streetAddress"
                                    value={formData.streetAddress || ''}
                                    onChange={handleInputChange}
                                    placeholder="Your Street Address"
                                    className={`w-full p-2 border ${formData.streetAddress
                                        ? 'border-gray-300 focus:ring-[#ff8633]'
                                        : 'border-red-500 focus:ring-red-500'
                                        } rounded-md focus:outline-none focus:ring-2`}
                                    required
                                />
                                {!formData.streetAddress && (
                                    <p className="text-red-500 text-xs mt-1">
                                        This information is required.
                                    </p>
                                )}
                            </div>

                            <div className="relative">
                                <input
                                    type="text"
                                    name="wdcity"
                                    value={formData.wdcity || 'Ashland'}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff8633]"
                                />
                            </div>

                            <div className="relative">
                                <select
                                    name="wdstate"
                                    value={formData.wdstate || 'California'}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff8633] appearance-none"
                                >
                                    {[
                                        'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
                                        'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
                                        'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
                                        'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
                                        'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
                                        'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
                                        'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
                                        'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
                                        'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
                                        'West Virginia', 'Wisconsin', 'Wyoming'
                                    ].map((stateName) => (
                                        <option key={stateName} value={stateName}>
                                            {stateName}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                    </svg>
                                </div>
                            </div>

                            <div>
                                <input
                                    type="text"
                                    name="zipCode"
                                    value={formData.zipCode}
                                    onChange={handleInputChange}
                                    placeholder="Zip Code"
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
                        </div>
                    </div>
                );


            case 12:
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
                            RECAPTCHA_SITE_KEY ? (
                                <ReCAPTCHA
                                    ref={captchaRef}
                                    sitekey={RECAPTCHA_SITE_KEY}
                                    onChange={(value) => setCaptchaValue(value)}
                                />
                            ) : (
                                <div className="text-red-500 text-sm">
                                    reCAPTCHA is not configured. Please contact support.
                                </div>
                            )
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    const renderProgressDots = () => {
        const dots = [];
        for (let i = 1; i <= 12; i++) {
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
                const phoneRegex = /^\+[0-9]{2} [0-9]{10}$/;
                return formData.firstName !== '' &&
                    formData.lastName !== '' &&
                    formData.phoneNumber !== '' &&
                    phoneRegex.test(formData.phoneNumber);

            case 11:
                return formData.streetAddress && formData.streetAddress.trim() !== '' &&
                    formData.wdcity && formData.wdcity.trim() !== '' &&
                    formData.wdstate && formData.wdstate.trim() !== '' &&
                    formData.zipCode && formData.zipCode.length === 5;

            case 12:
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
                            onClick={currentStep === 12 ? handleSubmit : nextStep}
                            className={`ml-auto px-6 py-2 rounded-md font-medium text-sm ${isStepValid()
                                ? 'bg-orange-400 hover:bg-orange-500 text-white'
                                : 'bg-gray-300 cursor-not-allowed text-gray-500'
                                }`}
                            disabled={!isStepValid() || isSubmitting}
                        >
                            {isSubmitting
                                ? 'Processing...'
                                : currentStep === 12
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

export default WebsiteBuildingForm;