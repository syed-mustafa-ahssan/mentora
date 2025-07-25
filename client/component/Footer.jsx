// components/Footer.jsx
import React from 'react';
import {
  BookOpen,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Courses', path: '/courses' },
      { name: 'Features', path: '#' },
      { name: 'Pricing', path: '#' },
      { name: ' Releases', path: '#' }
    ],
    company: [
      { name: 'About Us', path: '#' },
      { name: 'Careers', path: '#' },
      { name: 'Blog', path: '#' },
      { name: 'Press', path: '#' }
    ],
    resources: [
      { name: 'Documentation', path: '#' },
      { name: 'Support', path: '#' },
      { name: 'Community', path: '#' },
      { name: 'Partners', path: '#' }
    ],
    legal: [
      { name: 'Privacy Policy', path: '#' },
      { name: 'Terms of Service', path: '#' },
      { name: 'Cookie Policy', path: '#' },
      { name: 'GDPR', path: '#' }
    ]
  };

  const socialLinks = [
    { icon: <Facebook className="h-5 w-5" />, url: '#' },
    { icon: <Twitter className="h-5 w-5" />, url: '#' },
    { icon: <Linkedin className="h-5 w-5" />, url: '#' },
    { icon: <Instagram className="h-5 w-5" />, url: '#' },
    { icon: <Youtube className="h-5 w-5" />, url: '#' }
  ];

  return (
    <footer className="bg-zinc-900 border-t border-zinc-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-indigo-500" />
              <span className="ml-2 text-xl font-bold">Mentora</span>
            </div>
            <p className="mt-4 text-zinc-400 max-w-md">
              Empowering learners worldwide with high-quality courses and expert instruction. Advance your career with our comprehensive learning platform.
            </p>
            <div className="mt-6 flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-indigo-400 transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-200 tracking-wider uppercase">
              Product
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.product.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-zinc-400 hover:text-indigo-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-200 tracking-wider uppercase">
              Company
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-zinc-400 hover:text-indigo-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-200 tracking-wider uppercase">
              Resources
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-zinc-400 hover:text-indigo-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-200 tracking-wider uppercase">
              Legal
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-zinc-400 hover:text-indigo-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-16 pt-8 border-t border-zinc-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start">
              <Mail className="h-5 w-5 text-zinc-400 mt-0.5 flex-shrink-0" />
              <div className="ml-3">
                <h4 className="text-sm font-medium text-zinc-200">Email us</h4>
                <p className="mt-1 text-zinc-400 text-sm">support@mentora.com</p>
                <p className="text-zinc-400 text-sm">info@mentora.com</p>
              </div>
            </div>
            <div className="flex items-start">
              <Phone className="h-5 w-5 text-zinc-400 mt-0.5 flex-shrink-0" />
              <div className="ml-3">
                <h4 className="text-sm font-medium text-zinc-200">Call us</h4>
                <p className="mt-1 text-zinc-400 text-sm">0318-1231231</p>
                <p className="text-zinc-400 text-sm">Mon-Fri from 9am to 5pm</p>
              </div>
            </div>
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-zinc-400 mt-0.5 flex-shrink-0" />
              <div className="ml-3">
                <h4 className="text-sm font-medium text-zinc-200">Visit us</h4>
                <p className="mt-1 text-zinc-400 text-sm">Lahore</p>
                <p className="text-zinc-400 text-sm">Punjab, Pakistan</p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright and Bottom Links */}
        <div className="mt-16 pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-zinc-500 text-sm">
            &copy; {currentYear} Mentora. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link to="/accessibility" className="text-zinc-500 hover:text-zinc-400 text-sm">
              Accessibility
            </Link>
            <Link to="/sitemap" className="text-zinc-500 hover:text-zinc-400 text-sm">
              Sitemap
            </Link>
            <Link to="#" className="text-zinc-500 hover:text-zinc-400 text-sm">
              Status
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;