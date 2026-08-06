'use client'

import React, { useState, useEffect, useRef } from 'react'
import { sendFormData } from './emailService'
import {
  isValidPhoneNumber,
  phoneHasError,
  PHONE_PLACEHOLDER,
  PHONE_VALIDATION_MESSAGE,
  sanitizePhoneInput,
} from '@/lib/phoneValidation'
import {
  QuoteFormCaptchaStep,
  QuoteFormOptionGrid,
  QuoteFormRadioOption,
  QuoteFormShell,
  QuoteFormStepTitle,
  QuoteFormTextField,
} from '@/components/quotes/QuotePopupUi'
import {
  Building2,
  CalendarClock,
  CircleHelp,
  Clock,
  Kanban,
  Mail,
  MapPin,
  Monitor,
  Phone,
  Sparkles,
  Table,
  Target,
  TEAM_SIZE_ICONS,
  TrendingUp,
  User,
  Users,
} from '@/lib/quoteFormIcons'

const TOTAL_STEPS = 7

const CURRENT_TOOL_ICONS = {
  'Not using any tool': CircleHelp,
  Spreadsheets: Table,
  'Trello/Asana': Kanban,
  Jira: Monitor,
  Other: CircleHelp,
}

const KEY_GOAL_ICONS = {
  'Task tracking': Target,
  'Team collaboration': Users,
  'Resource planning': CalendarClock,
  'Automation': Sparkles,
  'Reporting & dashboards': TrendingUp,
}

const BUYING_TIME_ICONS = {
  'Immediately': Clock,
  'Within 1 month': CalendarClock,
  'Within 2 months': CalendarClock,
  'More than 2 months': Clock,
  'Not sure': CircleHelp,
}

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
    setFormData({
      ...formData,
      [name]: name === 'phoneNumber' ? sanitizePhoneInput(value) : value,
    })
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
            <QuoteFormStepTitle title="How big is your project team?" />
            <QuoteFormOptionGrid cols={3}>
              {['1-5 users', '6-20 users', '21-50 users', '51-200 users', '200+ users'].map((option) => (
                <QuoteFormRadioOption
                  key={option}
                  selected={formData.teamSize === option}
                  onSelect={() => handleRadioChange('teamSize', option)}
                  label={option}
                  icon={TEAM_SIZE_ICONS[option] || Users}
                />
              ))}
            </QuoteFormOptionGrid>
          </div>
        )
      case 2:
        return (
          <div>
            <QuoteFormStepTitle title="What are you currently using?" />
            <QuoteFormOptionGrid cols={3}>
              {['Not using any tool', 'Spreadsheets', 'Trello/Asana', 'Jira', 'Other'].map((option) => (
                <QuoteFormRadioOption
                  key={option}
                  selected={formData.currentTool === option}
                  onSelect={() => handleRadioChange('currentTool', option)}
                  label={option}
                  icon={CURRENT_TOOL_ICONS[option] || Monitor}
                />
              ))}
            </QuoteFormOptionGrid>
          </div>
        )
      case 3:
        return (
          <div>
            <QuoteFormStepTitle title="What is your top goal with project management software?" />
            <QuoteFormOptionGrid cols={3}>
              {['Task tracking', 'Team collaboration', 'Resource planning', 'Automation', 'Reporting & dashboards'].map((option) => (
                <QuoteFormRadioOption
                  key={option}
                  selected={formData.keyGoal === option}
                  onSelect={() => handleRadioChange('keyGoal', option)}
                  label={option}
                  icon={KEY_GOAL_ICONS[option] || Target}
                />
              ))}
            </QuoteFormOptionGrid>
          </div>
        )
      case 4:
        return (
          <div>
            <QuoteFormStepTitle title="When are you planning to buy?" />
            <QuoteFormOptionGrid cols={3}>
              {['Immediately', 'Within 1 month', 'Within 2 months', 'More than 2 months', 'Not sure'].map((option) => (
                <QuoteFormRadioOption
                  key={option}
                  selected={formData.buyingTime === option}
                  onSelect={() => handleRadioChange('buyingTime', option)}
                  label={option}
                  icon={BUYING_TIME_ICONS[option] || CalendarClock}
                />
              ))}
            </QuoteFormOptionGrid>
          </div>
        )
      case 5:
        return (
          <div>
            <QuoteFormStepTitle title="Enter your zip code and email" />
            <div className="grid grid-cols-1 gap-2">
              <QuoteFormTextField
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                placeholder="Zip code"
                maxLength={5}
                icon={MapPin}
              />
              <QuoteFormTextField
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email Address"
                icon={Mail}
              />
            </div>
          </div>
        )
      case 6:
        return (
          <div>
            <QuoteFormStepTitle title="Tell us about yourself" />
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
        )
      case 7:
        return (
          <QuoteFormCaptchaStep
            captchaRef={captchaRef}
            captchaValue={captchaValue}
            onChange={(value) => setCaptchaValue(value)}
          />
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
        return formData.firstName && formData.lastName && isValidPhoneNumber(formData.phoneNumber)
      case 7:
        return captchaValue !== null
      default:
        return true
    }
  }

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
  )
}

export default ProjectManagementForm
