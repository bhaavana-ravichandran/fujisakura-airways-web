# ✈️ Fujisakura Airways - Flight Booking System

A modern, responsive flight booking web application built with Next.js, Tailwind CSS, and shadcn/ui components.

## 🌟 Features

### 🎨 **User Interface**
- **Beautiful Landing Page** with animated airplane backgrounds
- **Responsive Design** that works on all devices
- **Glass-morphism UI** with backdrop blur effects
- **Smooth Animations** and transitions throughout the app

### 🔐 **Authentication System**
- **User Registration** with form validation
- **Login System** with email/phone support
- **Password Recovery** functionality
- **Form Validation** with real-time feedback

### ✈️ **Flight Search & Booking**
- **Multi-trip Support** (One-way, Round-trip, Multi-city)
- **Fare Type Selection** with automatic discounts:
  - Regular (0% discount)
  - Student (10% discount)
  - Senior Citizen (15% discount)
  - Armed Forces (20% discount)
- **Smart Flight Filtering** by route and fare eligibility
- **Real-time Price Calculation** with discount display
- **Multiple Airlines** and aircraft types

### 🎯 **Pages & Navigation**
- **Landing Page** - Welcome and main navigation
- **Home Page** - Flight search interface
- **Flights Page** - Search results with filtering
- **Authentication Pages** - Login, Signup, Forgot Password
- **Support Pages** - Contact, Privacy Policy, Terms of Service

## 🛠️ **Tech Stack**

- **Framework:** Next.js 14.2.35
- **Styling:** Tailwind CSS 4.1.18
- **UI Components:** shadcn/ui
- **Language:** JavaScript (ES6+)
- **Package Manager:** npm

## 📦 **Dependencies**

```json
{
  "next": "^14.2.35",
  "react": "^18",
  "react-dom": "^18",
  "tailwindcss": "^4.1.18",
  "clsx": "^2.1.1",
  "tailwind-merge": "^3.4.0",
  "class-variance-authority": "^0.7.1",
  "lucide-react": "^0.562.0"
}
```

## 🚀 **Getting Started**

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/fujisakura-airways-web.git
   cd fujisakura-airways-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 **Project Structure**

```
fujisakura-airways-web/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.js            # Landing page
│   │   ├── home/              # Flight search page
│   │   ├── flights/           # Flight results page
│   │   ├── login/             # Authentication pages
│   │   ├── signup/
│   │   └── forgot-password/
│   ├── components/            # Reusable components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── Header.jsx        # Navigation header
│   │   └── Footer.jsx        # Site footer
│   ├── lib/                  # Utility functions
│   ├── styles/               # Global styles
│   └── utils/                # Helper functions
├── public/                   # Static assets
├── tailwind.config.js       # Tailwind configuration
└── package.json             # Project dependencies
```

## 🎨 **Design System**

### Color Palette
- **Primary:** Blue gradient (#007bff to #0056b3)
- **Background:** Sky blue gradient (#87CEEB to #F0F8FF)
- **Text:** Black (#000000) for high contrast
- **Accents:** Green (#28a745) for success states

### Components
- **Cards:** Glass-morphism with backdrop blur
- **Buttons:** Gradient backgrounds with hover effects
- **Forms:** Clean inputs with validation states
- **Animations:** Smooth transitions and flying airplanes

## 🔧 **Available Scripts**

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🌐 **Pages Overview**

| Page | Route | Description |
|------|-------|-------------|
| Landing | `/` | Welcome page with navigation |
| Home | `/home` | Flight search interface |
| Flights | `/flights` | Search results and booking |
| Login | `/login` | User authentication |
| Signup | `/signup` | User registration |
| Forgot Password | `/forgot-password` | Password recovery |

## 🎯 **Key Features Implemented**

### Flight Search Logic
- Route-based filtering (NYC↔London, Mumbai↔Dubai, etc.)
- Fare type eligibility checking
- Automatic discount calculation
- Fallback mechanisms for better UX

### Responsive Design
- Mobile-first approach
- Flexible layouts for all screen sizes
- Touch-friendly interface elements

### Form Validation
- Real-time validation feedback
- Email and phone number validation
- Password strength requirements
- Error handling and user feedback

## 🚧 **Future Enhancements**

- [ ] Backend API integration
- [ ] Real flight data integration
- [ ] Payment gateway integration
- [ ] User dashboard and booking history
- [ ] Email notifications
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Progressive Web App (PWA) features

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 **Author**

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 **Acknowledgments**

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for utility-first CSS
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Lucide React](https://lucide.dev/) for icons

---

⭐ **Star this repository if you found it helpful!**