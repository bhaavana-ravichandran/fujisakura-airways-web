# Fujisakura Airways - Project Structure & Documentation

## 📁 Current Project Structure

```
fujisakura-airways-web/
├── 📁 .next/                          # Next.js build output (auto-generated)
├── 📁 .vscode/                        # VS Code settings
│   └── settings.json                  # Tailwind CSS validation settings
├── 📁 node_modules/                   # Dependencies (auto-generated)
├── 📁 public/                         # Static assets
│   └── airplane-hero.svg              # Hero airplane icon
├── 📁 src/                            # Source code
│   ├── 📁 app/                        # Next.js App Router pages
│   │   ├── 📁 flights/                # Flight search results
│   │   │   └── page.js                # Flight listing page
│   │   ├── 📁 forgot-password/        # Password recovery
│   │   │   └── page.js                # ⭐ Forgot password form (shadcn Card)
│   │   ├── 📁 home/                   # Main flight search
│   │   │   └── page.js                # ⭐ Main search page (shadcn Card)
│   │   ├── 📁 login/                  # User authentication
│   │   │   └── page.js                # ⭐ Login form (shadcn Card)
│   │   ├── 📁 signup/                 # User registration
│   │   │   └── page.js                # ⭐ Registration form (shadcn Card)
│   │   ├── layout.js                  # Root layout component
│   │   └── page.js                    # ⭐ Landing page (shadcn Card)
│   ├── 📁 components/                 # Reusable components
│   │   ├── 📁 ui/                     # ⭐ shadcn/ui components
│   │   │   ├── button.jsx             # ⭐ shadcn Button component
│   │   │   ├── card.jsx               # ⭐ shadcn Card component
│   │   │   ├── input.jsx              # ⭐ shadcn Input component
│   │   │   └── label.jsx              # ⭐ shadcn Label component
│   │   ├── Button.jsx                 # Custom button component (legacy)
│   │   ├── CardDemo.jsx               # shadcn Card examples
│   │   ├── Footer.jsx                 # Site footer
│   │   ├── Header.jsx                 # Site header
│   │   └── InputField.jsx             # Form input component (legacy)
│   ├── 📁 lib/                        # Utility libraries
│   │   └── utils.js                   # ⭐ Tailwind class merging utility
│   ├── 📁 styles/                     # Global styles
│   │   └── globals.css                # ⭐ Tailwind + shadcn styles
│   └── 📁 utils/                      # Helper functions
│       └── helpers.js                 # Form validation utilities
├── .gitignore                         # Git ignore rules
├── jsconfig.json                      # JavaScript configuration
├── next.config.js                     # Next.js configuration
├── package.json                       # Dependencies & scripts
├── package-lock.json                  # Dependency lock file
├── postcss.config.js                  # ⭐ PostCSS + Tailwind config
├── tailwind.config.js                 # ⭐ Tailwind CSS configuration
└── PROJECT_STRUCTURE.md               # This documentation
```

## 🎨 Design System & Themes

### **Color Palette**
```css
Primary Colors:
- Sky Blue Gradient: #87CEEB → #98D8E8 → #B0E0E6 → #E0F6FF → #F0F8FF
- Primary Blue: #007bff, #0056b3 (buttons)
- Text Colors: #2c3e50 (headings), #7f8c8d (descriptions)
- Success: #d4edda, #c3e6cb (search results)
```

### **Typography**
```css
Font Family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
Headings: font-weight: 300, letter-spacing: 0.5px
Body: font-weight: 300-400
Labels: font-weight: 600, font-size: 0.8rem
```

### **Spacing System**
```css
Card Padding: 30px (consistent across all cards)
Form Gaps: 25px between sections
Element Margins: 5px breathing room from edges
Border Radius: 8px (inputs), 12px (buttons/containers), 15px (main card)
```

## 📄 Pages Overview

### **🏠 Home Page** (`/home`) - ⭐ MAIN PAGE
- **Purpose**: Flight search interface
- **Technology**: shadcn/ui Card components + Tailwind CSS
- **Features**:
  - One-way, Round-trip, Multi-city search
  - Animated airplane background
  - Glass-morphism card design
  - Form validation
  - Mock flight data integration
- **Status**: ✅ Complete with shadcn Card implementation

### **🏠 Landing Page** (`/`) - ⭐ UPDATED
- **Purpose**: Welcome page with call-to-action
- **Technology**: shadcn/ui Card + Button components
- **Features**:
  - Animated gradient background
  - Glass-morphism hero card
  - Navigation buttons to all pages
  - Smooth animations and hover effects
- **Status**: ✅ Complete with shadcn Card implementation

### **🔐 Authentication Pages** - ⭐ ALL UPDATED
- **Login** (`/login`): User sign-in form with shadcn Card
- **Signup** (`/signup`): User registration with shadcn Card and Input components
- **Forgot Password** (`/forgot-password`): Password recovery with shadcn Card
- **Features**:
  - Consistent card-based design
  - Form validation with shadcn Input components
  - Animated airplane backgrounds
  - Professional shadcn Button components
  - Glass-morphism styling
- **Status**: ✅ Complete with full shadcn/ui implementation

### **✈️ Flight Pages**
- **Flights** (`/flights`): Search results display
- **Status**: ✅ Basic structure complete (ready for shadcn upgrade)

## 🛠️ Technology Stack

### **Core Framework**
- **Next.js 14.2.35**: React framework with App Router
- **React 18**: UI library

### **Styling & UI** ⭐
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Professional component library
- **PostCSS**: CSS processing
- **Custom CSS**: Animations and glass-morphism effects

### **Development Tools**
- **ESLint**: Code linting
- **Autoprefixer**: CSS vendor prefixes

## 🎯 Key Features Implemented

### **✅ shadcn/ui Integration** ⭐ COMPLETE
- **Card component system** - Used across all pages
- **Input component** - Professional form inputs
- **Button component** - Consistent button styling
- **Label component** - Accessible form labels
- Proper TypeScript-like prop handling
- Tailwind class merging with `cn()` utility
- Professional component structure

### **✅ Form System**
- Multi-step flight search (one-way, round-trip, multi-city)
- Form validation utilities
- Dynamic form segments
- Mock data integration
- **shadcn Input components** for all forms

### **✅ Responsive Design**
- Mobile-friendly layouts
- Flexible grid systems
- Proper spacing and typography
- **Consistent card-based layouts**

### **✅ Animations**
- Smooth page transitions
- Flying airplane background (all pages)
- Hover effects on buttons
- Loading states
- **Glass-morphism effects**

## 📋 Maintenance Guidelines

### **Code Standards**
1. **Components**: Use functional components with hooks
2. **Styling**: Prefer Tailwind classes, use inline styles for complex animations
3. **File Structure**: Keep components in `/components`, pages in `/app`
4. **Naming**: Use PascalCase for components, camelCase for functions

### **shadcn/ui Usage**
1. **Import Pattern**: `import { Card, CardContent } from '@/components/ui/card'`
2. **Styling**: Use `className` for Tailwind, `style` for complex CSS
3. **Customization**: Override with inline styles when needed
4. **Consistency**: Maintain 30px padding standard

### **Theme Consistency**
1. **Colors**: Stick to the blue gradient theme
2. **Spacing**: Use the established 30px/25px/5px system
3. **Typography**: Maintain font weights and sizes
4. **Animations**: Keep smooth, professional transitions

## 🚀 Next Steps & Recommendations

### **Immediate Priorities**
1. **Complete Flight Results Page**: Style with shadcn Cards
2. **Add More shadcn Components**: Buttons, Inputs, Selects
3. **Implement Authentication Logic**: Connect forms to backend
4. **Add Loading States**: Skeleton components

### **Future Enhancements**
1. **Database Integration**: Real flight data
2. **User Dashboard**: Booking history
3. **Payment System**: Checkout flow
4. **Mobile App**: React Native version

## 📝 Development Notes

### **Current Status**: ✅ Phase 1 Complete
- shadcn/ui successfully integrated
- Home page redesigned with Card components
- Tailwind CSS properly configured
- All existing functionality preserved

### **Manager Requirements Met**: ✅
- shadcn/ui Card implemented as universal component
- No existing CSS/animations affected
- Professional component structure maintained
- Easy to use across the application

---

**Last Updated**: January 2026  
**Version**: 1.0.0  
**Status**: Production Ready