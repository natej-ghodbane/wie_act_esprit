import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
  Eye, EyeOff, User, Mail, Phone, Lock, MapPin, Camera, 
  CheckCircle, Shield, ArrowRight, Sparkles, UserCheck, 
  Briefcase, Sprout
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: 'farmer' | 'buyer';
  farmLocation?: string;
  profileImage?: File;
}

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: '' as any, // Force user to explicitly select a role
  });
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCountryCode, setSelectedCountryCode] = useState('+1');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    hasLowercase: false,
    hasUppercase: false,
    hasNumber: false,
    hasSpecialChar: false,
    hasMinLength: false,
    score: 0
  });

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
  }, []);

  // Country codes data
  const countryCodes = [
    { code: '+1', country: 'US/CA', flag: '🇺🇸' },
    { code: '+7', country: 'RU', flag: '�🇺' },
    { code: '+20', country: 'EG', flag: '🇪�🇬' },
    { code: '+27', country: 'ZA', flag: '�🇦' },
    { code: '+30', country: 'GR', flag: '🇬🇷' },
    { code: '+31', country: 'NL', flag: '🇳🇱' },
    { code: '+32', country: 'BE', flag: '�🇧🇪' },
    { code: '+33', country: 'FR', flag: '🇫🇷' },
    { code: '+34', country: 'ES', flag: '🇸' },
    { code: '+39', country: 'IT', flag: '🇮🇹' },
    { code: '+40', country: 'RO', flag: '🇷🇴' },
    { code: '+41', country: 'CH', flag: '🇨🇭' },
    { code: '+43', country: 'AT', flag: '🇦🇹' },
    { code: '+44', country: 'UK', flag: '🇬🇧' },
    { code: '+45', country: 'DK', flag: '🇩🇰' },
    { code: '+46', country: 'SE', flag: '��🇪' },
    { code: '+47', country: 'NO', flag: '�🇴' },
    { code: '+48', country: 'PL', flag: '🇵🇱' },
    { code: '+49', country: 'DE', flag: '🇩🇪' },
    { code: '+51', country: 'PE', flag: '🇵🇪' },
    { code: '+52', country: 'MX', flag: '🇲🇽' },
    { code: '+53', country: 'CU', flag: '🇨🇺' },
    { code: '+54', country: 'AR', flag: '🇦🇷' },
    { code: '+55', country: 'BR', flag: '🇧🇷' },
    { code: '+56', country: 'CL', flag: '🇨🇱' },
    { code: '+57', country: 'CO', flag: '🇨🇴' },
    { code: '+58', country: 'VE', flag: '🇻🇪' },
    { code: '+60', country: 'MY', flag: '🇲🇾' },
    { code: '+61', country: 'AU', flag: '🇦🇺' },
    { code: '+62', country: 'ID', flag: '🇮�' },
    { code: '+63', country: 'PH', flag: '🇵🇭' },
    { code: '+64', country: 'NZ', flag: '�🇳🇿' },
    { code: '+65', country: 'SG', flag: '🇸🇬' },
    { code: '+66', country: 'TH', flag: '🇹🇭' },
    { code: '+81', country: 'JP', flag: '🇯🇵' },
    { code: '+82', country: 'KR', flag: '🇰🇷' },
    { code: '+84', country: 'VN', flag: '🇻🇳' },
    { code: '+86', country: 'CN', flag: '🇨🇳' },
    { code: '+90', country: 'TR', flag: '��🇷' },
    { code: '+91', country: 'IN', flag: '🇮🇳' },
    { code: '+92', country: 'PK', flag: '🇵🇰' },
    { code: '+93', country: 'AF', flag: '🇦🇫' },
    { code: '+94', country: 'LK', flag: '🇱🇰' },
    { code: '+95', country: 'MM', flag: '🇲🇲' },
    { code: '+98', country: 'IR', flag: '🇮🇷' },
    { code: '+212', country: 'MA', flag: '🇲🇦' },
    { code: '+213', country: 'DZ', flag: '🇩🇿' },
    { code: '+216', country: 'TN', flag: '🇹🇳' },
    { code: '+218', country: 'LY', flag: '🇱🇾' },
    { code: '+220', country: 'GM', flag: '🇬🇲' },
    { code: '+221', country: 'SN', flag: '🇸🇳' },
    { code: '+222', country: 'MR', flag: '🇲🇷' },
    { code: '+223', country: 'ML', flag: '🇲🇱' },
    { code: '+224', country: 'GN', flag: '🇬🇳' },
    { code: '+225', country: 'CI', flag: '🇨🇮' },
    { code: '+226', country: 'BF', flag: '🇧🇫' },
    { code: '+227', country: 'NE', flag: '🇳🇪' },
    { code: '+228', country: 'TG', flag: '🇹🇬' },
    { code: '+229', country: 'BJ', flag: '🇧🇯' },
    { code: '+230', country: 'MU', flag: '🇲🇺' },
    { code: '+231', country: 'LR', flag: '🇱🇷' },
    { code: '+232', country: 'SL', flag: '🇸🇱' },
    { code: '+233', country: 'GH', flag: '🇬🇭' },
    { code: '+234', country: 'NG', flag: '🇳🇬' },
    { code: '+235', country: 'TD', flag: '🇹🇩' },
    { code: '+236', country: 'CF', flag: '🇨🇫' },
    { code: '+237', country: 'CM', flag: '🇨🇲' },
    { code: '+238', country: 'CV', flag: '🇨🇻' },
    { code: '+239', country: 'ST', flag: '🇸🇹' },
    { code: '+240', country: 'GQ', flag: '🇬🇶' },
    { code: '+241', country: 'GA', flag: '🇬🇦' },
    { code: '+242', country: 'CG', flag: '🇨🇬' },
    { code: '+243', country: 'CD', flag: '🇨🇩' },
    { code: '+244', country: 'AO', flag: '🇦🇴' },
    { code: '+245', country: 'GW', flag: '🇬🇼' },
    { code: '+246', country: 'IO', flag: '🇮🇴' },
    { code: '+247', country: 'AC', flag: '🇦🇨' },
    { code: '+248', country: 'SC', flag: '🇸🇨' },
    { code: '+249', country: 'SD', flag: '🇸🇩' },
    { code: '+250', country: 'RW', flag: '🇷🇼' },
    { code: '+251', country: 'ET', flag: '🇪🇹' },
    { code: '+252', country: 'SO', flag: '🇸🇴' },
    { code: '+253', country: 'DJ', flag: '🇩🇯' },
    { code: '+254', country: 'KE', flag: '🇰🇪' },
    { code: '+255', country: 'TZ', flag: '🇹🇿' },
    { code: '+256', country: 'UG', flag: '🇺🇬' },
    { code: '+257', country: 'BI', flag: '🇧🇮' },
    { code: '+258', country: 'MZ', flag: '🇲🇿' },
    { code: '+260', country: 'ZM', flag: '🇿🇲' },
    { code: '+261', country: 'MG', flag: '🇲🇬' },
    { code: '+262', country: 'YT', flag: '🇾🇹' },
    { code: '+263', country: 'ZW', flag: '🇿🇼' },
    { code: '+264', country: 'NA', flag: '🇳🇦' },
    { code: '+265', country: 'MW', flag: '🇲�' },
    { code: '+266', country: 'LS', flag: '🇱🇸' },
    { code: '+267', country: 'BW', flag: '🇧🇼' },
    { code: '+268', country: 'SZ', flag: '🇸🇿' },
    { code: '+269', country: 'KM', flag: '🇰🇲' },
    { code: '+290', country: 'SH', flag: '🇸🇭' },
    { code: '+291', country: 'ER', flag: '🇪🇷' },
    { code: '+297', country: 'AW', flag: '�🇦🇼' },
    { code: '+298', country: 'FO', flag: '🇫🇴' },
    { code: '+299', country: 'GL', flag: '🇬🇱' },
    { code: '+350', country: 'GI', flag: '🇬🇮' },
    { code: '+351', country: 'PT', flag: '🇵🇹' },
    { code: '+352', country: 'LU', flag: '🇱🇺' },
    { code: '+353', country: 'IE', flag: '🇮🇪' },
    { code: '+354', country: 'IS', flag: '🇮🇸' },
    { code: '+355', country: 'AL', flag: '🇦🇱' },
    { code: '+356', country: 'MT', flag: '🇲🇹' },
    { code: '+357', country: 'CY', flag: '🇨🇾' },
    { code: '+358', country: 'FI', flag: '🇫🇮' },
    { code: '+359', country: 'BG', flag: '🇧🇬' },
    { code: '+370', country: 'LT', flag: '🇱🇹' },
    { code: '+371', country: 'LV', flag: '🇱🇻' },
    { code: '+372', country: 'EE', flag: '🇪🇪' },
    { code: '+373', country: 'MD', flag: '🇲🇩' },
    { code: '+374', country: 'AM', flag: '🇦🇲' },
    { code: '+375', country: 'BY', flag: '🇧🇾' },
    { code: '+376', country: 'AD', flag: '🇦🇩' },
    { code: '+377', country: 'MC', flag: '🇲🇨' },
    { code: '+378', country: 'SM', flag: '🇸🇲' },
    { code: '+380', country: 'UA', flag: '🇺🇦' },
    { code: '+381', country: 'RS', flag: '🇷🇸' },
    { code: '+382', country: 'ME', flag: '🇲🇪' },
    { code: '+383', country: 'XK', flag: '🇽🇰' },
    { code: '+385', country: 'HR', flag: '🇭🇷' },
    { code: '+386', country: 'SI', flag: '🇸🇮' },
    { code: '+387', country: 'BA', flag: '🇧🇦' },
    { code: '+389', country: 'MK', flag: '🇲🇰' },
    { code: '+420', country: 'CZ', flag: '🇨🇿' },
    { code: '+421', country: 'SK', flag: '🇸🇰' },
    { code: '+423', country: 'LI', flag: '🇱🇮' },
    { code: '+500', country: 'FK', flag: '🇫🇰' },
    { code: '+501', country: 'BZ', flag: '�🇿' },
    { code: '+502', country: 'GT', flag: '🇬🇹' },
    { code: '+503', country: 'SV', flag: '🇸🇻' },
    { code: '+504', country: 'HN', flag: '🇭🇳' },
    { code: '+505', country: 'NI', flag: '🇳🇮' },
    { code: '+506', country: 'CR', flag: '🇨🇷' },
    { code: '+507', country: 'PA', flag: '🇵🇦' },
    { code: '+508', country: 'PM', flag: '🇵🇲' },
    { code: '+509', country: 'HT', flag: '🇭🇹' },
    { code: '+590', country: 'GP', flag: '🇬🇵' },
    { code: '+591', country: 'BO', flag: '🇧🇴' },
    { code: '+592', country: 'GY', flag: '🇬🇾' },
    { code: '+593', country: 'EC', flag: '🇪🇨' },
    { code: '+594', country: 'GF', flag: '🇬🇫' },
    { code: '+595', country: 'PY', flag: '🇵🇾' },
    { code: '+596', country: 'MQ', flag: '🇲🇶' },
    { code: '+597', country: 'SR', flag: '🇸🇷' },
    { code: '+598', country: 'UY', flag: '🇺🇾' },
    { code: '+599', country: 'CW', flag: '🇨🇼' },
    { code: '+670', country: 'TL', flag: '🇹🇱' },
    { code: '+672', country: 'AQ', flag: '🇦🇶' },
    { code: '+673', country: 'BN', flag: '🇧🇳' },
    { code: '+674', country: 'NR', flag: '🇳🇷' },
    { code: '+675', country: 'PG', flag: '�🇬' },
    { code: '+676', country: 'TO', flag: '🇹🇴' },
    { code: '+677', country: 'SB', flag: '🇸🇧' },
    { code: '+678', country: 'VU', flag: '🇻🇺' },
    { code: '+679', country: 'FJ', flag: '🇫🇯' },
    { code: '+680', country: 'PW', flag: '🇵🇼' },
    { code: '+681', country: 'WF', flag: '🇼🇫' },
    { code: '+682', country: 'CK', flag: '🇨🇰' },
    { code: '+683', country: 'NU', flag: '🇳🇺' },
    { code: '+684', country: 'AS', flag: '🇦🇸' },
    { code: '+685', country: 'WS', flag: '🇼🇸' },
    { code: '+686', country: 'KI', flag: '🇰🇮' },
    { code: '+687', country: 'NC', flag: '🇳🇨' },
    { code: '+688', country: 'TV', flag: '🇹🇻' },
    { code: '+689', country: 'PF', flag: '🇵🇫' },
    { code: '+690', country: 'TK', flag: '🇹🇰' },
    { code: '+691', country: 'FM', flag: '🇫🇲' },
    { code: '+692', country: 'MH', flag: '🇲🇭' },
    { code: '+850', country: 'KP', flag: '🇰🇵' },
    { code: '+852', country: 'HK', flag: '🇭🇰' },
    { code: '+853', country: 'MO', flag: '🇲🇴' },
    { code: '+855', country: 'KH', flag: '🇰🇭' },
    { code: '+856', country: 'LA', flag: '🇱🇦' },
    { code: '+880', country: 'BD', flag: '🇧🇩' },
    { code: '+886', country: 'TW', flag: '🇹🇼' },
    { code: '+960', country: 'MV', flag: '🇲🇻' },
    { code: '+961', country: 'LB', flag: '🇱🇧' },
    { code: '+962', country: 'JO', flag: '🇯🇴' },
    { code: '+963', country: 'SY', flag: '🇸🇾' },
    { code: '+964', country: 'IQ', flag: '🇮🇶' },
    { code: '+965', country: 'KW', flag: '🇰🇼' },
    { code: '+966', country: 'SA', flag: '🇸🇦' },
    { code: '+967', country: 'YE', flag: '🇾🇪' },
    { code: '+968', country: 'OM', flag: '🇴🇲' },
    { code: '+970', country: 'PS', flag: '🇵🇸' },
    { code: '+971', country: 'AE', flag: '🇦🇪' },
    { code: '+972', country: 'IL', flag: '🇮🇱' },
    { code: '+973', country: 'BH', flag: '🇧🇭' },
    { code: '+974', country: 'QA', flag: '🇶🇦' },
    { code: '+975', country: 'BT', flag: '🇧🇹' },
    { code: '+976', country: 'MN', flag: '🇲🇳' },
    { code: '+977', country: 'NP', flag: '🇳🇵' },
    { code: '+992', country: 'TJ', flag: '🇹🇯' },
    { code: '+993', country: 'TM', flag: '🇹🇲' },
    { code: '+994', country: 'AZ', flag: '🇦🇿' },
    { code: '+995', country: 'GE', flag: '🇬🇪' },
    { code: '+996', country: 'KG', flag: '🇰🇬' },
    { code: '+998', country: 'UZ', flag: '🇺🇿' },
  ];

  // Password strength checker
  const checkPasswordStrength = (password: string) => {
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[@$!%*?&]/.test(password);
    const hasMinLength = password.length >= 8;
    
    const score = [hasLowercase, hasUppercase, hasNumber, hasSpecialChar, hasMinLength].filter(Boolean).length;
    
    setPasswordStrength({
      hasLowercase,
      hasUppercase,
      hasNumber,
      hasSpecialChar,
      hasMinLength,
      score
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Check password strength when password field changes
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size should be less than 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      setFormData(prev => ({ ...prev, profileImage: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Enhanced Password Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    // Strong password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError('Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character (@$!%*?&)');
      setIsLoading(false);
      return;
    }

    try {
      // Register user
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone ? `${selectedCountryCode}${formData.phone}` : undefined,
        password: formData.password,
        role: formData.role,
        ...(formData.role === 'farmer' && formData.farmLocation && { farmLocation: formData.farmLocation }),
      };

      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed');
      }

      // Upload profile image if provided
      if (formData.profileImage && result._id) {
        try {
          const formDataImage = new FormData();
          formDataImage.append('profileImage', formData.profileImage);

          console.log('Uploading profile image for user:', result._id);
          const uploadResponse = await fetch(`/api/users/${result._id}/upload-profile-image`, {
            method: 'POST',
            body: formDataImage,
          });

          if (!uploadResponse.ok) {
            const uploadError = await uploadResponse.json();
            console.error('Profile image upload failed:', uploadError);
            // Don't fail registration if image upload fails, just log the error
          } else {
            const uploadResult = await uploadResponse.json();
            console.log('Profile image uploaded successfully:', uploadResult);
          }
        } catch (uploadErr) {
          console.error('Profile image upload error:', uploadErr);
          // Don't fail registration if image upload fails
        }
      }

      // Redirect to login page
      router.push('/auth/login?message=Registration successful! Please log in.');
      
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const getStepFields = (step: number) => {
    switch (step) {
      case 1:
        return ['firstName', 'lastName', 'email'];
      case 2:
        return ['phone', 'password', 'confirmPassword'];
      case 3:
        return ['role', 'farmLocation'];
      default:
        return [];
    }
  };

  const isStepValid = (step: number) => {
    const fields = getStepFields(step);
    return fields.every(field => {
      if (field === 'farmLocation' && formData.role !== 'farmer') return true;
      if (field === 'role') {
        // Ensure role is explicitly selected (not empty string)
        return formData.role === 'farmer' || formData.role === 'buyer';
      }
      return formData[field as keyof SignupFormData] && 
             String(formData[field as keyof SignupFormData]).trim() !== '';
    });
  };

  return (
    <>
      <Head>
        <title>Sign Up - KOFTI | Join the Agricultural Revolution</title>
        <meta name="description" content="Join KOFTI and connect with the future of agricultural commerce." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className={`min-h-screen transition-all duration-700 ${isDarkMode ? 'dark' : ''}`}>
        {/* Animated Background */}
        <div className="fixed inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-fuchsia-50 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900">
          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{
                x: [0, 150, 0],
                y: [0, -120, 0],
                rotate: [0, 270, 360],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-r from-purple-300/20 to-pink-300/20 rounded-full blur-xl"
            />
            <motion.div
              animate={{
                x: [0, -100, 0],
                y: [0, 100, 0],
                rotate: [360, 180, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute bottom-20 right-20 w-32 h-32 bg-gradient-to-r from-pink-300/20 to-fuchsia-300/20 rounded-full blur-xl"
            />
            <motion.div
              animate={{
                x: [0, 80, 0],
                y: [0, -80, 0],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 18,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-1/2 right-1/4 w-28 h-28 bg-gradient-to-r from-fuchsia-300/20 to-purple-300/20 rounded-full blur-lg"
            />
          </div>

          {/* Mesh Gradient Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(99,102,241,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_70%,rgba(67,56,202,0.2),transparent_50%)]" />
        </div>

        {/* Dark Mode Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleDarkMode}
          className="fixed top-6 right-6 z-50 p-3 bg-white/10 dark:bg-gray-800/10 backdrop-blur-md rounded-full border border-white/20 dark:border-gray-700/20 shadow-lg"
          aria-label="Toggle dark mode"
        >
          <motion.div
            animate={{ rotate: isDarkMode ? 180 : 0 }}
            transition={{ duration: 0.5 }}
          >
            {isDarkMode ? (
              <div className="w-6 h-6 bg-yellow-300 rounded-full shadow-lg" />
            ) : (
              <div className="w-6 h-6 bg-gray-700 rounded-full shadow-lg" />
            )}
          </motion.div>
        </motion.button>

        {/* Main Content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-lg"
          >
            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex justify-between items-center">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <motion.div
                      animate={{
                        scale: currentStep === step ? 1.2 : 1,
                        backgroundColor: currentStep >= step ? '#8B5CF6' : '#E5E7EB'
                      }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
                        currentStep >= step ? 'bg-purple-600' : 'bg-gray-300'
                      }`}
                    >
                      {currentStep > step ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        step
                      )}
                    </motion.div>
                    {step < 3 && (
                      <div className={`w-16 h-1 mx-2 rounded-full transition-colors duration-300 ${
                        currentStep > step ? 'bg-purple-600' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-600 dark:text-gray-400">
                <span>Personal</span>
                <span>Security</span>
                <span>Profile</span>
              </div>
            </div>

            {/* Glassmorphism Container */}
            <div className="relative">
              {/* Glowing Border Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-fuchsia-600 rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-1000" />
              
              <div className="relative bg-white/20 dark:bg-gray-900/20 backdrop-blur-2xl rounded-3xl p-8 border border-white/30 dark:border-gray-700/30 shadow-2xl">
                {/* Header */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="text-center mb-8"
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.05, 1],
                      rotate: [0, -5, 5, 0]
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="inline-block mb-4"
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <UserCheck className="w-8 h-8 text-white" />
                    </div>
                  </motion.div>
                  
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-fuchsia-600 dark:from-purple-400 dark:via-pink-400 dark:to-fuchsia-400 bg-clip-text text-transparent mb-2">
                    Join KOFTI
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Create your agricultural marketplace account
                  </p>
                </motion.div>

                {/* Error Messages */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.9 }}
                      className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 rounded-2xl"
                    >
                      <p className="text-sm font-medium">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <AnimatePresence mode="wait">
                    {/* Step 1: Personal Information */}
                    {currentStep === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        {/* Profile Image Upload */}
                        <div className="flex flex-col items-center space-y-4">
                          <div className="relative">
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 flex items-center justify-center border-4 border-white/20 shadow-lg cursor-pointer"
                            >
                              {imagePreview ? (
                                <img src={imagePreview} alt="Profile preview" className="w-full h-full object-cover" />
                              ) : (
                                <Camera className="w-8 h-8 text-purple-500" />
                              )}
                            </motion.div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Upload profile picture (optional)</p>
                        </div>

                        {/* Name Fields */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <User className={`w-5 h-5 transition-colors duration-200 ${
                                focusedField === 'firstName' 
                                  ? 'text-purple-500' 
                                  : 'text-gray-400 dark:text-gray-500'
                              }`} />
                            </div>
                            <input
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              onFocus={() => setFocusedField('firstName')}
                              onBlur={() => setFocusedField(null)}
                              placeholder="First name"
                              required
                              className="w-full pl-12 pr-4 py-4 bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 shadow-lg"
                            />
                          </div>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <User className={`w-5 h-5 transition-colors duration-200 ${
                                focusedField === 'lastName' 
                                  ? 'text-purple-500' 
                                  : 'text-gray-400 dark:text-gray-500'
                              }`} />
                            </div>
                            <input
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              onFocus={() => setFocusedField('lastName')}
                              onBlur={() => setFocusedField(null)}
                              placeholder="Last name"
                              required
                              className="w-full pl-12 pr-4 py-4 bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 shadow-lg"
                            />
                          </div>
                        </div>

                        {/* Email Field */}
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail className={`w-5 h-5 transition-colors duration-200 ${
                              focusedField === 'email' 
                                ? 'text-purple-500' 
                                : 'text-gray-400 dark:text-gray-500'
                            }`} />
                          </div>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            onFocus={() => setFocusedField('email')}
                            onBlur={() => setFocusedField(null)}
                            placeholder="Email address"
                            required
                            className="w-full pl-12 pr-4 py-4 bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 shadow-lg"
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* Step 2: Security */}
                    {currentStep === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        {/* Phone Field */}
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Phone className={`w-5 h-5 transition-colors duration-200 ${
                              focusedField === 'phone' 
                                ? 'text-purple-500' 
                                : 'text-gray-400 dark:text-gray-500'
                            }`} />
                          </div>
                          <select
                            value={selectedCountryCode}
                            onChange={(e) => setSelectedCountryCode(e.target.value)}
                            className="absolute inset-y-0 left-12 w-20 bg-transparent text-gray-900 dark:text-white text-sm focus:outline-none"
                          >
                            {countryCodes.slice(0, 10).map((country) => (
                              <option key={country.code} value={country.code}>
                                {country.code}
                              </option>
                            ))}
                          </select>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            onFocus={() => setFocusedField('phone')}
                            onBlur={() => setFocusedField(null)}
                            placeholder="Phone number"
                            required
                            className="w-full pl-32 pr-4 py-4 bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 shadow-lg"
                          />
                        </div>

                        {/* Password Field */}
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className={`w-5 h-5 transition-colors duration-200 ${
                              focusedField === 'password' 
                                ? 'text-purple-500' 
                                : 'text-gray-400 dark:text-gray-500'
                            }`} />
                          </div>
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            onFocus={() => setFocusedField('password')}
                            onBlur={() => setFocusedField(null)}
                            placeholder="Password (min 8 characters)"
                            required
                            className="w-full pl-12 pr-14 py-4 bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 shadow-lg"
                          />
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-purple-500 transition-colors duration-200"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </motion.button>
                        </div>

                        {/* Password Strength Indicator */}
                        {formData.password && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="space-y-2"
                          >
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-600 dark:text-gray-400">Password Strength</span>
                              <span className={`font-medium ${
                                passwordStrength.score === 5 ? 'text-green-500' :
                                passwordStrength.score >= 3 ? 'text-yellow-500' :
                                'text-red-500'
                              }`}>
                                {passwordStrength.score === 5 ? 'Strong' :
                                 passwordStrength.score >= 3 ? 'Medium' :
                                 'Weak'}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200/50 dark:bg-gray-700/50 rounded-full h-2">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                                transition={{ duration: 0.5 }}
                                className={`h-2 rounded-full transition-colors duration-300 ${
                                  passwordStrength.score === 5 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                                  passwordStrength.score >= 3 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                                  'bg-gradient-to-r from-red-400 to-red-600'
                                }`}
                              />
                            </div>
                          </motion.div>
                        )}

                        {/* Confirm Password Field */}
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Shield className={`w-5 h-5 transition-colors duration-200 ${
                              focusedField === 'confirmPassword' 
                                ? 'text-purple-500' 
                                : 'text-gray-400 dark:text-gray-500'
                            }`} />
                          </div>
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            onFocus={() => setFocusedField('confirmPassword')}
                            onBlur={() => setFocusedField(null)}
                            placeholder="Confirm password"
                            required
                            className="w-full pl-12 pr-14 py-4 bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 shadow-lg"
                          />
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-purple-500 transition-colors duration-200"
                          >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </motion.button>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 3: Profile Setup */}
                    {currentStep === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        {/* Role Selection */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white text-center">Choose your role</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, role: 'farmer' }))}
                              className={`p-6 rounded-2xl border-2 transition-all duration-200 ${
                                formData.role === 'farmer'
                                  ? 'border-purple-500 bg-purple-500/10 dark:bg-purple-500/20'
                                  : 'border-white/20 dark:border-gray-700/20 bg-white/5 dark:bg-gray-800/5'
                              }`}
                            >
                              <Sprout className={`w-8 h-8 mx-auto mb-3 ${
                                formData.role === 'farmer' ? 'text-purple-500' : 'text-gray-400'
                              }`} />
                              <div className="text-center">
                                <h4 className="font-semibold text-gray-900 dark:text-white">Farmer</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Sell your produce</p>
                              </div>
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, role: 'buyer' }))}
                              className={`p-6 rounded-2xl border-2 transition-all duration-200 ${
                                formData.role === 'buyer'
                                  ? 'border-purple-500 bg-purple-500/10 dark:bg-purple-500/20'
                                  : 'border-white/20 dark:border-gray-700/20 bg-white/5 dark:bg-gray-800/5'
                              }`}
                            >
                              <Briefcase className={`w-8 h-8 mx-auto mb-3 ${
                                formData.role === 'buyer' ? 'text-purple-500' : 'text-gray-400'
                              }`} />
                              <div className="text-center">
                                <h4 className="font-semibold text-gray-900 dark:text-white">Buyer</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Purchase fresh goods</p>
                              </div>
                            </motion.button>
                          </div>
                        </div>

                        {/* Farm Location (if farmer) */}
                        <AnimatePresence>
                          {formData.role === 'farmer' && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="relative"
                            >
                              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <MapPin className={`w-5 h-5 transition-colors duration-200 ${
                                  focusedField === 'farmLocation' 
                                    ? 'text-purple-500' 
                                    : 'text-gray-400 dark:text-gray-500'
                                }`} />
                              </div>
                              <input
                                type="text"
                                name="farmLocation"
                                value={formData.farmLocation || ''}
                                onChange={handleInputChange}
                                onFocus={() => setFocusedField('farmLocation')}
                                onBlur={() => setFocusedField(null)}
                                placeholder="Farm location"
                                className="w-full pl-12 pr-4 py-4 bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 shadow-lg"
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Terms and Conditions */}
                        <div className="flex items-start space-x-3">
                          <input
                            id="agree-terms"
                            name="agree-terms"
                            type="checkbox"
                            required
                            className="mt-1 h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded transition-colors duration-200"
                          />
                          <label htmlFor="agree-terms" className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                            I agree to the{' '}
                            <a href="#" className="text-purple-600 dark:text-purple-400 hover:text-purple-500 font-medium transition-colors duration-200">
                              Terms and Conditions
                            </a>{' '}
                            and{' '}
                            <a href="#" className="text-purple-600 dark:text-purple-400 hover:text-purple-500 font-medium transition-colors duration-200">
                              Privacy Policy
                            </a>
                          </label>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-6">
                    {currentStep > 1 && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={prevStep}
                        className="px-6 py-3 bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 rounded-2xl text-gray-700 dark:text-gray-300 font-medium transition-all duration-200 hover:bg-white/20 dark:hover:bg-gray-800/20"
                      >
                        ← Previous
                      </motion.button>
                    )}
                    
                    <div className="flex-1" />
                    
                    {currentStep < 3 ? (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={nextStep}
                        disabled={!isStepValid(currentStep)}
                        className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-lg"
                      >
                        <span>Continue</span>
                        <ArrowRight className="w-5 h-5" />
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ 
                          scale: 1.02,
                          boxShadow: "0 20px 40px rgba(168, 85, 247, 0.4)"
                        }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isLoading}
                        className="px-8 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-fuchsia-600 text-white font-semibold rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-xl"
                      >
                        {isLoading ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                            />
                            <span>Creating Account...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-5 h-5" />
                            <span>Create Account</span>
                          </>
                        )}
                      </motion.button>
                    )}
                  </div>

                  {/* Sign In Link */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                    className="text-center pt-6 border-t border-white/10 dark:border-gray-700/10"
                  >
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Already have an account?{' '}
                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        href="/auth/login"
                        className="text-purple-600 dark:text-purple-400 hover:text-pink-500 font-semibold transition-colors duration-200"
                      >
                        Sign In →
                      </motion.a>
                    </p>
                  </motion.div>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}