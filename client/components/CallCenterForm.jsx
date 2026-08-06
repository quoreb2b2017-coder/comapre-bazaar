'use client'

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
    Building,
    Building2,
    CalendarClock,
    CircleHelp,
    Headphones,
    Mail,
    MapPin,
    MessageSquare,
    Phone,
    PhoneCall,
    ShoppingCart,
    Target,
    User,
    UsersRound,
} from '@/lib/quoteFormIcons';

const TOTAL_STEPS = 6;

const FEATURE_ICONS = {
    'Answering/Reception services': Headphones,
    'Scripted customer service/technical support': MessageSquare,
    'Appointment setting': CalendarClock,
    'Taking sales order': ShoppingCart,
    'Qualifying sales leads': Target,
    'Other or not sure': CircleHelp,
};

const INBOUND_CALL_ICONS = {
    'Not Sure': CircleHelp,
    '1 to 499': Phone,
    '500 to 1,999': PhoneCall,
    '2,000 to 4,999': UsersRound,
    '5,000+': Building,
};

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
                        <QuoteFormStepTitle title="What is the most important feature you need?" />
                        <QuoteFormOptionGrid cols={3}>
                            {['Answering/Reception services', 'Scripted customer service/technical support', 'Appointment setting', 'Taking sales order', 'Qualifying sales leads', 'Other or not sure'].map((option) => (
                                <QuoteFormRadioOption
                                    key={option}
                                    selected={formData.importantFeature === option}
                                    onSelect={() => handleRadioChange('importantFeature', option)}
                                    label={option}
                                    icon={FEATURE_ICONS[option] || Headphones}
                                />
                            ))}
                        </QuoteFormOptionGrid>
                    </div>
                );

            case 2:
                return (
                    <div>
                        <QuoteFormStepTitle title="Roughly how many inbound calls do you receive each month?" />
                        <QuoteFormOptionGrid cols={3}>
                            {['Not Sure', '1 to 499', '500 to 1,999', '2,000 to 4,999', '5,000+'].map((option) => (
                                <QuoteFormRadioOption
                                    key={option}
                                    selected={formData.inboundCalls === option}
                                    onSelect={() => handleRadioChange('inboundCalls', option)}
                                    label={option}
                                    icon={INBOUND_CALL_ICONS[option] || Phone}
                                />
                            ))}
                        </QuoteFormOptionGrid>
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
                            error={
                                formData.zipCode && formData.zipCode.length < 5
                                    ? 'Please enter a valid 5-digit zip code'
                                    : undefined
                            }
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
                        <p className="text-xs text-gray-500 mt-2">By entering your email above, you consent to receive marketing emails from Compare-bazaar.<a href="/terms-of-use" className="text-[#ff8633] hover:underline">Terms and Conditions</a> and <a href="/privacy-policy" className="text-[#ff8633] hover:underline">Privacy Policy</a> which are also linked at the bottom of this page.</p>
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
                                error={phoneHasError(formData.phoneNumber) ? PHONE_VALIDATION_MESSAGE : undefined}
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
                return formData.importantFeature !== '';
            case 2:
                return formData.inboundCalls !== '';
            case 3:
                return formData.zipCode !== '' && formData.zipCode.length === 5;
            case 4:
                return formData.email !== '' && formData.email.includes('@');
            case 5:
                return formData.firstName !== '' &&
                    formData.lastName !== '' &&
                    isValidPhoneNumber(formData.phoneNumber);

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

export default CallCenterForm;
