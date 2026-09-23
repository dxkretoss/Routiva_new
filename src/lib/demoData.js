// Seed Commuters and Ahmedabad Commute Routes Data

export const DEMO_COMMUTERS = [
  {
    userId: 'user_rahul_01',
    email: 'rahul.sharma@example.com',
    role: 'rider',
    profile: {
      id: 'user_rahul_01',
      full_name: 'Rahul Sharma',
      age: 29,
      gender: 'male',
      occupation_type: 'Software Engineer',
      profession: 'Tech Lead at GIFT City Fintech',
      city: 'Ahmedabad',
      area: 'Nikol',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      rating: 4.95,
      trips_completed: 184,
      phone_verified: true,
      identity_verified: true
    },
    vehicle: {
      vehicle_type: 'car',
      brand: 'Hyundai',
      model: 'i20 Asta (O) Petrol',
      colour: 'Polar White',
      registration_number: 'GJ 01 KB 4821',
      available_seats: 2,
      vehicle_image_url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80'
    },
    commute: {
      id: 'commute_rahul_01',
      user_id: 'user_rahul_01',
      commute_type: 'rider',
      start_location: 'Nikol',
      destination_location: 'Thaltej',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      departure_time: '8:30 AM',
      flexibility_minutes: 15,
      return_time: '6:30 PM',
      contribution_type: 'petrol_split',
      contribution_amount: 55,
      available_seats: 2,
      status: 'active',
      route_points: [
        { name: 'Naroda', sequence_order: 1 },
        { name: 'Memco', sequence_order: 2 },
        { name: 'Shahibaug', sequence_order: 3 },
        { name: 'Income Tax', sequence_order: 4 },
        { name: 'Vijay Cross Road', sequence_order: 5 },
        { name: 'Gurukul', sequence_order: 6 }
      ],
      preferred_route_points: [
        { name: 'Near Naroda Bridge', point_type: 'pickup', sequence_order: 1 },
        { name: 'Near Airport Road Circle', point_type: 'pickup', sequence_order: 2 },
        { name: 'Navrangpura Bus Stop', point_type: 'drop', sequence_order: 1 },
        { name: 'Gujarat University', point_type: 'drop', sequence_order: 2 }
      ]
    }
  },
  {
    userId: 'user_priya_02',
    email: 'priya.patel@example.com',
    role: 'rider',
    profile: {
      id: 'user_priya_02',
      full_name: 'Priya Patel',
      age: 27,
      gender: 'female',
      occupation_type: 'Product Designer',
      profession: 'UI/UX Designer at SG Highway Agency',
      city: 'Ahmedabad',
      area: 'Bapunagar',
      avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      rating: 4.90,
      trips_completed: 92,
      phone_verified: true,
      identity_verified: true
    },
    vehicle: {
      vehicle_type: 'car',
      brand: 'Tata',
      model: 'Nexon EV Dark Edition',
      colour: 'Midnight Black',
      registration_number: 'GJ 27 AK 9934',
      available_seats: 3,
      vehicle_image_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80'
    },
    commute: {
      id: 'commute_priya_02',
      user_id: 'user_priya_02',
      commute_type: 'rider',
      start_location: 'Bapunagar',
      destination_location: 'SG Highway',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      departure_time: '9:00 AM',
      flexibility_minutes: 20,
      return_time: '7:00 PM',
      contribution_type: 'petrol_split',
      contribution_amount: 45,
      available_seats: 3,
      status: 'active',
      route_points: [
        { name: 'Shahibaug', sequence_order: 1 },
        { name: 'Income Tax', sequence_order: 2 },
        { name: 'Vijay Cross Road', sequence_order: 3 },
        { name: 'Gurukul', sequence_order: 4 },
        { name: 'Science City', sequence_order: 5 }
      ],
      preferred_route_points: [
        { name: 'Memnagar Cross Road', point_type: 'drop', sequence_order: 1 }
      ]
    }
  },
  {
    userId: 'user_ananya_03',
    email: 'ananya.desai@example.com',
    role: 'seeker',
    profile: {
      id: 'user_ananya_03',
      full_name: 'Ananya Desai',
      age: 25,
      gender: 'female',
      occupation_type: 'Financial Analyst',
      profession: 'Equity Analyst at Navrangpura',
      city: 'Ahmedabad',
      area: 'Nikol',
      avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      rating: 4.88,
      trips_completed: 64,
      phone_verified: true,
      identity_verified: true
    },
    vehicle: null,
    commute: {
      id: 'commute_ananya_03',
      user_id: 'user_ananya_03',
      commute_type: 'seeker',
      start_location: 'Nikol',
      destination_location: 'Vijay Cross Road',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      departure_time: '8:35 AM',
      flexibility_minutes: 15,
      return_time: '6:45 PM',
      contribution_type: 'petrol_split',
      contribution_amount: 50,
      available_seats: 1,
      status: 'active',
      route_points: [],
      preferred_route_points: []
    }
  },
  {
    userId: 'user_vikram_04',
    email: 'vikram.mehta@example.com',
    role: 'rider',
    profile: {
      id: 'user_vikram_04',
      full_name: 'Vikram Mehta',
      age: 34,
      gender: 'male',
      occupation_type: 'Corporate Lawyer',
      profession: 'Senior Associate at Gandhinagar High Court',
      city: 'Ahmedabad',
      area: 'Maninagar',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      rating: 4.92,
      trips_completed: 210,
      phone_verified: true,
      identity_verified: true
    },
    vehicle: {
      vehicle_type: 'car',
      brand: 'Honda',
      model: 'City ZX i-VTEC',
      colour: 'Lunar Silver',
      registration_number: 'GJ 01 RG 7701',
      available_seats: 2,
      vehicle_image_url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80'
    },
    commute: {
      id: 'commute_vikram_04',
      user_id: 'user_vikram_04',
      commute_type: 'rider',
      start_location: 'Maninagar',
      destination_location: 'Infocity Gandhinagar',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      departure_time: '8:45 AM',
      flexibility_minutes: 15,
      return_time: '6:15 PM',
      contribution_type: 'petrol_split',
      contribution_amount: 70,
      available_seats: 2,
      status: 'active',
      route_points: [
        { name: 'Paldi', sequence_order: 1 },
        { name: 'Income Tax', sequence_order: 2 },
        { name: 'Shahibaug', sequence_order: 3 },
        { name: 'Chandkheda', sequence_order: 4 },
        { name: 'GIFT City', sequence_order: 5 }
      ],
      preferred_route_points: [
        { name: 'Visat Circle Petrol Pump', point_type: 'pickup', sequence_order: 1 },
        { name: 'Infocity Tower 2 Gate', point_type: 'drop', sequence_order: 1 }
      ]
    }
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif_welcome',
    type: 'welcome',
    title: 'Welcome to Routiva',
    message: 'Your account is verified. Set up your daily commute route to get matched with commuters along your exact path.',
    is_read: false,
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'notif_match',
    type: 'new_match',
    title: 'New 96% Match Found!',
    message: 'Rahul Sharma travels Nikol → Thaltej at 8:30 AM. His route includes your Vijay Cross Road drop point.',
    is_read: false,
    created_at: new Date(Date.now() - 1800000).toISOString()
  }
];
