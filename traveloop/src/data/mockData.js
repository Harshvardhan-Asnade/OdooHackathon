// Traveloop Mock Data

export const currentUser = {
  id: 'u1',
  firstName: 'Harshvardhan',
  lastName: 'Asnade',
  email: 'harsh@traveloop.com',
  phone: '+91 98765 43210',
  city: 'Pune',
  country: 'India',
  avatar: null,
  role: 'user',
};

export const regions = [
  { id: 'r1', name: 'Europe', image: '🏰', color: '#C2654A' },
  { id: 'r2', name: 'Southeast Asia', image: '🏝️', color: '#1A5653' },
  { id: 'r3', name: 'Japan', image: '⛩️', color: '#C9A84C' },
  { id: 'r4', name: 'South America', image: '🌎', color: '#7A9E7E' },
  { id: 'r5', name: 'Africa', image: '🦁', color: '#C47D7D' },
];

export const trips = [
  {
    id: 't1',
    name: 'Paris & Rome Adventure',
    startDate: '2025-06-12',
    endDate: '2025-06-25',
    cities: ['Paris', 'Rome', 'Florence', 'Venice'],
    coverEmoji: '🗼',
    status: 'upcoming',
    travelers: ['James', 'Arjun', 'Jerry', 'Cristina'],
    totalBudget: 20000,
    totalSpent: 22000,
    createdBy: 'James',
  },
  {
    id: 't2',
    name: 'Bali Retreat',
    startDate: '2025-03-01',
    endDate: '2025-03-10',
    cities: ['Ubud', 'Seminyak', 'Nusa Penida'],
    coverEmoji: '🌴',
    status: 'completed',
    travelers: ['Harshvardhan', 'Mayank'],
    totalBudget: 15000,
    totalSpent: 13500,
    createdBy: 'Harshvardhan',
  },
  {
    id: 't3',
    name: 'Tokyo Explorer',
    startDate: '2025-09-05',
    endDate: '2025-09-15',
    cities: ['Tokyo', 'Kyoto', 'Osaka'],
    coverEmoji: '🗾',
    status: 'planning',
    travelers: ['Sathwik', 'Piyush'],
    totalBudget: 25000,
    totalSpent: 0,
    createdBy: 'Sathwik',
  },
];

export const itineraries = {
  t1: {
    sections: [
      {
        id: 's1',
        title: 'Paris Exploration',
        description: 'Arrive in Paris, explore the city of lights. Visit the Eiffel Tower, Louvre Museum, and enjoy authentic French cuisine.',
        dateRange: 'Jun 12 - Jun 16',
        budget: 5000,
        days: [
          {
            day: 1,
            activities: [
              { time: '09:00', name: 'Arrive at Charles de Gaulle', expense: 0 },
              { time: '12:00', name: 'Check-in at Hotel Le Marais', expense: 3000 },
              { time: '15:00', name: 'Walk along Seine River', expense: 0 },
              { time: '19:00', name: 'Dinner at Café de Flore', expense: 800 },
            ],
          },
          {
            day: 2,
            activities: [
              { time: '08:00', name: 'Breakfast at hotel', expense: 0 },
              { time: '10:00', name: 'Eiffel Tower visit', expense: 250 },
              { time: '14:00', name: 'Louvre Museum', expense: 170 },
              { time: '20:00', name: 'Seine river cruise', expense: 450 },
            ],
          },
        ],
      },
      {
        id: 's2',
        title: 'Rome Discovery',
        description: 'Travel to Rome and immerse yourself in ancient history. Colosseum, Vatican, and the best pasta in the world.',
        dateRange: 'Jun 17 - Jun 21',
        budget: 6000,
        days: [
          {
            day: 3,
            activities: [
              { time: '07:00', name: 'Train to Rome (TGV)', expense: 1200 },
              { time: '14:00', name: 'Hotel check-in near Trastevere', expense: 2800 },
              { time: '17:00', name: 'Explore Trastevere neighborhood', expense: 0 },
            ],
          },
          {
            day: 4,
            activities: [
              { time: '09:00', name: 'Colosseum guided tour', expense: 350 },
              { time: '13:00', name: 'Lunch at Roscioli', expense: 600 },
              { time: '15:00', name: 'Roman Forum walk', expense: 0 },
            ],
          },
        ],
      },
      {
        id: 's3',
        title: 'Florence & Venice',
        description: 'Art, architecture and gondola rides. Experience the Renaissance in Florence and romantic Venice.',
        dateRange: 'Jun 22 - Jun 25',
        budget: 4500,
        days: [],
      },
    ],
  },
};

export const packingLists = {
  t1: {
    tripId: 't1',
    categories: [
      {
        name: 'Documents',
        items: [
          { id: 'p1', text: 'Passport', checked: true },
          { id: 'p2', text: 'Flight Tickets (printed)', checked: true },
          { id: 'p3', text: 'Travel Insurance', checked: true },
          { id: 'p4', text: 'Hotel booking confirmation', checked: false },
        ],
      },
      {
        name: 'Clothing',
        items: [
          { id: 'p5', text: 'Casual Shirts', checked: true },
          { id: 'p6', text: 'Trousers / Jeans', checked: false },
          { id: 'p7', text: 'Comfortable walking shoes', checked: false },
          { id: 'p8', text: 'Light jacket / windbreaker', checked: false },
        ],
      },
      {
        name: 'Electronics',
        items: [
          { id: 'p9', text: 'Phone charger', checked: true },
          { id: 'p10', text: 'Universal power adapter', checked: false },
          { id: 'p11', text: 'Earphone / headphones', checked: false },
        ],
      },
    ],
  },
};

export const tripNotes = {
  t1: [
    {
      id: 'n1',
      title: 'Hotel check-in details – Rome stop',
      content: 'Check in after 2pm, room 302, breakfast included (7-10am)',
      day: 3,
      stop: 'Rome',
      date: '2025-06-14',
    },
    {
      id: 'n2',
      title: 'Restaurant reservation – Paris',
      content: 'Le Jules Verne, 8pm, confirmation #JV2025-889. Dress code: smart casual.',
      day: 1,
      stop: 'Paris',
      date: '2025-06-12',
    },
    {
      id: 'n3',
      title: 'Train booking info – Rome to Florence',
      content: 'Trenitalia Frecciarossa, 09:35 departure, car 5 seats 12A-12B. E-ticket saved.',
      day: 5,
      stop: 'Florence',
      date: '2025-06-22',
    },
  ],
};

export const communityPosts = [
  {
    id: 'cp1',
    user: { name: 'Ananya Sharma', avatar: null },
    trip: 'Bali Solo Trip',
    content: 'Just got back from an incredible 2-week Bali trip! The rice terraces in Tegallalang were absolutely magical. Pro tip: visit at sunrise to avoid crowds.',
    likes: 42,
    comments: 8,
    date: '2025-05-08',
  },
  {
    id: 'cp2',
    user: { name: 'Marcus Chen', avatar: null },
    trip: 'Japan Cherry Blossom',
    content: 'Cherry blossom season in Kyoto exceeded all expectations. Philosopher\'s Path was the highlight. Book ryokans at least 3 months in advance!',
    likes: 67,
    comments: 15,
    date: '2025-04-22',
  },
  {
    id: 'cp3',
    user: { name: 'Priya Patel', avatar: null },
    trip: 'Swiss Alps Adventure',
    content: 'Paragliding in Interlaken was a life-changing experience. The views of Jungfrau from above are indescribable. Budget around CHF 180 for tandem flight.',
    likes: 89,
    comments: 23,
    date: '2025-05-01',
  },
  {
    id: 'cp4',
    user: { name: 'David Okafor', avatar: null },
    trip: 'Morocco Discovery',
    content: 'Navigating the Marrakech medina was an adventure in itself! The spice markets are incredible. Don\'t forget to try tagine at Jemaa el-Fnaa square.',
    likes: 34,
    comments: 6,
    date: '2025-04-30',
  },
];

export const invoiceData = {
  tripId: 't1',
  invoiceId: 'INV-xyz-30290',
  generatedDate: 'May 20, 2025',
  paymentStatus: 'pending',
  lineItems: [
    { category: 'Hotel', description: 'Hotel booking Paris', qty: '3 nights', unitCost: 3000, amount: 9000 },
    { category: 'Travel', description: 'Flight bookings (DEL → PAR)', qty: '1', unitCost: 12000, amount: 12000 },
    { category: 'Activities', description: 'Eiffel Tower + Louvre', qty: '2', unitCost: 210, amount: 420 },
    { category: 'Food', description: 'Dining expenses', qty: '5 days', unitCost: 316, amount: 1580 },
  ],
  subtotal: 23000,
  tax: 1150,
  discount: 150,
  grandTotal: 24000,
};

export const adminData = {
  totalUsers: 12847,
  totalTrips: 4523,
  popularCities: [
    { name: 'Paris', trips: 892 },
    { name: 'Tokyo', trips: 756 },
    { name: 'Bali', trips: 634 },
    { name: 'Rome', trips: 521 },
    { name: 'New York', trips: 498 },
  ],
  popularActivities: [
    { name: 'City Walking Tours', count: 2341 },
    { name: 'Museum Visits', count: 1876 },
    { name: 'Beach Activities', count: 1654 },
    { name: 'Hiking', count: 1432 },
    { name: 'Food Tours', count: 1298 },
  ],
  monthlyTrends: [
    { month: 'Jan', users: 820, trips: 290 },
    { month: 'Feb', users: 940, trips: 340 },
    { month: 'Mar', users: 1200, trips: 520 },
    { month: 'Apr', users: 1560, trips: 680 },
    { month: 'May', users: 1890, trips: 790 },
    { month: 'Jun', users: 2100, trips: 920 },
  ],
};

export const searchActivities = [
  { id: 'a1', name: 'Paragliding in Interlaken', location: 'Switzerland', price: '~$180', rating: 4.9 },
  { id: 'a2', name: 'Paragliding in Pokhara', location: 'Nepal', price: '~$70', rating: 4.8 },
  { id: 'a3', name: 'Paragliding in Oludeniz', location: 'Turkey', price: '~$95', rating: 4.7 },
  { id: 'a4', name: 'Paragliding in Chamonix', location: 'France', price: '~$150', rating: 4.6 },
  { id: 'a5', name: 'Paragliding in Queenstown', location: 'New Zealand', price: '~$200', rating: 4.8 },
  { id: 'a6', name: 'Paragliding in Bir Billing', location: 'India', price: '~$30', rating: 4.5 },
  { id: 'a7', name: 'Paragliding in Cape Town', location: 'South Africa', price: '~$85', rating: 4.6 },
];
