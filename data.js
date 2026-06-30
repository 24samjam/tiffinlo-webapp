// data.js. Shared data for Tiffinlo web app.
// NOTE: regional language lines below are drafts. Get a native speaker to verify
// the Kannada, Tamil, Telugu, Gujarati and Malayalam lines before going live.

// Hero headline. The brand word "tiffinlo" stays constant in the middle,
// the words around it cycle across languages.
export const HERO_PHRASES = [
  { code: 'hi', prefix: 'बेटा, ', suffix: ' लगा देना।' },
  { code: 'kn', prefix: 'ಮಗು, ', suffix: ' ಹಚ್ಚಿಸಿಬಿಡು.' },
  { code: 'ta', prefix: 'செல்லம், ', suffix: ' போட்டுக்கோ.' },
  { code: 'te', prefix: 'బాబు, ', suffix: ' పెట్టించుకో.' },
  { code: 'gu', prefix: 'બેટા, ', suffix: ' રખાવી દે.' },
  { code: 'ml', prefix: 'മോനേ, ', suffix: ' ഏർപ്പാടാക്കിക്കോ.' },
  { code: 'en', prefix: 'Beta, ', suffix: ' laga dena.' }
];

// Avatar badge cycles the first letter of the name across scripts.
export const AVATAR_LETTERS = ['t', 'त', 'ತ', 'ட', 'త', 'ત', 'ട'];

// Pilot areas with pincodes. Peenya 560058, Yashwantpur 560022.
export const AREAS = [
  { name: 'Peenya', pincode: '560058', hub: 'Peenya' },
  { name: 'Shivapura', pincode: '560058', hub: 'Peenya' },
  { name: 'Nagara Bavi', pincode: '560058', hub: 'Peenya' },
  { name: 'Netaji Nagar', pincode: '560058', hub: 'Peenya' },
  { name: 'Chokkasandra', pincode: '560058', hub: 'Peenya' },
  { name: 'Vidya Nagar', pincode: '560058', hub: 'Peenya' },
  { name: 'Rajagopala Nagar', pincode: '560058', hub: 'Peenya' },
  { name: 'Ganapathy Nagar', pincode: '560058', hub: 'Peenya' },
  { name: 'Maruthi Nagar', pincode: '560058', hub: 'Peenya' },
  { name: 'Amaravathi Layout', pincode: '560058', hub: 'Peenya' },
  { name: 'Nalagadderanahalli', pincode: '560058', hub: 'Peenya' },
  { name: 'Yashwantpur', pincode: '560022', hub: 'Yashwantpur' },
  { name: 'Goraguntepalya', pincode: '560022', hub: 'Yashwantpur' },
  { name: 'Nandini Layout', pincode: '560022', hub: 'Yashwantpur' },
  { name: 'MSK Nagar', pincode: '560022', hub: 'Yashwantpur' },
  { name: 'Goutham Nagar', pincode: '560022', hub: 'Yashwantpur' },
  { name: 'Yeshwanthpur Industrial Area', pincode: '560022', hub: 'Yashwantpur' },
  { name: 'Mathikere', pincode: '560022', hub: 'Yashwantpur' },
  { name: 'Mahalakshmi Layout', pincode: '560022', hub: 'Yashwantpur' }
];

export const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
  'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal', 'Jammu and Kashmir', 'Ladakh',
  'Puducherry', 'Chandigarh', 'Andaman and Nicobar Islands'
];

export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Plans. No one year. Per meal rate drops with longer plans.
// Total = perMeal x daysPerWeek x weeks.
export const PLANS = [
  { id: 'trial', label: '1 week trial', weeks: 1, perMeal: 120 },
  { id: '1m', label: '1 month', weeks: 4, perMeal: 110 },
  { id: '3m', label: '3 months', weeks: 12, perMeal: 100 },
  { id: '6m', label: '6 months', weeks: 24, perMeal: 90 }
];

// Placeholder licensed stock from Unsplash. Swap with real Peenya kitchen photos.
export const IMAGES = {
  heroThali: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=900&q=80',
  motherCooking: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=900&q=80',
  kitchenHygiene: 'https://images.unsplash.com/photo-1581349485608-9469926a8e5e?auto=format&fit=crop&w=900&q=80',
  pool: [
    'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=600&q=80'
  ]
};

// Sample menu, placeholder. No prices on the landing showcase.
export const MENU = [
  {
    cuisine: 'North Indian',
    dishes: ['Rajma Chawal', 'Paneer Butter Masala', 'Dal Makhani', 'Aloo Gobi', 'Chole', 'Jeera Rice', 'Mix Veg', 'Kadhi Chawal']
  },
  {
    cuisine: 'South Indian',
    dishes: ['Masala Dosa', 'Idli Sambar', 'Bisi Bele Bath', 'Curd Rice', 'Vegetable Stew', 'Lemon Rice', 'Rava Upma', 'Tomato Rice']
  },
  {
    cuisine: 'Gujarati',
    dishes: ['Dhokla', 'Undhiyu', 'Gujarati Kadhi', 'Thepla', 'Dal Dhokli', 'Khandvi', 'Sev Tameta', 'Bhindi Sambhariya']
  },
  {
    cuisine: 'Jain',
    dishes: ['Jain Paneer Bhurji', 'Jain Veg Pulao', 'Jain Dal Fry', 'Jain Sev Tamatar', 'Jain Khichdi', 'Jain Dhokla', 'Jain Bhindi Masala', 'Jain Paratha']
  }
];

export const SOCIAL = {
  instagram: 'https://instagram.com/tiffinlo',
  x: 'https://x.com/tiffinlo',
  facebook: 'https://facebook.com/tiffinlo',
  youtube: 'https://youtube.com/@tiffinlo'
};
