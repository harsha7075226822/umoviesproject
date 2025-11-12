import React, { useState } from 'react'
import { useNavigate } from 'react-router'

function OtpGeneration() {
  const navigate = useNavigate()

  // State declarations
  const [First, setFirst] = useState('')
  const [Second, setSecond] = useState('')
  const [Third, setThird] = useState('')
  const [Four, setFour] = useState('')
  const [generatedOtp, setGeneratedOtp] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)
  const [failure, setFailure] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [otpError, setOtpError] = useState('')
  const [newPass, setNewPass] = useState('')

  const otpvalue = `${First}${Second}${Third}${Four}`
  const setters = [setFirst, setSecond, setThird, setFour]
  const values = [First, Second, Third, Four]

  // 🔹 Handle Send OTP
  const handleSendOtp = async () => {
    const userDetails = { userEmail }
    const apiUrl = 'https://umoviesproject.onrender.com/check-email'
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userDetails),
    }

    try {
      const response = await fetch(apiUrl, options)
      const data = await response.json()
      console.log(data)
      setEmailError(data)

      // Generate random 4-digit OTP
      let otp = ''
      for (let i = 0; i < 4; i++) {
        otp += Math.floor(Math.random() * 10)
      }
      setGeneratedOtp(otp)

      if (data.success) {
        // Send OTP to user via webhook (n8n)
        const url =
          'http://localhost:5678/webhook/9e623b0f-13b5-4ef9-89bf-e30096b0c1b4'
        const otpDetails = { email: userEmail, otp }

        const webhookResponse = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(otpDetails),
        })

        if (webhookResponse.ok) {
          console.log('OTP sent successfully')
        } else {
          console.log('Failed to send OTP')
        }
      }
    } catch (error) {
      console.error('Error sending OTP:', error)
    }
  }

  // 🔹 Refs to manage OTP input focus
  const inputRefs = React.useRef([])

  // 🔹 OTP Input validation (numbers only) with auto advance
  const handleOtpChange = (index, setter) => (e) => {
    const value = e.target.value
    if (/^[0-9]?$/.test(value)) {
      setter(value)
      setOtpError('')
      if (value.length === 1 && index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1]?.focus()
      }
    } else {
      setOtpError(' Only numbers are allowed in OTP fields')
    }
  }

  // 🔹 Move focus to previous on Backspace when empty
  const handleKeyDown = (index) => (e) => {
    if (e.key === 'Backspace') {
      const currentValue = values[index]
      if (!currentValue && index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
    }
  }

  // 🔹 OTP Verification
  const handleOtp = () => {
    setError(false)
    setSuccess(false)
    setFailure(false)

    // Stop if error or invalid OTP
    if (otpError) {
      setError(true)
      return
    }

    if (otpvalue.length !== 4) {
      setError(true)
      return
    }

    if (otpvalue === generatedOtp) {
      setSuccess(true)
    } else {
      setFailure(true)
    }
  }

  // 🔹 Handle navigation
  const handleloginnav = () => {
    navigate('/login')
  }

  // 🔹 Handle new password input
  const handleNewpass = (e) => {
    setNewPass(e.target.value)
  }

  // 🔹 Handle password update
  const handleNewpassbtn = async (event) => {
    event.preventDefault()

    const userDetails = { email: userEmail, newPassword: newPass }
    const apiUrl = 'http://localhost:7899/updatepassword'
    const options = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()
    console.log(data)

    if (response.ok) {
      navigate('/', { replace: true })
    }
  }

  return (
    <div className="relative flex flex-col justify-center items-center min-h-screen bg-[url('https://res.cloudinary.com/dcttatiuj/image/upload/v1756136399/8ccaf66f19edc15e3aa6b6a1301fd6667bf2509e_1_xkw5s3.jpg')] bg-cover bg-center before:absolute before:inset-0 before:bg-black/40 before:z-0">
      <div className="relative z-10 flex flex-col justify-center items-center rounded-xl p-5 bg-white shadow-xl">
        <h1 className="font-bold text-5xl p-3 mb-2">Verify OTP</h1>

        <input
          onChange={(e) => setUserEmail(e.target.value)}
          type="email"
          className="border-2 h-[40px] w-[300px] text-center rounded-md mb-2"
          placeholder="Enter Registered Email"
        />
        {emailError && (
          <p className="text-red-500 text-md">{emailError.message}</p>
        )}

        <div className="flex">
          <button
            onClick={handleloginnav}
            className="bg-gray-500 text-white px-6 py-3 rounded-2xl m-2 hover:bg-gray-600"
          >
            Back to Login
          </button>
          <button
            onClick={handleSendOtp}
            className="bg-blue-500 text-white px-6 py-3 rounded-2xl m-2 hover:bg-blue-600"
          >
            Send OTP
          </button>
        </div>

        <div className="flex justify-center items-center p-3">
          {setters.map((setter, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              value={values[index]}
              onChange={handleOtpChange(index, setter)}
              onKeyDown={handleKeyDown(index)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className="border-2 text-center m-2 h-[60px] w-[60px] text-2xl font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          ))}
        </div>

        {otpError && <p className="text-red-500 text-md">{otpError}</p>}
        {error && !otpError && (
          <p className="text-red-500 text-md">⚠️ Invalid or Incomplete OTP</p>
        )}

        <button
          onClick={handleOtp}
          className="bg-green-500 text-white px-6 py-3 rounded-2xl font-bold text-xl hover:bg-green-600"
        >
          Submit OTP
        </button>

        {success && (
          <p className="text-green-500 text-xl mt-2">
            ✅ OTP Verified Successfully!
          </p>
        )}
        {failure && (
          <p className="text-red-500 text-xl mt-2"> Wrong OTP, try again.</p>
        )}

        {success && (
          <div className="flex flex-col mt-4">
            <hr className="my-3" />
            <input
              type="text"
              placeholder="Enter New Password"
              className="border-2 p-2 m-2 rounded-md text-center"
              onChange={handleNewpass}
            />
            <button
              onClick={handleNewpassbtn}
              className="bg-green-400 rounded-2xl p-2 text-xl hover:bg-green-500"
            >
              Update Password
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default OtpGeneration
