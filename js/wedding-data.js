/**
 * Wedding Invitation Data Configuration
 * Gaurav & Dnyaneshwari | Saturday, 20 February 2027
 * Theme: Luxury Royal Indian Wedding Invitation
 */

const weddingData = {
  // Couple & Family Details
  couple: {
    groom: 'Gaurav Jagtap',
    groomFirstName: 'Gaurav',
    bride: 'Dnyaneshwari Dhaktode',
    brideFirstName: 'Dnyaneshwari',
    groomParents: 'Mr. Kailas & Mrs. Suvarna Jagtap',
    brideParents: 'Mr. Tukaram & Mrs. Sangita Dhaktode',
    monogram: 'GD'
  },

  // Auspicious Invocation & Shloka
  shloka: '॥ श्री गणेशाय नमः ॥',
  shlokaTranslation: 'Om Gan Ganapataye Namo Namah — Invoking the divine blessings of Lord Ganesha',
  invocationIntro: 'WITH THE BLESSINGS OF LORD GANESHA',

  // Formal Invitation Headings
  invitationHeading: 'The Jagtap & Dhaktode families',
  invitationSubheading: 'request the pleasure of your company as their children exchange vows in the company of those they hold dear.',

  // Main Wedding Date (ISO format with timezone offset +05:30 IST)
  weddingDate: '2027-02-20T19:30:00+05:30',
  weddingDateFormatted: 'Saturday, 20 February 2027',
  venueCity: 'Amarapur, Shevgaon, Maharashtra 414505',
  hashtag: '#GauravWedsDnyaneshwari',

  // Background Audio Configuration
  audio: {
    src: 'assets1/vaaroon.m4a',
    title: 'Vaaroon'
  },

  // Scratch-to-Reveal Save the Date Card
  scratchCard: {
    badge: 'A LITTLE SURPRISE',
    title: 'SAVE THE DATE',
    day: 'SATURDAY',
    dateNumber: '20',
    monthYear: 'FEBRUARY · 2027',
    location: 'Amarapur, Shevgaon, Maharashtra',
    scratchText: '✦ SCRATCH TO REVEAL ✦',
    revealButtonText: 'Tap here to reveal instead'
  },

  // Polaroid Couple Photo Gallery ("BIG DAY")
  // Easily swappable photos array
  photoGallery: {
    title: 'BIG DAY',
    photos: [
      {
        id: 'photo-1',
        src: 'assets1/couple-1.jpg',
        caption: 'Shared Joy',
        alt: 'Gaurav & Dnyaneshwari shared joy'
      },
      {
        id: 'photo-2',
        src: 'assets1/couple-2.jpg',
        caption: 'Mehndi Blessings',
        alt: 'Sacred union and mehndi blessings'
      },
      {
        id: 'photo-3',
        src: 'assets1/couple-3.jpg',
        caption: 'Royal Beginnings',
        alt: 'Royal wedding portrait'
      },
      {
        id: 'photo-4',
        src: 'assets1/couple-4.jpg',
        caption: 'Eternal Promise',
        alt: 'Gaurav & Dnyaneshwari celebration'
      }
    ]
  },

  // Exactly 4 Ceremonies: Haldi, Mehndi, Engagement, Marriage
  events: [
    {
      id: 'haldi',
      title: 'Haldi',
      dayDate: 'FRIDAY, 19TH FEBRUARY 2027',
      date: 'Friday, 19 Feb 2027',
      time: '11:00 A.M. ONWARDS',
      venue: 'Shree Lawns',
      address: 'Amarapur, Shevgaon, Maharashtra 414505',
      location: 'Amarapur, Shevgaon, Maharashtra 414505',
      dressCode: 'Shades of yellow',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Shree+Lawns%2C+Amarapur%2C+Shevgaon%2C+Maharashtra+414505',
      startISO: '2027-02-19T11:00:00+05:30',
      endISO: '2027-02-19T15:00:00+05:30',
      icon: '🌼'
    },
    {
      id: 'mehndi',
      title: 'Mehndi',
      dayDate: 'FRIDAY, 19TH FEBRUARY 2027',
      date: 'Friday, 19 Feb 2027',
      time: '04:00 P.M. ONWARDS',
      venue: 'Shree Lawns',
      address: 'Amarapur, Shevgaon, Maharashtra 414505',
      location: 'Amarapur, Shevgaon, Maharashtra 414505',
      dressCode: 'Festive pastels',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Shree+Lawns%2C+Amarapur%2C+Shevgaon%2C+Maharashtra+414505',
      startISO: '2027-02-19T16:00:00+05:30',
      endISO: '2027-02-19T19:30:00+05:30',
      icon: '🌿'
    },
    {
      id: 'engagement',
      title: 'Engagement',
      dayDate: 'FRIDAY, 19TH FEBRUARY 2027',
      date: 'Friday, 19 Feb 2027',
      time: '07:30 P.M. ONWARDS',
      venue: 'Shree Lawns',
      address: 'Amarapur, Shevgaon, Maharashtra 414505',
      location: 'Amarapur, Shevgaon, Maharashtra 414505',
      dressCode: 'Glamorous Evening Elegance',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Shree+Lawns%2C+Amarapur%2C+Shevgaon%2C+Maharashtra+414505',
      startISO: '2027-02-19T19:30:00+05:30',
      endISO: '2027-02-20T00:00:00+05:30',
      icon: '💍'
    },
    {
      id: 'marriage',
      title: 'Marriage',
      dayDate: 'SATURDAY, 20TH FEBRUARY 2027',
      date: 'Saturday, 20 Feb 2027',
      time: '07:30 P.M. ONWARDS',
      venue: 'Shree Lawns',
      address: 'Amarapur, Shevgaon, Maharashtra 414505',
      location: 'Amarapur, Shevgaon, Maharashtra 414505',
      dressCode: 'Royal Traditional Indian Attire',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Shree+Lawns%2C+Amarapur%2C+Shevgaon%2C+Maharashtra+414505',
      startISO: '2027-02-20T19:30:00+05:30',
      endISO: '2027-02-21T01:30:00+05:30',
      icon: '🌸'
    }
  ],

  // RSVP & Family Contacts
  rsvpDeadline: 'Kindly reply by 5 February 2027',
  contact: [
    {
      name: 'Mr. Kailas Jagtap',
      phone: '+91 99999 99999',
      role: "Groom's Family"
    },
    {
      name: 'Mr. Tukaram Dhaktode',
      phone: '+91 88888 88888',
      role: "Bride's Family"
    }
  ],

  // Closing Blessings
  closingMessage: 'Your blessings will make our day complete.'
};

// Expose globally to window
if (typeof window !== 'undefined') {
  window.weddingData = weddingData;
}

// Support CommonJS/ESM
if (typeof module !== 'undefined' && module.exports) {
  module.exports = weddingData;
}
