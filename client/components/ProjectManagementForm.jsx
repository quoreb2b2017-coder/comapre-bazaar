'use client'

import React, { useState, useEffect, useRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { sendFormData } from './emailService'

const ProjectManagementForm = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    teamSize: '',
    currentTool: '',
    keyGoal: '',
    buyingTime: '',
    zipCode: '',
    email: '',
    firstName: '',
    lastName: '',
    companyName: '',
    phoneNumber: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [captchaValue, setCaptchaValue] = useState(null)
  const captchaRef = useRef(null)

  useEffect(() => {
    let timer
    if (showSuccess) {
      timer = setTimeout(() => {
        setShowSuccess(false)
        if (onClose) onClose()
      }, 10000)
    }
    return () => clearTimeout(timer)
  }, [showSuccess, onClose])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleRadioChange = (name, value) => {
    setFormData({ ...formData, [name]: value })
  }

  const nextStep = () => setCurrentStep(currentStep + 1)
  const prevStep = () => setCurrentStep(currentStep - 1)

  const resetForm = () => {
    setFormData({
      teamSize: '',
      currentTool: '',
      keyGoal: '',
      buyingTime: '',
      zipCode: '',
      email: '',
      firstName: '',
      lastName: '',
      companyName: '',
      phoneNumber: '',
    })
    setCurrentStep(1)
    setCaptchaValue(null)
    if (captchaRef.current) captchaRef.current.reset()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!captchaValue) {
      alert('Please complete the reCAPTCHA verification.')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await sendFormData(formData, 'Project Management Form', captchaValue)
      console.log('Form submitted successfully:', response)
      setShowSuccess(true)
      resetForm()
    } catch (error) {
      console.error('Form submission failed:', error)
      alert('Sorry, there was a problem submitting your information. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h2 className="text-base font-semibold mb-3">How big is your project team?</h2>
            <div className="space-y-2">
              {['1-5 users', '6-20 users', '21-50 users', '51-200 users', '200+ users'].map((option) => (
                <div
                  key={option}
                  className={`p-3 rounded-md bg-blue-50 cursor-pointer ${formData.teamSize === option ? 'border-2 border-[#ff8633]' : ''}`}
                  onClick={() => handleRadioChange('teamSize', option)}
                >
                  <label className="flex items-center cursor-pointer">
                    <input type="radio" name="teamSize" className="sr-only" checked={formData.teamSize === option} onChange={() => {}} />
                    <span className="ml-2 text-sm">{option}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )
      case 2:
        return (
          <div>
            <h2 className="text-base font-semibold mb-3">What are you currently using?</h2>
            <div className="space-y-2">
              {['Not using any tool', 'Spreadsheets', 'Trello/Asana', 'Jira', 'Other'].map((option) => (
                <div
                  key={option}
                  className={`p-3 rounded-md bg-blue-50 cursor-pointer ${formData.currentTool === option ? 'border-2 border-[#ff8633]' : ''}`}
                  onClick={() => handleRadioChange('currentTool', option)}
                >
                  <label className="flex items-center cursor-pointer">
                    <input type="radio" name="currentTool" className="sr-only" checked={formData.currentTool === option} onChange={() => {}} />
                    <span className="ml-2 text-sm">{option}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )
      case 3:
        return (
          <div>
            <h2 className="text-base font-semibold mb-3">What is your top goal with project management software?</h2>
            <div className="space-y-2">
              {['Task tracking', 'Team collaboration', 'Resource planning', 'Automation', 'Reporting & dashboards'].map((option) => (
                <div
                  key={option}
                  className={`p-3 rounded-md bg-blue-50 cursor-pointer ${formData.keyGoal === option ? 'border-2 border-[#ff8633]' : ''}`}
                  onClick={() => handleRadioChange('keyGoal', option)}
                >
                  <label className="flex items-center cursor-pointer">
                    <input type="radio" name="keyGoal" className="sr-only" checked={formData.keyGoal === option} onChange={() => {}} />
                    <span className="ml-2 text-sm">{option}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )
      case 4:
        return (
          <div>
            <h2 className="text-base font-semibold mb-3">When are you planning to buy?</h2>
            <div className="space-y-2">
              {['Immediately', 'Within 1 month', 'Within 2 months', 'More than 2 months', 'Not sure'].map((option) => (
                <div
                  key={option}
                  className={`p-3 rounded-md bg-blue-50 cursor-pointer ${formData.buyingTime === option ? 'border-2 border-[#ff8633]' : ''}`}
                  onClick={() => handleRadioChange('buyingTime', option)}
                >
                  <label className="flex items-center cursor-pointer">
                    <input type="radio" name="buyingTime" className="sr-only" checked={formData.buyingTime === option} onChange={() => {}} />
                    <span className="ml-2 text-sm">{option}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )
      case 5:
        return (
          <div>
            <h2 className="text-base font-semibold mb-3">Enter your zip code and email</h2>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleInputChange}
              placeholder="Zip code"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff8633] mb-3"
              maxLength="5"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email Address"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff8633]"
            />
          </div>
        )
      case 6:
        return (
          <div>
            <h2 className="text-base font-semibold mb-3">Tell us about yourself</h2>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First Name" className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff8633]" />
              <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last Name" className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff8633]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} placeholder="Company Name" className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff8633]" />
              <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} placeholder="+XX 1234567890" className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff8633]" />
            </div>
          </div>
        )
      case 7:
        return (
          <div>
            <h2 className="text-base font-semibold mb-3">Please verify that you&apos;re not a robot</h2>
            {captchaValue ? (
              <div className="flex items-center justify-center gap-2 p-4 bg-green-50 border border-green-200 rounded-md">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-green-600 font-semibold">Verified</span>
              </div>
            ) : (
              <ReCAPTCHA ref={captchaRef} sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY} onChange={(value) => setCaptchaValue(value)} />
            )}
          </div>
        )
      default:
        return null
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.teamSize !== ''
      case 2:
        return formData.currentTool !== ''
      case 3:
        return formData.keyGoal !== ''
      case 4:
        return formData.buyingTime !== ''
      case 5:
        return formData.zipCode.length === 5 && formData.email.includes('@')
      case 6:
        return formData.firstName && formData.lastName && formData.phoneNumber
      case 7:
        return captchaValue !== null
      default:
        return true
    }
  }

  return (
    <div className="w-full bg-white relative">
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm w-full border-l-4 border-[#ff8633] z-900">
          <h3 className="text-base font-medium text-gray-900">Thank you!</h3>
          <p className="mt-1 text-xs text-gray-500">Your submission has been received. We will get back to you soon.</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="px-1 py-2">{renderStep()}</div>
        <div className="mt-6 flex items-center">
          {currentStep > 1 && (
            <button type="button" onClick={prevStep} className="flex items-center text-gray-600 px-3 py-1 rounded-md hover:bg-gray-100 text-sm" disabled={isSubmitting}>
              Back
            </button>
          )}
          <button
            type="button"
            onClick={currentStep === 7 ? handleSubmit : nextStep}
            className={`ml-auto px-6 py-2 rounded-md font-medium text-sm ${isStepValid() ? 'bg-orange-400 hover:bg-orange-500 text-white' : 'bg-gray-300 cursor-not-allowed text-gray-500'}`}
            disabled={!isStepValid() || isSubmitting}
          >
            {isSubmitting ? 'Processing...' : currentStep === 7 ? 'FINISH' : 'NEXT'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProjectManagementForm
