/** Central contact details — single source of truth for WhatsApp links */
<<<<<<< HEAD
export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '919047270451';
export const WHATSAPP_DISPLAY = '+91 90472 70451';
=======
export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '919940400532';
export const WHATSAPP_DISPLAY = '+91 99404 00532';
>>>>>>> 069ea5d4d0ca58aad666992831fae94bfb00067c
export const SUPPORT_EMAIL = 'dshiners33@gmail.com';
export const HQ_ADDRESS = '5/279, Karur Rd, inside Strings Badminton Academy, Hanifa Nagar, Dindigul, Tamil Nadu 624001';
export const INSTAGRAM_HANDLE = 'majestics_sports_dindigul';
export const INSTAGRAM_URL = 'https://instagram.com/majestics_sports_dindigul';
export const MAPS_URL = 'https://www.google.com/maps/place/Majestic+Sports+Dindigul/@10.379251,77.9898305,17z/data=!3m1!4b1!4m6!3m5!1s0x3b00abae1df3d9cd:0x493478cdf09ed578!8m2!3d10.379251!4d77.9898305!16s%2Fg%2F11x04cw22n?entry=ttu&g_ep=EgoyMDI2MDYwMy4xIKXMDSoASAFQAw%3D%3D';

/** Build a wa.me URL with optional pre-filled message */
export const buildWhatsAppUrl = (message) => {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
};
