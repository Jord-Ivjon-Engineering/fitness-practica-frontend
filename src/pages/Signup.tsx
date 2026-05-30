import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dumbbell, Mail, Lock, User, Loader2, Phone as PhoneIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import CountryCodeSelector from "@/components/CountryCodeSelector";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [countryCode, setCountryCode] = useState("+355"); // Default to Albania
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Comprehensive country codes with flags (Albania first as default, then sorted alphabetically)
  const allCountries = [
    { code: "+355", country: "Albania", flag: "🇦🇱", isoCode: "AL" },
    { code: "+213", country: "Algeria", flag: "🇩🇿", isoCode: "DZ" },
    { code: "+374", country: "Armenia", flag: "🇦🇲", isoCode: "AM" },
    { code: "+54", country: "Argentina", flag: "🇦🇷", isoCode: "AR" },
    { code: "+61", country: "Australia", flag: "🇦🇺", isoCode: "AU" },
    { code: "+43", country: "Austria", flag: "🇦🇹", isoCode: "AT" },
    { code: "+994", country: "Azerbaijan", flag: "🇦🇿", isoCode: "AZ" },
    { code: "+973", country: "Bahrain", flag: "🇧🇭", isoCode: "BH" },
    { code: "+880", country: "Bangladesh", flag: "🇧🇩", isoCode: "BD" },
    { code: "+375", country: "Belarus", flag: "🇧🇾", isoCode: "BY" },
    { code: "+32", country: "Belgium", flag: "🇧🇪", isoCode: "BE" },
    { code: "+591", country: "Bolivia", flag: "🇧🇴", isoCode: "BO" },
    { code: "+387", country: "Bosnia", flag: "🇧🇦", isoCode: "BA" },
    { code: "+55", country: "Brazil", flag: "🇧🇷", isoCode: "BR" },
    { code: "+673", country: "Brunei", flag: "🇧🇳", isoCode: "BN" },
    { code: "+359", country: "Bulgaria", flag: "🇧🇬", isoCode: "BG" },
    { code: "+855", country: "Cambodia", flag: "🇰🇭", isoCode: "KH" },
    { code: "+1", country: "Canada", flag: "🇨🇦", isoCode: "CA" },
    { code: "+56", country: "Chile", flag: "🇨🇱", isoCode: "CL" },
    { code: "+86", country: "China", flag: "🇨🇳", isoCode: "CN" },
    { code: "+57", country: "Colombia", flag: "🇨🇴", isoCode: "CO" },
    { code: "+506", country: "Costa Rica", flag: "🇨🇷", isoCode: "CR" },
    { code: "+385", country: "Croatia", flag: "🇭🇷", isoCode: "HR" },
    { code: "+357", country: "Cyprus", flag: "🇨🇾", isoCode: "CY" },
    { code: "+420", country: "Czech Republic", flag: "🇨🇿", isoCode: "CZ" },
    { code: "+45", country: "Denmark", flag: "🇩🇰", isoCode: "DK" },
    { code: "+593", country: "Ecuador", flag: "🇪🇨", isoCode: "EC" },
    { code: "+20", country: "Egypt", flag: "🇪🇬", isoCode: "EG" },
    { code: "+503", country: "El Salvador", flag: "🇸🇻", isoCode: "SV" },
    { code: "+372", country: "Estonia", flag: "🇪🇪", isoCode: "EE" },
    { code: "+358", country: "Finland", flag: "🇫🇮", isoCode: "FI" },
    { code: "+33", country: "France", flag: "🇫🇷", isoCode: "FR" },
    { code: "+995", country: "Georgia", flag: "🇬🇪", isoCode: "GE" },
    { code: "+49", country: "Germany", flag: "🇩🇪", isoCode: "DE" },
    { code: "+233", country: "Ghana", flag: "🇬🇭", isoCode: "GH" },
    { code: "+30", country: "Greece", flag: "🇬🇷", isoCode: "GR" },
    { code: "+502", country: "Guatemala", flag: "🇬🇹", isoCode: "GT" },
    { code: "+504", country: "Honduras", flag: "🇭🇳", isoCode: "HN" },
    { code: "+852", country: "Hong Kong", flag: "🇭🇰", isoCode: "HK" },
    { code: "+36", country: "Hungary", flag: "🇭🇺", isoCode: "HU" },
    { code: "+354", country: "Iceland", flag: "🇮🇸", isoCode: "IS" },
    { code: "+91", country: "India", flag: "🇮🇳", isoCode: "IN" },
    { code: "+62", country: "Indonesia", flag: "🇮🇩", isoCode: "ID" },
    { code: "+353", country: "Ireland", flag: "🇮🇪", isoCode: "IE" },
    { code: "+972", country: "Israel", flag: "🇮🇱", isoCode: "IL" },
    { code: "+39", country: "Italy", flag: "🇮🇹", isoCode: "IT" },
    { code: "+1", country: "Jamaica", flag: "🇯🇲", isoCode: "JM" },
    { code: "+81", country: "Japan", flag: "🇯🇵", isoCode: "JP" },
    { code: "+962", country: "Jordan", flag: "🇯🇴", isoCode: "JO" },
    { code: "+7", country: "Kazakhstan", flag: "🇰🇿", isoCode: "KZ" },
    { code: "+254", country: "Kenya", flag: "🇰🇪", isoCode: "KE" },
    { code: "+82", country: "South Korea", flag: "🇰🇷", isoCode: "KR" },
    { code: "+383", country: "Kosovo", flag: "🇽🇰", isoCode: "XK" },
    { code: "+965", country: "Kuwait", flag: "🇰🇼", isoCode: "KW" },
    { code: "+856", country: "Laos", flag: "🇱🇦", isoCode: "LA" },
    { code: "+371", country: "Latvia", flag: "🇱🇻", isoCode: "LV" },
    { code: "+961", country: "Lebanon", flag: "🇱🇧", isoCode: "LB" },
    { code: "+370", country: "Lithuania", flag: "🇱🇹", isoCode: "LT" },
    { code: "+352", country: "Luxembourg", flag: "🇱🇺", isoCode: "LU" },
    { code: "+60", country: "Malaysia", flag: "🇲🇾", isoCode: "MY" },
    { code: "+356", country: "Malta", flag: "🇲🇹", isoCode: "MT" },
    { code: "+52", country: "Mexico", flag: "🇲🇽", isoCode: "MX" },
    { code: "+382", country: "Montenegro", flag: "🇲🇪", isoCode: "ME" },
    { code: "+212", country: "Morocco", flag: "🇲🇦", isoCode: "MA" },
    { code: "+95", country: "Myanmar", flag: "🇲🇲", isoCode: "MM" },
    { code: "+31", country: "Netherlands", flag: "🇳🇱", isoCode: "NL" },
    { code: "+64", country: "New Zealand", flag: "🇳🇿", isoCode: "NZ" },
    { code: "+505", country: "Nicaragua", flag: "🇳🇮", isoCode: "NI" },
    { code: "+234", country: "Nigeria", flag: "🇳🇬", isoCode: "NG" },
    { code: "+47", country: "Norway", flag: "🇳🇴", isoCode: "NO" },
    { code: "+968", country: "Oman", flag: "🇴🇲", isoCode: "OM" },
    { code: "+92", country: "Pakistan", flag: "🇵🇰", isoCode: "PK" },
    { code: "+507", country: "Panama", flag: "🇵🇦", isoCode: "PA" },
    { code: "+595", country: "Paraguay", flag: "🇵🇾", isoCode: "PY" },
    { code: "+51", country: "Peru", flag: "🇵🇪", isoCode: "PE" },
    { code: "+63", country: "Philippines", flag: "🇵🇭", isoCode: "PH" },
    { code: "+48", country: "Poland", flag: "🇵🇱", isoCode: "PL" },
    { code: "+351", country: "Portugal", flag: "🇵🇹", isoCode: "PT" },
    { code: "+974", country: "Qatar", flag: "🇶🇦", isoCode: "QA" },
    { code: "+40", country: "Romania", flag: "🇷🇴", isoCode: "RO" },
    { code: "+7", country: "Russia", flag: "🇷🇺", isoCode: "RU" },
    { code: "+966", country: "Saudi Arabia", flag: "🇸🇦", isoCode: "SA" },
    { code: "+381", country: "Serbia", flag: "🇷🇸", isoCode: "RS" },
    { code: "+65", country: "Singapore", flag: "🇸🇬", isoCode: "SG" },
    { code: "+421", country: "Slovakia", flag: "🇸🇰", isoCode: "SK" },
    { code: "+386", country: "Slovenia", flag: "🇸🇮", isoCode: "SI" },
    { code: "+27", country: "South Africa", flag: "🇿🇦", isoCode: "ZA" },
    { code: "+34", country: "Spain", flag: "🇪🇸", isoCode: "ES" },
    { code: "+94", country: "Sri Lanka", flag: "🇱🇰", isoCode: "LK" },
    { code: "+46", country: "Sweden", flag: "🇸🇪", isoCode: "SE" },
    { code: "+41", country: "Switzerland", flag: "🇨🇭", isoCode: "CH" },
    { code: "+886", country: "Taiwan", flag: "🇹🇼", isoCode: "TW" },
    { code: "+66", country: "Thailand", flag: "🇹🇭", isoCode: "TH" },
    { code: "+1", country: "Trinidad", flag: "🇹🇹", isoCode: "TT" },
    { code: "+216", country: "Tunisia", flag: "🇹🇳", isoCode: "TN" },
    { code: "+90", country: "Turkey", flag: "🇹🇷", isoCode: "TR" },
    { code: "+971", country: "UAE", flag: "🇦🇪", isoCode: "AE" },
    { code: "+380", country: "Ukraine", flag: "🇺🇦", isoCode: "UA" },
    { code: "+44", country: "UK", flag: "🇬🇧", isoCode: "GB" },
    { code: "+1", country: "USA", flag: "🇺🇸", isoCode: "US" },
    { code: "+598", country: "Uruguay", flag: "🇺🇾", isoCode: "UY" },
    { code: "+58", country: "Venezuela", flag: "🇻🇪", isoCode: "VE" },
    { code: "+84", country: "Vietnam", flag: "🇻🇳", isoCode: "VN" },
  ];
  
  // Sort alphabetically but keep Albania first
  const albania = allCountries.find(c => c.code === "+355");
  const otherCountries = allCountries.filter(c => c.code !== "+355").sort((a, b) => a.country.localeCompare(b.country));
  const countryCodes = albania ? [albania, ...otherCountries] : otherCountries;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError(t('signup.passwordsNotMatch'));
      return;
    }

    if (password.length < 6) {
      setError(t('signup.passwordTooShort'));
      return;
    }

    if (!phone || phone.trim() === "") {
      setError(t('signup.phoneRequired'));
      return;
    }

    setIsLoading(true);

    try {
      const fullPhoneNumber = `${countryCode}${phone.trim()}`;
      await signup(email, password, name, fullPhoneNumber);
      navigate("/admin/dashboard");
    } catch (err: any) {
      const message = err.message;
      setError(
        message?.startsWith('login.') || message?.startsWith('signup.')
          ? t(message)
          : message || t('signup.failed')
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 pt-24">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Dumbbell className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">Fitness Practica</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">{t('signup.title')}</h1>
          <p className="text-muted-foreground">{t('signup.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-foreground">
              {t('signup.name')}
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={t('signup.namePlaceholder')}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium text-foreground">
              {t('signup.phone')} <span className="text-destructive">*</span>
            </label>
            <div className="flex gap-2">
              <CountryCodeSelector
                countries={countryCodes}
                value={countryCode}
                onChange={setCountryCode}
              />
              <div className="relative flex-1">
                <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={t('signup.phonePlaceholder')}
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              {t('signup.email')}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={t('signup.emailPlaceholder')}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              {t('signup.password')}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={t('signup.passwordPlaceholder')}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
              {t('signup.confirmPassword')}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={t('signup.confirmPasswordPlaceholder')}
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[hsl(14,90%,55%)] to-[hsl(25,95%,53%)] hover:opacity-90 transition-opacity"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t('signup.creating')}
              </>
            ) : (
              t('signup.createAccount')
            )}
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          {t('signup.hasAccount')}{" "}
          <Link to="/login" className="text-primary hover:underline font-medium">
            {t('signup.signIn')}
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Signup;

