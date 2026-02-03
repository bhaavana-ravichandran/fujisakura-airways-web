'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { formatPrice, CURRENCY_CONFIG } from '../../utils/currency';

// Configuration-driven meal system (scalable architecture)
const MEAL_CONFIG = {
  ECONOMY_SAVER: {
    mealsEnabled: true,
    eligibility: {
      complimentaryMeals: 0,
      message: "Meals are not included in your fare. You may purchase one below.",
      badgeType: "paid"
    },
    allowedDietaryOptions: ['vegetarian', 'non-vegetarian', 'vegan'],
    availableMeals: [
      {
        id: 'veg_meal',
        name: 'Vegetarian Meal',
        baseType: 'veg',
        description: 'Traditional vegetarian meal with seasonal vegetables',
        price: 450,
        badge: '💰 Paid Meal',
        category: 'standard',
        dietaryTags: ['vegetarian'],
        isComplimentary: false
      },
      {
        id: 'non_veg_meal',
        name: 'Non-Vegetarian Meal',
        baseType: 'non-veg',
        description: 'Chicken or mutton with rice and vegetables',
        price: 550,
        badge: '💰 Paid Meal',
        category: 'standard',
        dietaryTags: ['non-vegetarian'],
        isComplimentary: false
      },
      {
        id: 'vegan_meal',
        name: 'Vegan Meal',
        baseType: 'veg',
        description: 'Plant-based meal with no animal products',
        price: 500,
        badge: '💰 Paid Meal',
        category: 'special',
        dietaryTags: ['vegetarian', 'vegan'],
        isComplimentary: false
      },
      {
        id: 'snack_box',
        name: 'Snack Box',
        baseType: 'veg',
        description: 'Light snacks with beverages',
        price: 250,
        badge: '💰 Paid Meal',
        category: 'light',
        dietaryTags: ['vegetarian'],
        isComplimentary: false
      },
      {
        id: 'beverage',
        name: 'Beverage Only',
        baseType: 'veg',
        description: 'Tea, coffee, or soft drinks',
        price: 150,
        badge: '💰 Paid Meal',
        category: 'beverage',
        dietaryTags: ['vegetarian'],
        isComplimentary: false
      }
    ]
  },
  ECONOMY_BASE: {
    mealsEnabled: true,
    eligibility: {
      complimentaryMeals: 1,
      message: "1 complimentary meal is included with your fare.",
      badgeType: "included"
    },
    allowedDietaryOptions: ['vegetarian', 'non-vegetarian', 'vegan', 'jain', 'gluten-free'],
    availableMeals: [
      {
        id: 'veg_meal',
        name: 'Vegetarian Meal',
        baseType: 'veg',
        description: 'Traditional vegetarian meal with seasonal vegetables',
        price: 0,
        badge: '✅ Included in your fare',
        category: 'complimentary',
        dietaryTags: ['vegetarian'],
        isComplimentary: true
      },
      {
        id: 'non_veg_meal',
        name: 'Non-Vegetarian Meal',
        baseType: 'non-veg',
        description: 'Chicken or mutton with rice and vegetables',
        price: 0,
        badge: '✅ Included in your fare',
        category: 'complimentary',
        dietaryTags: ['non-vegetarian'],
        isComplimentary: true
      },
      {
        id: 'jain_meal',
        name: 'Jain Meal',
        baseType: 'veg',
        description: 'Prepared without onion, garlic, and root vegetables',
        price: 200,
        badge: '💰 Paid Upgrade',
        category: 'special',
        dietaryTags: ['vegetarian', 'jain'],
        isComplimentary: false
      },
      {
        id: 'gluten_free',
        name: 'Gluten-Free Meal',
        baseType: 'veg',
        description: 'Specially prepared without gluten ingredients',
        price: 300,
        badge: '💰 Paid Upgrade',
        category: 'special',
        dietaryTags: ['vegetarian', 'gluten-free'],
        isComplimentary: false
      },
      {
        id: 'diabetic_meal',
        name: 'Diabetic Meal',
        baseType: 'veg',
        description: 'Low sugar, balanced nutrition meal',
        price: 250,
        badge: '💰 Paid Upgrade',
        category: 'special',
        dietaryTags: ['vegetarian'],
        isComplimentary: false
      },
      {
        id: 'vegan_meal',
        name: 'Vegan Meal',
        baseType: 'veg',
        description: 'Plant-based meal with no animal products',
        price: 200,
        badge: '💰 Paid Upgrade',
        category: 'special',
        dietaryTags: ['vegetarian', 'vegan'],
        isComplimentary: false
      }
    ]
  },
  ECONOMY_GREEN: {
    mealsEnabled: true,
    eligibility: {
      complimentaryMeals: 1,
      message: "Complimentary meal with access to special meals.",
      badgeType: "premium"
    },
    allowedDietaryOptions: ['vegetarian', 'non-vegetarian', 'vegan', 'jain', 'gluten-free'],
    availableMeals: [
      {
        id: 'veg_meal',
        name: 'Premium Vegetarian Meal',
        baseType: 'veg',
        description: 'Enhanced vegetarian meal with premium ingredients',
        price: 0,
        badge: '⭐ Complimentary',
        category: 'premium',
        dietaryTags: ['vegetarian'],
        isComplimentary: true
      },
      {
        id: 'non_veg_meal',
        name: 'Premium Non-Vegetarian Meal',
        baseType: 'non-veg',
        description: 'Premium chicken or mutton with enhanced sides',
        price: 0,
        badge: '⭐ Complimentary',
        category: 'premium',
        dietaryTags: ['non-vegetarian'],
        isComplimentary: true
      },
      {
        id: 'vegan_meal',
        name: 'Premium Vegan Meal',
        baseType: 'veg',
        description: 'Gourmet plant-based meal with organic ingredients',
        price: 0,
        badge: '⭐ Complimentary',
        category: 'premium',
        dietaryTags: ['vegetarian', 'vegan'],
        isComplimentary: true
      },
      {
        id: 'jain_meal',
        name: 'Premium Jain Meal',
        baseType: 'veg',
        description: 'Specially prepared premium Jain meal',
        price: 0,
        badge: '⭐ Complimentary',
        category: 'premium',
        dietaryTags: ['vegetarian', 'jain'],
        isComplimentary: true
      },
      {
        id: 'gluten_free',
        name: 'Premium Gluten-Free Meal',
        baseType: 'veg',
        description: 'Gourmet gluten-free meal with premium ingredients',
        price: 0,
        badge: '⭐ Complimentary',
        category: 'premium',
        dietaryTags: ['vegetarian', 'gluten-free'],
        isComplimentary: true
      }
    ]
  },
  
  // Premium Economy Meal Configuration
  PREMIUM_ECONOMY_LITE: {
    mealsEnabled: true,
    eligibility: {
      complimentaryMeals: 0,
      message: "Meals are not included in your fare. You may purchase one below.",
      badgeType: "paid"
    },
    allowedDietaryOptions: ['vegetarian', 'non-vegetarian', 'vegan', 'jain', 'gluten-free'],
    availableMeals: [
      {
        id: 'premium_veg_meal',
        name: 'Premium Veg Meal',
        baseType: 'veg',
        description: 'Enhanced vegetarian meal with premium ingredients',
        price: 650,
        badge: '💰 Paid Meal',
        category: 'premium',
        dietaryTags: ['vegetarian'],
        isComplimentary: false
      },
      {
        id: 'premium_non_veg_meal',
        name: 'Premium Non-Veg Meal',
        baseType: 'non-veg',
        description: 'Premium chicken or fish with gourmet sides',
        price: 750,
        badge: '💰 Paid Meal',
        category: 'premium',
        dietaryTags: ['non-vegetarian'],
        isComplimentary: false
      },
      {
        id: 'vegan_meal',
        name: 'Vegan Meal',
        baseType: 'veg',
        description: 'Gourmet plant-based meal with organic ingredients',
        price: 700,
        badge: '💰 Paid Meal',
        category: 'special',
        dietaryTags: ['vegetarian', 'vegan'],
        isComplimentary: false
      },
      {
        id: 'jain_meal',
        name: 'Jain Meal',
        baseType: 'veg',
        description: 'Specially prepared Jain meal without root vegetables',
        price: 650,
        badge: '💰 Paid Meal',
        category: 'special',
        dietaryTags: ['vegetarian', 'jain'],
        isComplimentary: false
      },
      {
        id: 'gluten_free',
        name: 'Gluten-Free Meal',
        baseType: 'veg',
        description: 'Premium gluten-free meal with special ingredients',
        price: 700,
        badge: '💰 Paid Meal',
        category: 'special',
        dietaryTags: ['vegetarian', 'gluten-free'],
        isComplimentary: false
      },
      {
        id: 'snack_box',
        name: 'Snack Box',
        baseType: 'veg',
        description: 'Premium snacks with artisanal beverages',
        price: 400,
        badge: '💰 Paid Meal',
        category: 'light',
        dietaryTags: ['vegetarian'],
        isComplimentary: false
      },
      {
        id: 'beverage',
        name: 'Beverage Only',
        baseType: 'veg',
        description: 'Premium tea, coffee, or specialty drinks',
        price: 250,
        badge: '💰 Paid Meal',
        category: 'beverage',
        dietaryTags: ['vegetarian'],
        isComplimentary: false
      }
    ]
  },
  
  PREMIUM_ECONOMY_STANDARD: {
    mealsEnabled: true,
    eligibility: {
      complimentaryMeals: 1,
      message: "1 complimentary premium meal is included with your fare.",
      badgeType: "included"
    },
    allowedDietaryOptions: ['vegetarian', 'non-vegetarian', 'vegan', 'jain', 'gluten-free'],
    availableMeals: [
      {
        id: 'premium_veg_meal',
        name: 'Premium Veg Meal',
        baseType: 'veg',
        description: 'Enhanced vegetarian meal with premium ingredients',
        price: 0,
        badge: '✅ Included',
        category: 'complimentary',
        dietaryTags: ['vegetarian'],
        isComplimentary: true
      },
      {
        id: 'premium_non_veg_meal',
        name: 'Premium Non-Veg Meal',
        baseType: 'non-veg',
        description: 'Premium chicken or fish with gourmet sides',
        price: 0,
        badge: '✅ Included',
        category: 'complimentary',
        dietaryTags: ['non-vegetarian'],
        isComplimentary: true
      },
      {
        id: 'vegan_meal',
        name: 'Vegan Meal',
        baseType: 'veg',
        description: 'Gourmet plant-based meal with organic ingredients',
        price: 300,
        badge: '💰 Upgrade',
        category: 'upgrade',
        dietaryTags: ['vegetarian', 'vegan'],
        isComplimentary: false
      },
      {
        id: 'jain_meal',
        name: 'Jain Meal',
        baseType: 'veg',
        description: 'Specially prepared Jain meal without root vegetables',
        price: 250,
        badge: '💰 Upgrade',
        category: 'upgrade',
        dietaryTags: ['vegetarian', 'jain'],
        isComplimentary: false
      },
      {
        id: 'gluten_free',
        name: 'Gluten-Free Meal',
        baseType: 'veg',
        description: 'Premium gluten-free meal with special ingredients',
        price: 300,
        badge: '💰 Upgrade',
        category: 'upgrade',
        dietaryTags: ['vegetarian', 'gluten-free'],
        isComplimentary: false
      },
      {
        id: 'diabetic_meal',
        name: 'Diabetic Meal',
        baseType: 'veg',
        description: 'Low sugar, balanced nutrition premium meal',
        price: 250,
        badge: '💰 Upgrade',
        category: 'upgrade',
        dietaryTags: ['vegetarian'],
        isComplimentary: false
      }
    ]
  },
  
  PREMIUM_ECONOMY_FLEX: {
    mealsEnabled: true,
    eligibility: {
      complimentaryMeals: 1,
      message: "Enjoy complimentary gourmet meals with full dietary options.",
      badgeType: "premium"
    },
    allowedDietaryOptions: ['vegetarian', 'non-vegetarian', 'vegan', 'jain', 'gluten-free'],
    availableMeals: [
      {
        id: 'gourmet_veg_meal',
        name: 'Gourmet Veg Meal',
        baseType: 'veg',
        description: 'Chef-curated vegetarian meal with seasonal specialties',
        price: 0,
        badge: '⭐ Complimentary',
        category: 'gourmet',
        dietaryTags: ['vegetarian'],
        isComplimentary: true
      },
      {
        id: 'gourmet_non_veg_meal',
        name: 'Gourmet Non-Veg Meal',
        baseType: 'non-veg',
        description: 'Premium seafood or poultry with artisanal preparation',
        price: 0,
        badge: '⭐ Complimentary',
        category: 'gourmet',
        dietaryTags: ['non-vegetarian'],
        isComplimentary: true
      },
      {
        id: 'vegan_meal',
        name: 'Vegan Meal',
        baseType: 'veg',
        description: 'Gourmet plant-based meal with organic ingredients',
        price: 0,
        badge: '⭐ Complimentary',
        category: 'gourmet',
        dietaryTags: ['vegetarian', 'vegan'],
        isComplimentary: true
      },
      {
        id: 'jain_meal',
        name: 'Jain Meal',
        baseType: 'veg',
        description: 'Gourmet Jain meal prepared with premium ingredients',
        price: 0,
        badge: '⭐ Complimentary',
        category: 'gourmet',
        dietaryTags: ['vegetarian', 'jain'],
        isComplimentary: true
      },
      {
        id: 'gluten_free',
        name: 'Gluten-Free Meal',
        baseType: 'veg',
        description: 'Gourmet gluten-free meal with artisanal ingredients',
        price: 0,
        badge: '⭐ Complimentary',
        category: 'gourmet',
        dietaryTags: ['vegetarian', 'gluten-free'],
        isComplimentary: true
      },
      {
        id: 'diabetic_meal',
        name: 'Diabetic Meal',
        baseType: 'veg',
        description: 'Gourmet low-sugar meal with balanced nutrition',
        price: 0,
        badge: '⭐ Complimentary',
        category: 'gourmet',
        dietaryTags: ['vegetarian'],
        isComplimentary: true
      },
      {
        id: 'dessert_special',
        name: 'Dessert Special',
        baseType: 'veg',
        description: 'Artisanal dessert with premium ingredients',
        price: 0,
        badge: '⭐ Complimentary',
        category: 'dessert',
        dietaryTags: ['vegetarian'],
        isComplimentary: true
      }
    ]
  },
  
  // Business Class Meal Configuration
  BUSINESS: {
    flex: {
      mealsEnabled: true,
      eligibility: {
        complimentaryMeals: 1,
        message: "Enjoy gourmet complimentary meals with your Business Flex fare.",
        badgeType: "gourmet"
      },
      allowedDietaryOptions: ['vegetarian', 'non-vegetarian', 'vegan', 'jain', 'gluten-free'],
      availableMeals: [
        {
          id: 'gourmet_veg',
          name: 'Gourmet Veg',
          baseType: 'veg',
          description: 'Chef-curated vegetarian meal with seasonal ingredients',
          price: 0,
          badge: '✅ Complimentary',
          category: 'gourmet',
          dietaryTags: ['vegetarian'],
          isComplimentary: true
        },
        {
          id: 'gourmet_non_veg',
          name: 'Gourmet Non-Veg',
          baseType: 'non-veg',
          description: 'Premium meat or seafood with artisanal preparation',
          price: 0,
          badge: '✅ Complimentary',
          category: 'gourmet',
          dietaryTags: ['non-vegetarian'],
          isComplimentary: true
        },
        {
          id: 'vegan_gourmet',
          name: 'Vegan Gourmet',
          baseType: 'veg',
          description: 'Plant-based gourmet meal with organic ingredients',
          price: 0,
          badge: '✅ Complimentary',
          category: 'gourmet',
          dietaryTags: ['vegetarian', 'vegan'],
          isComplimentary: true
        },
        {
          id: 'jain_meal',
          name: 'Jain Meal',
          baseType: 'veg',
          description: 'Gourmet Jain meal without root vegetables',
          price: 0,
          badge: '✅ Complimentary',
          category: 'gourmet',
          dietaryTags: ['vegetarian', 'jain'],
          isComplimentary: true
        },
        {
          id: 'gluten_free_meal',
          name: 'Gluten-Free Meal',
          baseType: 'veg',
          description: 'Gourmet gluten-free meal with premium ingredients',
          price: 0,
          badge: '✅ Complimentary',
          category: 'gourmet',
          dietaryTags: ['vegetarian', 'gluten-free'],
          isComplimentary: true
        },
        {
          id: 'chef_signature',
          name: 'Chef Signature Meal',
          baseType: 'non-veg',
          description: 'Exclusive chef-designed signature dish',
          price: 1200,
          badge: '💰 Upgrade',
          category: 'chef-special',
          dietaryTags: ['non-vegetarian'],
          isComplimentary: false
        },
        {
          id: 'regional_specialty',
          name: 'Regional Specialty',
          baseType: 'veg',
          description: 'Authentic regional cuisine with premium ingredients',
          price: 1000,
          badge: '💰 Upgrade',
          category: 'chef-special',
          dietaryTags: ['vegetarian'],
          isComplimentary: false
        },
        {
          id: 'premium_dessert',
          name: 'Premium Dessert',
          baseType: 'veg',
          description: 'Artisanal dessert crafted by pastry chef',
          price: 800,
          badge: '💰 Upgrade',
          category: 'chef-special',
          dietaryTags: ['vegetarian'],
          isComplimentary: false
        }
      ]
    },
    
    premium: {
      mealsEnabled: true,
      eligibility: {
        complimentaryMeals: 1,
        message: "Gourmet meals with pre-order exclusives are included in your fare.",
        badgeType: "chef-curated"
      },
      allowedDietaryOptions: ['vegetarian', 'non-vegetarian', 'vegan', 'jain', 'gluten-free'],
      availableMeals: [
        {
          id: 'gourmet_veg',
          name: 'Gourmet Veg',
          baseType: 'veg',
          description: 'Chef-curated vegetarian meal with seasonal ingredients',
          price: 0,
          badge: '⭐ Chef Curated',
          category: 'gourmet',
          dietaryTags: ['vegetarian'],
          isComplimentary: true
        },
        {
          id: 'gourmet_non_veg',
          name: 'Gourmet Non-Veg',
          baseType: 'non-veg',
          description: 'Premium meat or seafood with artisanal preparation',
          price: 0,
          badge: '⭐ Chef Curated',
          category: 'gourmet',
          dietaryTags: ['non-vegetarian'],
          isComplimentary: true
        },
        {
          id: 'vegan_gourmet',
          name: 'Vegan Gourmet',
          baseType: 'veg',
          description: 'Plant-based gourmet meal with organic ingredients',
          price: 0,
          badge: '⭐ Chef Curated',
          category: 'gourmet',
          dietaryTags: ['vegetarian', 'vegan'],
          isComplimentary: true
        },
        {
          id: 'jain_meal',
          name: 'Jain Meal',
          baseType: 'veg',
          description: 'Gourmet Jain meal without root vegetables',
          price: 0,
          badge: '⭐ Chef Curated',
          category: 'gourmet',
          dietaryTags: ['vegetarian', 'jain'],
          isComplimentary: true
        },
        {
          id: 'gluten_free_meal',
          name: 'Gluten-Free Meal',
          baseType: 'veg',
          description: 'Gourmet gluten-free meal with premium ingredients',
          price: 0,
          badge: '⭐ Chef Curated',
          category: 'gourmet',
          dietaryTags: ['vegetarian', 'gluten-free'],
          isComplimentary: true
        },
        {
          id: 'chef_signature',
          name: 'Chef Signature',
          baseType: 'non-veg',
          description: 'Exclusive chef-designed signature dish',
          price: 0,
          badge: '⭐ Chef Curated',
          category: 'chef-special',
          dietaryTags: ['non-vegetarian'],
          isComplimentary: true
        },
        {
          id: 'regional_specialty',
          name: 'Regional Specialty',
          baseType: 'veg',
          description: 'Authentic regional cuisine with premium ingredients',
          price: 0,
          badge: '⭐ Chef Curated',
          category: 'chef-special',
          dietaryTags: ['vegetarian'],
          isComplimentary: true
        },
        {
          id: 'luxury_dessert',
          name: 'Luxury Dessert',
          baseType: 'veg',
          description: 'Premium dessert with exotic ingredients',
          price: 0,
          badge: '⭐ Chef Curated',
          category: 'chef-special',
          dietaryTags: ['vegetarian'],
          isComplimentary: true
        },
        {
          id: 'cheese_fruit_platter',
          name: 'Cheese & Fruit Platter',
          baseType: 'veg',
          description: 'Artisanal cheese selection with seasonal fruits',
          price: 0,
          badge: '⭐ Chef Curated',
          category: 'gourmet',
          dietaryTags: ['vegetarian'],
          isComplimentary: true
        }
      ]
    },
    
    suite: {
      mealsEnabled: true,
      eligibility: {
        complimentaryMeals: 1,
        message: "Indulge in chef-curated luxury dining — all included with your private suite.",
        badgeType: "luxury"
      },
      allowedDietaryOptions: ['vegetarian', 'non-vegetarian', 'vegan', 'jain', 'gluten-free'],
      availableMeals: [
        {
          id: 'signature_veg_tasting',
          name: 'Signature Veg Tasting Menu',
          baseType: 'veg',
          description: 'Multi-course vegetarian tasting menu by executive chef',
          price: 0,
          badge: '⭐ Luxury Included',
          category: 'luxury',
          dietaryTags: ['vegetarian'],
          isComplimentary: true
        },
        {
          id: 'signature_non_veg_tasting',
          name: 'Signature Non-Veg Tasting Menu',
          baseType: 'non-veg',
          description: 'Multi-course meat and seafood tasting experience',
          price: 0,
          badge: '⭐ Luxury Included',
          category: 'luxury',
          dietaryTags: ['non-vegetarian'],
          isComplimentary: true
        },
        {
          id: 'vegan_fine_dining',
          name: 'Vegan Fine Dining',
          baseType: 'veg',
          description: 'Plant-based fine dining experience with molecular gastronomy',
          price: 0,
          badge: '⭐ Luxury Included',
          category: 'luxury',
          dietaryTags: ['vegetarian', 'vegan'],
          isComplimentary: true
        },
        {
          id: 'jain_luxury',
          name: 'Jain Luxury',
          baseType: 'veg',
          description: 'Luxury Jain cuisine with premium ingredients',
          price: 0,
          badge: '⭐ Luxury Included',
          category: 'luxury',
          dietaryTags: ['vegetarian', 'jain'],
          isComplimentary: true
        },
        {
          id: 'gluten_free_gourmet',
          name: 'Gluten-Free Gourmet',
          baseType: 'veg',
          description: 'Luxury gluten-free dining experience',
          price: 0,
          badge: '⭐ Luxury Included',
          category: 'luxury',
          dietaryTags: ['vegetarian', 'gluten-free'],
          isComplimentary: true
        },
        {
          id: 'caviar_service',
          name: 'Caviar Service',
          baseType: 'non-veg',
          description: 'Premium caviar service with traditional accompaniments',
          price: 0,
          badge: '⭐ Luxury Included',
          category: 'luxury',
          dietaryTags: ['non-vegetarian'],
          isComplimentary: true
        },
        {
          id: 'artisanal_cheese_board',
          name: 'Artisanal Cheese Board',
          baseType: 'veg',
          description: 'Curated selection of international artisanal cheeses',
          price: 0,
          badge: '⭐ Luxury Included',
          category: 'luxury',
          dietaryTags: ['vegetarian'],
          isComplimentary: true
        },
        {
          id: 'grand_dessert_selection',
          name: 'Grand Dessert Selection',
          baseType: 'veg',
          description: 'Luxury dessert selection with gold leaf and exotic ingredients',
          price: 0,
          badge: '⭐ Luxury Included',
          category: 'luxury',
          dietaryTags: ['vegetarian'],
          isComplimentary: true
        }
      ]
    }
  },
  
  // First Class Meal Configuration
  FIRST: {
    standard: {
      mealsEnabled: true,
      eligibility: {
        complimentaryMeals: 1,
        message: "Experience refined à la carte dining at 35,000 feet — fully included with First Class.",
        badgeType: "luxury"
      },
      allowedDietaryOptions: ['vegetarian', 'non-vegetarian', 'vegan', 'jain', 'gluten-free'],
      availableMeals: [
        {
          id: 'signature_veg_fine_dining',
          name: 'Signature Veg Fine Dining',
          baseType: 'veg',
          description: 'Artisanal vegetarian cuisine with seasonal ingredients and refined presentation',
          price: 0,
          badge: 'À la carte included',
          category: 'luxury',
          dietaryTags: ['vegetarian'],
          isComplimentary: true
        },
        {
          id: 'signature_non_veg_fine_dining',
          name: 'Signature Non-Veg Fine Dining',
          baseType: 'non-veg',
          description: 'Premium meat and seafood selections with gourmet preparation',
          price: 0,
          badge: 'À la carte included',
          category: 'luxury',
          dietaryTags: ['non-vegetarian'],
          isComplimentary: true
        },
        {
          id: 'fully_vegan_gourmet',
          name: 'Fully Vegan Gourmet',
          baseType: 'veg',
          description: 'Plant-based fine dining with innovative culinary techniques',
          price: 0,
          badge: 'À la carte included',
          category: 'luxury',
          dietaryTags: ['vegetarian', 'vegan'],
          isComplimentary: true
        },
        {
          id: 'jain_royal_selection',
          name: 'Jain Royal Selection',
          baseType: 'veg',
          description: 'Luxury Jain cuisine prepared with premium ingredients and traditional methods',
          price: 0,
          badge: 'À la carte included',
          category: 'luxury',
          dietaryTags: ['vegetarian', 'jain'],
          isComplimentary: true
        },
        {
          id: 'gluten_free_chef_table',
          name: 'Gluten-Free Chef Table',
          baseType: 'veg',
          description: 'Specially crafted gluten-free dining experience with chef attention',
          price: 0,
          badge: 'À la carte included',
          category: 'luxury',
          dietaryTags: ['vegetarian', 'gluten-free'],
          isComplimentary: true
        },
        {
          id: 'seasonal_farm_to_table',
          name: 'Seasonal Farm-to-Table Meal',
          baseType: 'veg',
          description: 'Fresh seasonal ingredients sourced from premium farms',
          price: 0,
          badge: 'À la carte included',
          category: 'luxury',
          dietaryTags: ['vegetarian'],
          isComplimentary: true
        },
        {
          id: 'artisanal_cheese_board',
          name: 'Artisanal Cheese Board',
          baseType: 'veg',
          description: 'Curated selection of international artisanal cheeses with accompaniments',
          price: 0,
          badge: 'À la carte included',
          category: 'luxury',
          dietaryTags: ['vegetarian'],
          isComplimentary: true
        },
        {
          id: 'premium_dessert_collection',
          name: 'Premium Dessert Collection',
          baseType: 'veg',
          description: 'Handcrafted desserts with premium ingredients and elegant presentation',
          price: 0,
          badge: 'À la carte included',
          category: 'luxury',
          dietaryTags: ['vegetarian'],
          isComplimentary: true
        }
      ]
    },
    
    flex: {
      mealsEnabled: true,
      eligibility: {
        complimentaryMeals: 1,
        message: "Pre-select your handcrafted gourmet meals and dine on your schedule.",
        badgeType: "chef-curated"
      },
      allowedDietaryOptions: ['vegetarian', 'non-vegetarian', 'vegan', 'jain', 'gluten-free'],
      availableMeals: [
        {
          id: 'signature_veg_fine_dining',
          name: 'Signature Veg Fine Dining',
          baseType: 'veg',
          description: 'Artisanal vegetarian cuisine with seasonal ingredients and refined presentation',
          price: 0,
          badge: 'Chef Crafted',
          category: 'luxury',
          dietaryTags: ['vegetarian'],
          isComplimentary: true
        },
        {
          id: 'signature_non_veg_fine_dining',
          name: 'Signature Non-Veg Fine Dining',
          baseType: 'non-veg',
          description: 'Premium meat and seafood selections with gourmet preparation',
          price: 0,
          badge: 'Chef Crafted',
          category: 'luxury',
          dietaryTags: ['non-vegetarian'],
          isComplimentary: true
        },
        {
          id: 'fully_vegan_gourmet',
          name: 'Fully Vegan Gourmet',
          baseType: 'veg',
          description: 'Plant-based fine dining with innovative culinary techniques',
          price: 0,
          badge: 'Chef Crafted',
          category: 'luxury',
          dietaryTags: ['vegetarian', 'vegan'],
          isComplimentary: true
        },
        {
          id: 'jain_royal_selection',
          name: 'Jain Royal Selection',
          baseType: 'veg',
          description: 'Luxury Jain cuisine prepared with premium ingredients and traditional methods',
          price: 0,
          badge: 'Chef Crafted',
          category: 'luxury',
          dietaryTags: ['vegetarian', 'jain'],
          isComplimentary: true
        },
        {
          id: 'gluten_free_chef_table',
          name: 'Gluten-Free Chef Table',
          baseType: 'veg',
          description: 'Specially crafted gluten-free dining experience with chef attention',
          price: 0,
          badge: 'Chef Crafted',
          category: 'luxury',
          dietaryTags: ['vegetarian', 'gluten-free'],
          isComplimentary: true
        },
        {
          id: 'seasonal_farm_to_table',
          name: 'Seasonal Farm-to-Table Meal',
          baseType: 'veg',
          description: 'Fresh seasonal ingredients sourced from premium farms',
          price: 0,
          badge: 'Chef Crafted',
          category: 'luxury',
          dietaryTags: ['vegetarian'],
          isComplimentary: true
        },
        {
          id: 'artisanal_cheese_board',
          name: 'Artisanal Cheese Board',
          baseType: 'veg',
          description: 'Curated selection of international artisanal cheeses with accompaniments',
          price: 0,
          badge: 'Chef Crafted',
          category: 'luxury',
          dietaryTags: ['vegetarian'],
          isComplimentary: true
        },
        {
          id: 'premium_dessert_collection',
          name: 'Premium Dessert Collection',
          baseType: 'veg',
          description: 'Handcrafted desserts with premium ingredients and elegant presentation',
          price: 0,
          badge: 'Chef Crafted',
          category: 'luxury',
          dietaryTags: ['vegetarian'],
          isComplimentary: true
        },
        {
          id: 'chef_tasting_menu',
          name: 'Chef Tasting Menu',
          baseType: 'non-veg',
          description: 'Multi-course tasting experience designed by executive chef',
          price: 0,
          badge: 'Chef Crafted',
          category: 'luxury',
          dietaryTags: ['non-vegetarian'],
          isComplimentary: true
        },
        {
          id: 'regional_grand_menu',
          name: 'Regional Grand Menu',
          baseType: 'veg',
          description: 'Authentic regional specialties elevated to fine dining standards',
          price: 0,
          badge: 'Chef Crafted',
          category: 'luxury',
          dietaryTags: ['vegetarian'],
          isComplimentary: true
        },
        {
          id: 'wellness_nutrition_menu',
          name: 'Wellness Nutrition Menu',
          baseType: 'veg',
          description: 'Health-focused gourmet meals with nutritional balance',
          price: 0,
          badge: 'Chef Crafted',
          category: 'luxury',
          dietaryTags: ['vegetarian'],
          isComplimentary: true
        },
        {
          id: 'midnight_express_meal',
          name: 'Midnight Express Meal',
          baseType: 'non-veg',
          description: 'Light yet satisfying late-night dining option',
          price: 0,
          badge: 'Chef Crafted',
          category: 'luxury',
          dietaryTags: ['non-vegetarian'],
          isComplimentary: true
        }
      ]
    },
    
    suite: {
      mealsEnabled: true,
      eligibility: {
        complimentaryMeals: 1,
        message: "Indulge in the pinnacle of inflight dining — curated by world-class chefs exclusively for your private suite.",
        badgeType: "ultra-luxury"
      },
      allowedDietaryOptions: ['vegetarian', 'non-vegetarian', 'vegan', 'jain', 'gluten-free'],
      availableMeals: [
        {
          id: 'royal_tasting_menu',
          name: 'Royal Tasting Menu',
          baseType: 'non-veg',
          description: 'Multi-course royal dining experience with world-class presentation',
          price: 0,
          badge: 'Ultra Luxury',
          category: 'ultra-luxury',
          dietaryTags: ['non-vegetarian'],
          isComplimentary: true
        },
        {
          id: 'caviar_blini_service',
          name: 'Caviar & Blini Service',
          baseType: 'non-veg',
          description: 'Premium caviar service with traditional Russian blini and accompaniments',
          price: 0,
          badge: 'Ultra Luxury',
          category: 'ultra-luxury',
          dietaryTags: ['non-vegetarian'],
          isComplimentary: true
        },
        {
          id: 'lobster_thermidor',
          name: 'Lobster Thermidor',
          baseType: 'non-veg',
          description: 'Classic French lobster preparation with rich cream sauce',
          price: 0,
          badge: 'Ultra Luxury',
          category: 'ultra-luxury',
          dietaryTags: ['non-vegetarian'],
          isComplimentary: true
        },
        {
          id: 'wagyu_selection',
          name: 'Wagyu Selection',
          baseType: 'non-veg',
          description: 'Premium wagyu beef prepared to perfection with gourmet sides',
          price: 0,
          badge: 'Ultra Luxury',
          category: 'ultra-luxury',
          dietaryTags: ['non-vegetarian'],
          isComplimentary: true
        },
        {
          id: 'vegan_haute_cuisine',
          name: 'Vegan Haute Cuisine',
          baseType: 'veg',
          description: 'Molecular gastronomy meets plant-based fine dining',
          price: 0,
          badge: 'Ultra Luxury',
          category: 'ultra-luxury',
          dietaryTags: ['vegetarian', 'vegan'],
          isComplimentary: true
        },
        {
          id: 'imperial_jain_dining',
          name: 'Imperial Jain Dining',
          baseType: 'veg',
          description: 'Royal Jain cuisine with imperial presentation and premium ingredients',
          price: 0,
          badge: 'Ultra Luxury',
          category: 'ultra-luxury',
          dietaryTags: ['vegetarian', 'jain'],
          isComplimentary: true
        },
        {
          id: 'grand_cheese_affinage',
          name: 'Grand Cheese Affinage',
          baseType: 'veg',
          description: 'Master cheese selection with wine pairings and artisanal accompaniments',
          price: 0,
          badge: 'Ultra Luxury',
          category: 'ultra-luxury',
          dietaryTags: ['vegetarian'],
          isComplimentary: true
        },
        {
          id: 'signature_dessert_flight',
          name: 'Signature Dessert Flight',
          baseType: 'veg',
          description: 'Collection of signature desserts with gold leaf and exotic ingredients',
          price: 0,
          badge: 'Ultra Luxury',
          category: 'ultra-luxury',
          dietaryTags: ['vegetarian'],
          isComplimentary: true
        },
        {
          id: 'first_suite_gluten_free',
          name: 'Gluten-Free Chef\'s Gourmet',
          baseType: 'veg',
          description: 'A premium gourmet meal crafted entirely without gluten, ensuring both safety and exceptional taste.',
          price: 0,
          badge: 'Ultra Luxury',
          category: 'ultra-luxury',
          dietaryTags: ['vegetarian', 'gluten-free'],
          isComplimentary: true
        }
      ]
    }
  }
};

export default function MealSelectionPage() {
  const router = useRouter();
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [passengerDetails, setPassengerDetails] = useState([]);
  const [seatSelection, setSeatSelection] = useState(null);
  const [baggageSelection, setBaggageSelection] = useState(null);
  const [selectedMeals, setSelectedMeals] = useState({});
  const [totalMealPrice, setTotalMealPrice] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [dietaryPreferences, setDietaryPreferences] = useState({}); // Passenger-specific dietary preferences

  useEffect(() => {
    // Load data from localStorage
    const flightData = localStorage.getItem('selectedFlight');
    const passengerData = localStorage.getItem('passengerDetails');
    const seatData = localStorage.getItem('seatSelection');
    const baggageData = localStorage.getItem('baggageSelection');
    
    if (!flightData || !passengerData) {
      router.push('/home');
      return;
    }

    try {
      const flight = JSON.parse(flightData);
      const passengerDataObj = JSON.parse(passengerData);
      const seats = seatData ? JSON.parse(seatData) : null;
      const baggage = baggageData ? JSON.parse(baggageData) : null;
      
      // Handle both old and new data structures
      const passengers = passengerDataObj.passengers || passengerDataObj;
      
      setSelectedFlight(flight);
      setPassengerDetails(passengers);
      setSeatSelection(seats);
      setBaggageSelection(baggage);
      
      // Initialize meal selection (default to no meal selected)
      const initialMealSelection = {};
      const initialDietaryPreferences = {};
      passengers.forEach((passenger, index) => {
        const passengerKey = `PAX_${index + 1}`;
        initialMealSelection[passengerKey] = null;
        // Initialize dietary preferences - all unchecked by default
        initialDietaryPreferences[passengerKey] = {
          vegetarian: false,
          nonVegetarian: false,
          vegan: false,
          jain: false,
          glutenFree: false
        };
      });
      setSelectedMeals(initialMealSelection);
      setDietaryPreferences(initialDietaryPreferences);
      
      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading meal selection data:', error);
      router.push('/home');
    }
  }, [router]);

  useEffect(() => {
    // Calculate total meal price
    let total = 0;
    Object.values(selectedMeals).forEach(mealId => {
      if (mealId) {
        const mealConfig = getMealConfig();
        const meal = mealConfig.availableMeals.find(m => m.id === mealId);
        if (meal) {
          total += meal.price;
        }
      }
    });
    setTotalMealPrice(total);
  }, [selectedMeals, seatSelection]);

  // Get available dietary options based on cabin class and fare type
  const getAvailableDietaryOptions = () => {
    const mealConfig = getMealConfig();
    
    if (!mealConfig.mealsEnabled) {
      return [];
    }
    
    return mealConfig.allowedDietaryOptions || [];
  };

  // Filter meals based on passenger's selected dietary preferences
  const getFilteredMeals = (passengerKey) => {
    const mealConfig = getMealConfig();
    const passengerPreferences = dietaryPreferences[passengerKey];
    
    if (!passengerPreferences || !mealConfig.mealsEnabled) {
      return mealConfig.availableMeals;
    }
    
    // If no preferences are selected, show all meals
    const hasActivePreferences = Object.values(passengerPreferences).some(pref => pref);
    if (!hasActivePreferences) {
      return mealConfig.availableMeals;
    }
    
    // Filter meals based on selected dietary preferences
    return mealConfig.availableMeals.filter(meal => {
      if (!meal.dietaryTags) return false;
      
      // Check if meal matches any selected dietary preference
      if (passengerPreferences.vegetarian && meal.dietaryTags.includes('vegetarian')) return true;
      if (passengerPreferences.nonVegetarian && meal.dietaryTags.includes('non-vegetarian')) return true;
      if (passengerPreferences.vegan && meal.dietaryTags.includes('vegan')) return true;
      if (passengerPreferences.jain && meal.dietaryTags.includes('jain')) return true;
      if (passengerPreferences.glutenFree && meal.dietaryTags.includes('gluten-free')) return true;
      
      return false;
    });
  };

  // Handle dietary preference changes
  const handleDietaryPreferenceChange = (passengerKey, preferenceType) => {
    setDietaryPreferences(prev => ({
      ...prev,
      [passengerKey]: {
        ...prev[passengerKey],
        [preferenceType]: !prev[passengerKey][preferenceType]
      }
    }));
  };
  const getMealConfig = () => {
    const cabinClass = seatSelection?.cabinClass || 'Economy';
    const fareType = seatSelection?.fareType || seatSelection?.premiumEconomyFareType || seatSelection?.businessFareType || seatSelection?.firstClassFareType || 'base';
    
    if (cabinClass === 'Economy') {
      const configKey = `ECONOMY_${fareType.toUpperCase()}`;
      return MEAL_CONFIG[configKey] || MEAL_CONFIG.ECONOMY_BASE;
    }
    
    if (cabinClass === 'Premium Economy') {
      const configKey = `PREMIUM_ECONOMY_${fareType.toUpperCase()}`;
      return MEAL_CONFIG[configKey] || MEAL_CONFIG.PREMIUM_ECONOMY_STANDARD;
    }
    
    if (cabinClass === 'Business') {
      // Business Class uses exact fare type IDs: flex, premium, suite
      return MEAL_CONFIG.BUSINESS[fareType] || MEAL_CONFIG.BUSINESS.flex;
    }
    
    if (cabinClass === 'First') {
      // First Class uses exact fare type IDs: standard, flex, suite
      return MEAL_CONFIG.FIRST[fareType] || MEAL_CONFIG.FIRST.standard;
    }
    
    // Fallback to Economy Base for unknown cabin classes
    return MEAL_CONFIG.ECONOMY_BASE;
  };

  const handleMealSelection = (passengerKey, mealId) => {
    setSelectedMeals(prev => ({
      ...prev,
      [passengerKey]: prev[passengerKey] === mealId ? null : mealId
    }));
  };

  const handleContinueToPayment = () => {
    // Save meal selection data
    const mealConfig = getMealConfig();
    const mealSelectionData = {
      selectedMeals,
      totalMealPrice,
      mealConfig: {
        cabinClass: seatSelection?.cabinClass || 'Economy',
        fareType: seatSelection?.fareType || 'base',
        eligibility: mealConfig.eligibility
      },
      mealSummary: Object.entries(selectedMeals).map(([passengerKey, mealId]) => {
        if (!mealId) return null;
        const meal = mealConfig.availableMeals.find(m => m.id === mealId);
        return meal ? {
          passenger: passengerKey.replace('_', ' '),
          meal: meal.name,
          type: meal.baseType === 'veg' ? 
            (meal.dietaryTags?.includes('vegan') ? 'Vegan' : 'Veg') : 
            'Non-Veg',
          price: meal.price,
          badge: meal.badge
        } : null;
      }).filter(Boolean)
    };
    
    localStorage.setItem('mealSelection', JSON.stringify(mealSelectionData));
    router.push('/travel-insurance');
  };

  const handleSkipMealSelection = () => {
    // Save minimal meal data
    const mealSelectionData = {
      selectedMeals: {},
      totalMealPrice: 0,
      mealConfig: {
        cabinClass: seatSelection?.cabinClass || 'Economy',
        fareType: seatSelection?.fareType || 'base'
      },
      skipped: true
    };
    
    localStorage.setItem('mealSelection', JSON.stringify(mealSelectionData));
    router.push('/travel-insurance');
  };

  // Handle non-Economy classes - moved to main useEffect
  useEffect(() => {
    if (isLoaded && seatSelection) {
      const cabinClass = seatSelection.cabinClass || 'Economy';
      
      // Only redirect if meals are explicitly disabled
      const mealConfig = getMealConfig();
      if (!mealConfig.mealsEnabled) {
        const mealSelectionData = {
          selectedMeals: {},
          totalMealPrice: 0,
          mealConfig: {
            cabinClass: cabinClass,
            fareType: seatSelection?.fareType || seatSelection?.premiumEconomyFareType || seatSelection?.businessFareType || seatSelection?.firstClassFareType || 'base'
          },
          skipped: true,
          reason: `Meals are not available for this fare type.`
        };
        
        localStorage.setItem('mealSelection', JSON.stringify(mealSelectionData));
        router.push('/travel-insurance');
      }
    }
  }, [isLoaded, seatSelection, router]);

  if (!isLoaded) {
    return (
      <div style={styles.pageContainer}>
        <Header />
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <p style={styles.loadingText}>Loading meal options...</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Get current meal configuration
  const mealConfig = getMealConfig();
  const cabinClass = seatSelection?.cabinClass || 'Economy';
  const fareType = seatSelection?.fareType || seatSelection?.premiumEconomyFareType || seatSelection?.businessFareType || seatSelection?.firstClassFareType || 'base';

  // If meals are disabled, show loading while redirecting
  if (!mealConfig.mealsEnabled) {
    return (
      <div style={styles.pageContainer}>
        <Header />
        <div style={styles.loadingContainer}>
          <p style={styles.loadingText}>Meals are not available for this fare type. Redirecting to payment...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <Header />
      
      <main style={styles.main}>
        <div style={styles.contentWrapper}>
          {/* Page Header */}
          <div style={styles.pageHeader}>
            <h1 style={styles.pageTitle}>Meal Selection</h1>
            <p style={styles.pageSubtitle}>
              Choose your preferred meals for {selectedFlight?.searchCriteria?.from} → {selectedFlight?.searchCriteria?.to}
            </p>
            
            {/* Progress Indicator */}
            <div style={styles.progressIndicator}>
              <span style={styles.progressText}>
                Passengers: {passengerDetails.length} • Cabin: {cabinClass} • Fare: {(() => {
                  if (cabinClass === 'Economy') {
                    return `Economy ${fareType.charAt(0).toUpperCase() + fareType.slice(1)}`;
                  } else if (cabinClass === 'Premium Economy') {
                    return `Premium Economy ${fareType.charAt(0).toUpperCase() + fareType.slice(1)}`;
                  } else if (cabinClass === 'Business') {
                    return `Business ${fareType.charAt(0).toUpperCase() + fareType.slice(1)}`;
                  } else if (cabinClass === 'First') {
                    return `First ${fareType.charAt(0).toUpperCase() + fareType.slice(1)}`;
                  } else {
                    return `${cabinClass} ${fareType.charAt(0).toUpperCase() + fareType.slice(1)}`;
                  }
                })()}
              </span>
            </div>
          </div>

          {/* Eligibility Banner */}
          <div style={{
            ...styles.eligibilityBanner,
            ...(mealConfig.eligibility.badgeType === 'paid' ? styles.paidBanner : 
                mealConfig.eligibility.badgeType === 'premium' ? styles.premiumBanner :
                mealConfig.eligibility.badgeType === 'luxury' ? styles.luxuryBanner :
                mealConfig.eligibility.badgeType === 'ultra-luxury' ? styles.ultraLuxuryBanner :
                mealConfig.eligibility.badgeType === 'chef-curated' ? styles.luxuryBanner : styles.includedBanner)
          }}>
            <div style={styles.bannerIcon}>
              {mealConfig.eligibility.badgeType === 'paid' ? '💰' : 
               mealConfig.eligibility.badgeType === 'premium' ? '⭐' :
               mealConfig.eligibility.badgeType === 'luxury' ? '👑' :
               mealConfig.eligibility.badgeType === 'ultra-luxury' ? '💎' :
               mealConfig.eligibility.badgeType === 'chef-curated' ? '👨‍🍳' : '✅'}
            </div>
            <div style={styles.bannerContent}>
              <p style={styles.bannerMessage}>{mealConfig.eligibility.message}</p>
            </div>
          </div>

          <div style={styles.sectionsContainer}>
            {/* Left Panel - Meal Selection */}
            <div style={styles.leftPanel}>
              
              {/* Passenger-wise Meal Selection */}
              {passengerDetails.map((passenger, index) => {
                const passengerKey = `PAX_${index + 1}`;
                const selectedMealId = selectedMeals[passengerKey];
                
                return (
                  <div key={index} style={styles.passengerSection}>
                    <div style={styles.passengerHeader}>
                      <div style={styles.passengerInfo}>
                        <span style={styles.passengerIcon}>👤</span>
                        <div>
                          <h3 style={styles.passengerName}>
                            {passenger.title} {passenger.firstName} {passenger.lastName}
                          </h3>
                          <p style={styles.passengerMeta}>Age: {passenger.age}</p>
                        </div>
                      </div>
                      
                      {selectedMealId && (
                        <div style={styles.selectedMealIndicator}>
                          <span style={styles.selectedMealIcon}>🍽️</span>
                          <span style={styles.selectedMealText}>Meal Selected</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Dietary Preferences - For all supported cabin classes */}
                    {mealConfig.mealsEnabled && (
                      <div style={styles.dietaryPreferencesSection}>
                        <div style={styles.preferencesHeader}>
                          <h4 style={styles.preferencesTitle}>Dietary Preferences:</h4>
                          {(() => {
                            const filteredMeals = getFilteredMeals(passengerKey);
                            const totalMeals = mealConfig.availableMeals.length;
                            const hasActivePreferences = Object.values(dietaryPreferences[passengerKey] || {}).some(pref => pref);
                            
                            if (hasActivePreferences && filteredMeals.length !== totalMeals) {
                              return (
                                <span style={styles.preferenceCount}>
                                  Showing {filteredMeals.length} of {totalMeals} meals
                                </span>
                              );
                            }
                            return null;
                          })()}
                        </div>
                        <div style={styles.preferencesGrid}>
                          {getAvailableDietaryOptions().includes('vegetarian') && (
                            <label style={styles.preferenceCheckbox}>
                              <input
                                type="checkbox"
                                checked={dietaryPreferences[passengerKey]?.vegetarian || false}
                                onChange={() => handleDietaryPreferenceChange(passengerKey, 'vegetarian')}
                                style={styles.checkboxInput}
                              />
                              <span style={styles.checkboxLabel}>Vegetarian</span>
                            </label>
                          )}
                          {getAvailableDietaryOptions().includes('non-vegetarian') && (
                            <label style={styles.preferenceCheckbox}>
                              <input
                                type="checkbox"
                                checked={dietaryPreferences[passengerKey]?.nonVegetarian || false}
                                onChange={() => handleDietaryPreferenceChange(passengerKey, 'nonVegetarian')}
                                style={styles.checkboxInput}
                              />
                              <span style={styles.checkboxLabel}>Non-Vegetarian</span>
                            </label>
                          )}
                          {getAvailableDietaryOptions().includes('vegan') && (
                            <label style={styles.preferenceCheckbox}>
                              <input
                                type="checkbox"
                                checked={dietaryPreferences[passengerKey]?.vegan || false}
                                onChange={() => handleDietaryPreferenceChange(passengerKey, 'vegan')}
                                style={styles.checkboxInput}
                              />
                              <span style={styles.checkboxLabel}>Vegan</span>
                            </label>
                          )}
                          {getAvailableDietaryOptions().includes('jain') && (
                            <label style={styles.preferenceCheckbox}>
                              <input
                                type="checkbox"
                                checked={dietaryPreferences[passengerKey]?.jain || false}
                                onChange={() => handleDietaryPreferenceChange(passengerKey, 'jain')}
                                style={styles.checkboxInput}
                              />
                              <span style={styles.checkboxLabel}>Jain</span>
                            </label>
                          )}
                          {getAvailableDietaryOptions().includes('gluten-free') && (
                            <label style={styles.preferenceCheckbox}>
                              <input
                                type="checkbox"
                                checked={dietaryPreferences[passengerKey]?.glutenFree || false}
                                onChange={() => handleDietaryPreferenceChange(passengerKey, 'glutenFree')}
                                style={styles.checkboxInput}
                              />
                              <span style={styles.checkboxLabel}>Gluten-Free</span>
                            </label>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Meal Options */}
                    <div style={styles.mealOptionsGrid}>
                      {getFilteredMeals(passengerKey).map((meal) => (
                        <div
                          key={meal.id}
                          onClick={() => handleMealSelection(passengerKey, meal.id)}
                          style={{
                            ...styles.mealCard,
                            ...(selectedMealId === meal.id ? styles.selectedMealCard : {}),
                            ...(meal.category === 'premium' ? styles.premiumMealCard : 
                                meal.category === 'luxury' ? styles.luxuryMealCard :
                                meal.category === 'ultra-luxury' ? styles.ultraLuxuryMealCard : {})
                          }}
                        >
                          <div style={styles.mealHeader}>
                            <div style={styles.mealTypeTag}>
                              <span style={{
                                ...styles.mealTypeText,
                                ...(meal.baseType === 'veg' ? 
                                    (meal.dietaryTags?.includes('vegan') ? styles.veganTag : styles.vegTag) : 
                                    styles.nonVegTag)
                              }}>
                                {meal.baseType === 'veg' ? 
                                  (meal.dietaryTags?.includes('vegan') ? 'Vegan' : 'Veg') : 
                                  'Non-Veg'}
                              </span>
                            </div>
                            
                            <div style={styles.mealPrice}>
                              {meal.price > 0 ? formatPrice(meal.price, CURRENCY_CONFIG) : 'Free'}
                            </div>
                          </div>
                          
                          <h4 style={styles.mealName}>{meal.name}</h4>
                          <p style={styles.mealDescription}>{meal.description}</p>
                          
                          <div style={styles.mealBadge}>
                            <span style={styles.mealBadgeText}>{meal.badge}</span>
                          </div>
                          
                          {selectedMealId === meal.id && (
                            <div style={styles.selectedIndicator}>
                              <span style={styles.checkmark}>✓</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Professional Note */}
              <div style={styles.professionalNote}>
                <div style={styles.noteIcon}>ℹ️</div>
                <p style={styles.noteText}>
                  {(() => {
                    if (cabinClass === 'First') {
                      return 'Your meals are prepared onboard by premium culinary partners. You may dine at any time during your flight.';
                    } else if (cabinClass === 'Business') {
                      return 'Chef-curated meals are prepared with premium ingredients. Special dietary requirements should be selected at least 24 hours before departure.';
                    } else {
                      return 'Special meals should ideally be selected at least 24 hours before departure.';
                    }
                  })()}
                </p>
              </div>
            </div>

            {/* Right Panel - Summary */}
            <div style={styles.rightPanel}>
              {/* Meal Summary */}
              <div style={styles.summaryCard}>
                <h3 style={styles.summaryTitle}>Meal Selection Summary</h3>
                
                <div style={styles.summaryContent}>
                  {passengerDetails.map((passenger, index) => {
                    const passengerKey = `PAX_${index + 1}`;
                    const selectedMealId = selectedMeals[passengerKey];
                    const selectedMeal = selectedMealId ? 
                      mealConfig.availableMeals.find(m => m.id === selectedMealId) : null;
                    
                    return (
                      <div key={index} style={styles.summaryRow}>
                        <div style={styles.summaryPassenger}>
                          <span style={styles.summaryPassengerName}>
                            {passenger.firstName} {passenger.lastName}
                          </span>
                        </div>
                        <div style={styles.summaryMeal}>
                          {selectedMeal ? (
                            <>
                              <span style={styles.summaryMealName}>{selectedMeal.name}</span>
                              <span style={styles.summaryMealPrice}>
                                {selectedMeal.price > 0 ? formatPrice(selectedMeal.price, CURRENCY_CONFIG) : 'Free'}
                              </span>
                            </>
                          ) : (
                            <span style={styles.noMealSelected}>No meal selected</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Total */}
                <div style={styles.totalRow}>
                  <span style={styles.totalLabel}>Total Meal Charges</span>
                  <span style={styles.totalValue}>
                    {totalMealPrice > 0 ? formatPrice(totalMealPrice, CURRENCY_CONFIG) : formatPrice(0, CURRENCY_CONFIG)}
                  </span>
                </div>
              </div>

              {/* Back Button */}
              <div style={styles.backButtonRow}>
                <button
                  onClick={() => router.push('/baggage-selection')}
                  style={styles.backButton}
                >
                  ← Back to Baggage Selection
                </button>
              </div>

              {/* Action Buttons */}
              <div style={styles.actionButtons}>
                <button
                  onClick={handleSkipMealSelection}
                  style={styles.skipButton}
                >
                  Skip Meal Selection
                </button>
                
                <button
                  onClick={handleContinueToPayment}
                  style={styles.continueButton}
                >
                  Continue to Travel Insurance
                  {totalMealPrice > 0 && (
                    <span style={styles.buttonPrice}>
                      (+{formatPrice(totalMealPrice, CURRENCY_CONFIG)})
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(135deg, #87CEEB 0%, #98D8E8 25%, #B0E0E6 50%, #E0F6FF 75%, #F0F8FF 100%)',
  },
  
  main: {
    flex: 1,
    paddingTop: '100px',
    paddingBottom: '60px',
    minHeight: 'calc(100vh - 160px)'
  },
  
  contentWrapper: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 2rem',
  },
  
  pageHeader: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  
  pageTitle: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '1rem',
  },
  
  pageSubtitle: {
    fontSize: '1.1rem',
    color: '#4a5568',
    maxWidth: '600px',
    margin: '0 auto 1rem auto',
  },
  
  progressIndicator: {
    background: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '20px',
    padding: '0.75rem 1.5rem',
    display: 'inline-block',
    border: '1px solid rgba(59, 130, 246, 0.2)',
  },
  
  progressText: {
    fontSize: '0.9rem',
    color: '#3b82f6',
    fontWeight: '600',
  },
  
  eligibilityBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.5rem',
    borderRadius: '12px',
    marginBottom: '2rem',
    border: '2px solid',
  },
  
  paidBanner: {
    background: 'rgba(245, 158, 11, 0.1)',
    borderColor: '#f59e0b',
  },
  
  includedBanner: {
    background: 'rgba(16, 185, 129, 0.1)',
    borderColor: '#10b981',
  },
  
  premiumBanner: {
    background: 'rgba(139, 92, 246, 0.1)',
    borderColor: '#8b5cf6',
  },
  
  luxuryBanner: {
    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(245, 158, 11, 0.08))',
    borderColor: '#8b5cf6',
    boxShadow: '0 4px 20px rgba(139, 92, 246, 0.15)',
  },
  
  ultraLuxuryBanner: {
    background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.08), rgba(139, 92, 246, 0.08))',
    borderColor: '#dc2626',
    boxShadow: '0 4px 20px rgba(220, 38, 38, 0.15)',
  },
  
  bannerIcon: {
    fontSize: '2rem',
    flexShrink: 0,
  },
  
  bannerContent: {
    flex: 1,
  },
  
  bannerMessage: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1e293b',
    margin: 0,
  },
  
  sectionsContainer: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '3rem',
    alignItems: 'flex-start',
  },
  
  leftPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  
  rightPanel: {
    position: 'sticky',
    top: '120px',
  },
  
  passengerSection: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '16px',
    padding: '2rem',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  
  passengerHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
    borderBottom: '2px solid #e2e8f0',
  },
  
  passengerInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  
  passengerIcon: {
    fontSize: '2rem',
    background: '#3b82f6',
    color: 'white',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  passengerName: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 0.25rem 0',
  },
  
  passengerMeta: {
    fontSize: '0.9rem',
    color: '#64748b',
    margin: 0,
  },
  
  selectedMealIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: '#10b981',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  
  selectedMealIcon: {
    fontSize: '1rem',
  },
  
  selectedMealText: {
    fontSize: '0.85rem',
  },
  
  // Dietary Preferences Styles
  dietaryPreferencesSection: {
    marginBottom: '1.5rem',
    padding: '1.25rem',
    background: 'rgba(59, 130, 246, 0.05)',
    borderRadius: '12px',
    border: '1px solid rgba(59, 130, 246, 0.1)',
  },
  
  preferencesHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem',
  },
  
  preferencesTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#374151',
    margin: 0,
  },
  
  preferenceCount: {
    fontSize: '0.85rem',
    color: '#6b7280',
    fontStyle: 'italic',
  },
  
  preferencesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '0.75rem',
    alignItems: 'center',
    '@media (max-width: 768px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '0.5rem',
    }
  },
  
  preferenceCheckbox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.6rem',
    cursor: 'pointer',
    padding: '0.7rem 1.2rem',
    borderRadius: '8px',
    background: 'white',
    border: '1px solid #e2e8f0',
    transition: 'all 0.2s ease',
    fontSize: '0.9rem',
    fontWeight: '500',
    color: '#374151',
    minWidth: '110px',
    maxWidth: '160px',
    whiteSpace: 'nowrap',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    ':hover': {
      borderColor: '#3b82f6',
      background: '#f8fafc',
      transform: 'translateY(-1px)',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
    }
  },
  
  checkboxInput: {
    width: '16px',
    height: '16px',
    cursor: 'pointer',
    accentColor: '#3b82f6',
    flexShrink: 0,
  },
  
  checkboxLabel: {
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    color: '#374151',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    lineHeight: '1.2',
  },
  
  mealOptionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1rem',
  },
  
  mealCard: {
    background: 'white',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    padding: '1.5rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative',
    minHeight: '180px',
  },
  
  selectedMealCard: {
    borderColor: '#3b82f6',
    boxShadow: '0 4px 20px rgba(59, 130, 246, 0.15)',
    transform: 'translateY(-2px)',
  },
  
  premiumMealCard: {
    background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
    borderColor: '#f59e0b',
  },
  
  luxuryMealCard: {
    background: 'linear-gradient(135deg, #f3e8ff, #e0e7ff)',
    borderColor: '#8b5cf6',
    boxShadow: '0 4px 20px rgba(139, 92, 246, 0.15)',
  },
  
  ultraLuxuryMealCard: {
    background: 'linear-gradient(135deg, #fef2f2, #fef3c7)',
    borderColor: '#dc2626',
    boxShadow: '0 4px 20px rgba(220, 38, 38, 0.15)',
  },
  
  mealHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
  },
  
  mealTypeTag: {
    padding: '0.5rem 1.2rem',
    borderRadius: '0px',
    fontSize: '0.75rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    minWidth: '70px',
    textAlign: 'center',
    display: 'inline-block',
    border: 'none',
  },
  
  mealTypeText: {
    color: 'white',
    fontWeight: '700',
  },
  
  vegTag: {
    background: '#10b981',
    color: 'white',
  },
  
  veganTag: {
    background: '#059669',
    color: 'white',
  },
  
  nonVegTag: {
    background: '#ef4444',
    color: 'white',
  },
  
  mealPrice: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#059669',
  },
  
  mealName: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 0.5rem 0',
  },
  
  mealDescription: {
    fontSize: '0.9rem',
    color: '#64748b',
    margin: '0 0 1rem 0',
    lineHeight: '1.4',
  },
  
  mealBadge: {
    background: '#f1f5f9',
    borderRadius: '6px',
    padding: '0.5rem',
    textAlign: 'center',
  },
  
  mealBadgeText: {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: '#374151',
  },
  
  selectedIndicator: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    background: '#3b82f6',
    color: 'white',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.8rem',
    fontWeight: '700',
  },
  
  checkmark: {
    fontSize: '0.8rem',
  },
  
  professionalNote: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    background: 'rgba(59, 130, 246, 0.1)',
    border: '2px solid #3b82f6',
    borderRadius: '12px',
    padding: '1rem',
  },
  
  noteIcon: {
    fontSize: '1.5rem',
    flexShrink: 0,
  },
  
  noteText: {
    fontSize: '0.9rem',
    color: '#1e40af',
    margin: 0,
    lineHeight: '1.4',
    fontStyle: 'italic',
  },
  
  summaryCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    marginBottom: '1.5rem',
  },
  
  summaryTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 1.5rem 0',
    borderBottom: '2px solid #e2e8f0',
    paddingBottom: '0.75rem',
  },
  
  summaryContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  
  summaryRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    padding: '1rem',
    background: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  },
  
  summaryPassenger: {
    display: 'flex',
    alignItems: 'center',
  },
  
  summaryPassengerName: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#374151',
  },
  
  summaryMeal: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  summaryMealName: {
    fontSize: '0.85rem',
    color: '#64748b',
  },
  
  summaryMealPrice: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#059669',
  },
  
  noMealSelected: {
    fontSize: '0.85rem',
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '2px solid #e2e8f0',
    paddingTop: '1rem',
  },
  
  totalLabel: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1e293b',
  },
  
  totalValue: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#059669',
  },
  
  backButtonRow: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginBottom: '1rem',
  },
  
  backButton: {
    background: 'linear-gradient(135deg, #6c757d, #495057)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(108, 117, 125, 0.3)',
  },
  
  actionButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  
  skipButton: {
    background: 'white',
    color: '#6b7280',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    padding: '1rem 1.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  
  continueButton: {
    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '1rem 1.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
  },
  
  buttonPrice: {
    display: 'block',
    fontSize: '0.9rem',
    fontWeight: '500',
    marginTop: '0.25rem',
  },
  
  loadingContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
  },
  
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e5e7eb',
    borderTop: '4px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  
  loadingText: {
    fontSize: '1.1rem',
    color: '#6b7280',
  },
};