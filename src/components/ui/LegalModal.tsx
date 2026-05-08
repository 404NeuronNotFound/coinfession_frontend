"use client";

import { X } from "lucide-react";

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "terms" | "privacy";
}

export function LegalModal({ isOpen, onClose, type }: LegalModalProps) {
  if (!isOpen) return null;

  const isTerms = type === "terms";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal - Bond paper style */}
      <div className="relative w-full max-w-3xl max-h-[85vh] bg-white shadow-2xl overflow-hidden flex flex-col rounded-lg">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors z-10 cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-slate-700" />
        </button>

        {/* Content */}
        <div className="overflow-y-auto p-8 sm:p-12">
          {isTerms ? (
            <>
              <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">
                Terms of Service
              </h1>
              <p className="text-sm text-slate-500 mb-8">
                Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </p>

              <div className="space-y-6 text-slate-700 leading-relaxed">
                <section>
                  <h2 className="text-xl font-bold text-slate-900 mb-3">1. Acceptance of Terms</h2>
                  <p className="text-sm">
                    By accessing and using CoinFession (&quot;the Service&quot;), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use the Service.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-slate-900 mb-3">2. Description of Service</h2>
                  <p className="text-sm">
                    CoinFession is a cryptocurrency trading journal platform that allows users to log trades, track performance, analyze emotions, and receive AI-generated feedback. The Service is provided free of charge for personal use.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-slate-900 mb-3">3. User Accounts</h2>
                  <p className="text-sm mb-2">
                    To use certain features of the Service, you must register for an account. You agree to:
                  </p>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                    <li>Provide accurate, current, and complete information during registration</li>
                    <li>Maintain the security of your password and account</li>
                    <li>Notify us immediately of any unauthorized use of your account</li>
                    <li>Be responsible for all activities that occur under your account</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-slate-900 mb-3">4. User Content and Data</h2>
                  <p className="text-sm mb-2">
                    You retain all rights to the trading data, notes, and other content you submit to the Service (&quot;User Content&quot;). By submitting User Content, you grant us a license to use, store, and process it solely to provide and improve the Service.
                  </p>
                  <p className="text-sm">
                    You are responsible for maintaining backups of your User Content. We are not liable for any loss or corruption of User Content.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-slate-900 mb-3">5. Prohibited Uses</h2>
                  <p className="text-sm mb-2">You agree not to:</p>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                    <li>Use the Service for any illegal purpose or in violation of any laws</li>
                    <li>Attempt to gain unauthorized access to the Service or related systems</li>
                    <li>Interfere with or disrupt the Service or servers</li>
                    <li>Use automated systems to access the Service without permission</li>
                    <li>Impersonate any person or entity</li>
                    <li>Share your account credentials with others</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-slate-900 mb-3">6. AI-Generated Content</h2>
                  <p className="text-sm">
                    The Service uses artificial intelligence to analyze your trading patterns and provide feedback. AI-generated content is provided for informational purposes only and should not be considered financial advice. You acknowledge that AI analysis may contain errors or inaccuracies.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-slate-900 mb-3">7. No Financial Advice</h2>
                  <p className="text-sm">
                    CoinFession is a journaling and analysis tool only. Nothing on the Service constitutes financial, investment, trading, or other professional advice. You are solely responsible for your trading decisions and any resulting gains or losses.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-slate-900 mb-3">8. Disclaimer of Warranties</h2>
                  <p className="text-sm">
                    The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, either express or implied. We do not warrant that the Service will be uninterrupted, secure, or error-free.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-slate-900 mb-3">9. Limitation of Liability</h2>
                  <p className="text-sm">
                    To the maximum extent permitted by law, CoinFession and its developers shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of the Service.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-slate-900 mb-3">10. Termination</h2>
                  <p className="text-sm">
                    We reserve the right to suspend or terminate your account and access to the Service at any time, with or without notice, for any reason, including violation of these Terms.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-slate-900 mb-3">11. Changes to Terms</h2>
                  <p className="text-sm">
                    We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the new Terms on the Service. Your continued use of the Service after such changes constitutes acceptance of the new Terms.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-slate-900 mb-3">12. Contact</h2>
                  <p className="text-sm">
                    If you have any questions about these Terms, please contact us through our GitHub repository or social media channels listed on the website.
                  </p>
                </section>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">
                Privacy Policy
              </h1>
              <p className="text-sm text-slate-500 mb-8">
                Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </p>

              <div className="space-y-6 text-slate-700 leading-relaxed">
                <section>
                  <h2 className="text-xl font-bold text-slate-900 mb-3">1. Introduction</h2>
                  <p className="text-sm">
                    CoinFession (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our cryptocurrency trading journal service.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-slate-900 mb-3">2. Information We Collect</h2>
                  
                  <h3 className="text-base font-semibold text-slate-900 mb-2 mt-4">2.1 Account Information</h3>
                  <p className="text-sm mb-2">When you register, we collect:</p>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                    <li>Username</li>
                    <li>Email address</li>
                    <li>Password (encrypted)</li>
                    <li>First and last name</li>
                  </ul>

                  <h3 className="text-base font-semibold text-slate-900 mb-2 mt-4">2.2 Trading Data</h3>
                  <p className="text-sm mb-2">You voluntarily provide:</p>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                    <li>Trade details (coin, date, quantity, prices, fees)</li>
                    <li>Emotion tags and journal entries</li>
                    <li>Notes and observations about trades</li>
                    <li>Portfolio snapshots</li>
                  </ul>

                  <h3 className="text-base font-semibold text-slate-900 mb-2 mt-4">2.3 Usage Data</h3>
                  <p className="text-sm mb-2">We automatically collect:</p>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                    <li>Log data (IP address, browser type, pages visited)</li>
                    <li>Device information</li>
                    <li>Session information</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-slate-900 mb-3">3. How We Use Your Information</h2>
                  <p className="text-sm mb-2">We use your information to:</p>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                    <li>Provide and maintain the Service</li>
                    <li>Create and manage your account</li>
                    <li>Generate AI-powered trading analysis and feedback</li>
                    <li>Calculate performance metrics and statistics</li>
                    <li>Send important service notifications</li>
                    <li>Improve and optimize the Service</li>
                    <li>Detect and prevent fraud or abuse</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-slate-900 mb-3">4. Data Storage and Security</h2>
                  <p className="text-sm mb-2">
                    We implement appropriate technical and organizational measures to protect your data:
                  </p>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                    <li>Passwords are hashed using industry-standard algorithms</li>
                    <li>Data is transmitted over encrypted connections (HTTPS)</li>
                    <li>Access to user data is restricted to necessary operations only</li>
                    <li>Regular security updates and monitoring</li>
                  </ul>
                  <p className="text-sm mt-2">
                    However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-slate-900 mb-3">5. Third-Party Services</h2>
                  
                  <h3 className="text-base font-semibold text-slate-900 mb-2 mt-4">5.1 CoinGecko API</h3>
                  <p className="text-sm">
                    We use CoinGecko API to fetch cryptocurrency prices and market data. No personal information is shared with CoinGecko.
                  </p>

                  <h3 className="text-base font-semibold text-slate-900 mb-2 mt-4">5.2 Claude AI (Anthropic)</h3>
                  <p className="text-sm">
                    We use Claude AI to generate trading analysis and feedback. Your trading data is sent to Anthropic&apos;s API for processing. Anthropic&apos;s privacy policy applies to this data processing.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-slate-900 mb-3">6. Data Sharing and Disclosure</h2>
                  <p className="text-sm mb-2">
                    We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
                  </p>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                    <li>With your explicit consent</li>
                    <li>To comply with legal obligations</li>
                    <li>To protect our rights, privacy, safety, or property</li>
                    <li>In connection with a business transfer or acquisition</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-slate-900 mb-3">7. Your Rights</h2>
                  <p className="text-sm mb-2">You have the right to:</p>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                    <li>Access your personal data</li>
                    <li>Correct inaccurate data</li>
                    <li>Request deletion of your data</li>
                    <li>Export your data</li>
                    <li>Withdraw consent for data processing</li>
                    <li>Object to certain data processing activities</li>
                  </ul>
                  <p className="text-sm mt-2">
                    You can exercise these rights through your account settings or by contacting us.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-slate-900 mb-3">8. Data Retention</h2>
                  <p className="text-sm">
                    We retain your data for as long as your account is active or as needed to provide the Service. If you delete your account, we will delete your personal data within 30 days, except where we are required to retain it for legal purposes.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-slate-900 mb-3">9. Cookies and Tracking</h2>
                  <p className="text-sm">
                    We use essential cookies to maintain your session and authentication. We do not use tracking cookies or third-party analytics services.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-slate-900 mb-3">10. Children&apos;s Privacy</h2>
                  <p className="text-sm">
                    The Service is not intended for users under 18 years of age. We do not knowingly collect personal information from children under 18.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-slate-900 mb-3">11. International Users</h2>
                  <p className="text-sm">
                    Your information may be transferred to and processed in countries other than your own. By using the Service, you consent to such transfers.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-slate-900 mb-3">12. Changes to This Policy</h2>
                  <p className="text-sm">
                    We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-slate-900 mb-3">13. Contact Us</h2>
                  <p className="text-sm">
                    If you have questions about this Privacy Policy or our data practices, please contact us through our GitHub repository or social media channels listed on the website.
                  </p>
                </section>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
