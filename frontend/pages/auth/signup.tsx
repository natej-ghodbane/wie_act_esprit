import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Eye, EyeOff } from 'lucide-react';

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
    role: 'farmer',
  });
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCountryCode, setSelectedCountryCode] = useState('+1');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    hasLowercase: false,
    hasUppercase: false,
    hasNumber: false,
    hasSpecialChar: false,
    hasMinLength: false,
    score: 0
  });

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-rose-200 to-orange-200 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-pink-300/30 to-rose-300/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-300/30 to-yellow-300/30 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 max-w-md w-full space-y-8">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-pink-200/20">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              🌾 Join AGRI-HOPE
            </h2>
            <p className="mt-2 text-sm text-gray-700">
              Create your agricultural marketplace account
            </p>
          </div>

          {/* User Type Selection */}
          <div className="mt-6 flex rounded-lg bg-white/30 backdrop-blur-sm p-1">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, role: 'farmer' }))}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                formData.role === 'farmer'
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              🚜 Farmer
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, role: 'buyer' }))}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                formData.role === 'buyer'
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              🏪 Buyer
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              {/* Profile Image Upload */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Profile preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-gray-400 text-2xl">📸</div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <p className="text-xs text-gray-600">Click to upload profile picture (optional, max 5MB)</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="First name"
                    required
                    className="appearance-none relative block w-full px-4 py-3 border border-pink-200/30 placeholder-gray-500 text-gray-900 rounded-lg bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Last name"
                    required
                    className="appearance-none relative block w-full px-4 py-3 border border-pink-200/30 placeholder-gray-500 text-gray-900 rounded-lg bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                  />
                </div>
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email address"
                  required
                  className="appearance-none relative block w-full px-4 py-3 border border-pink-200/30 placeholder-gray-500 text-gray-900 rounded-lg bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                />
              </div>
              <div>
                <div className="flex">
                  {/* Country Code Selector */}
                  <select
                    value={selectedCountryCode}
                    onChange={(e) => setSelectedCountryCode(e.target.value)}
                    className="appearance-none relative block px-3 py-3 border border-pink-200/30 placeholder-gray-500 text-gray-900 rounded-l-lg bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors min-w-[80px]"
                  >
                    {countryCodes.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.flag} {country.code}
                      </option>
                    ))}
                  </select>
                  
                  {/* Phone Number Input */}
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Phone number"
                    pattern="[0-9]{8,15}"
                    title="Phone number must be 8-15 digits"
                    className="appearance-none relative block w-full px-4 py-3 border border-pink-200/30 border-l-0 placeholder-gray-500 text-gray-900 rounded-r-lg bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                  />
                </div>
              </div>
              <div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Password (min 8 characters)"
                    required
                    className="appearance-none relative block w-full px-4 py-3 pr-12 border border-pink-200/30 placeholder-gray-500 text-gray-900 rounded-lg bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-pink-500 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                
                {/* Password Strength Bar */}
                {formData.password && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-gray-600">Password Strength</span>
                      <span className={`font-medium ${
                        passwordStrength.score === 5 ? 'text-green-600' :
                        passwordStrength.score >= 3 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {passwordStrength.score === 5 ? 'Strong' :
                         passwordStrength.score >= 3 ? 'Medium' :
                         'Weak'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200/50 rounded-full h-2 backdrop-blur-sm">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ease-out ${
                          passwordStrength.score === 5 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                          passwordStrength.score >= 3 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                          'bg-gradient-to-r from-red-400 to-red-600'
                        }`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm password"
                  required
                  className="appearance-none relative block w-full px-4 py-3 pr-12 border border-pink-200/30 placeholder-gray-500 text-gray-900 rounded-lg bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-pink-500 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              
              {formData.role === 'farmer' && (
                <div>
                  <input
                    type="text"
                    name="farmLocation"
                    value={formData.farmLocation || ''}
                    onChange={handleInputChange}
                    placeholder="Farm location"
                    className="appearance-none relative block w-full px-4 py-3 border border-pink-200/30 placeholder-gray-500 text-gray-900 rounded-lg bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center">
              <input
                id="agree-terms"
                name="agree-terms"
                type="checkbox"
                required
                className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-pink-300 rounded"
              />
              <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-700">
                I agree to the{' '}
                <a href="#" className="text-pink-600 hover:text-pink-500">
                  Terms and Conditions
                </a>
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:scale-105 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Creating Account...' : 'Create AGRI-HOPE Account'}
              </button>
            </div>
            
            <div className="text-center">
              <a href="/auth/login" className="text-pink-600 hover:text-pink-500 transition-colors">
                Already have an account? Sign In
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}