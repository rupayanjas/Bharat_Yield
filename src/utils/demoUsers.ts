// Demo users for testing the login system
export const createDemoUsers = () => {
  const demoUsers = [
    {
      id: "demo1",
      name: "Raj Patel",
      email: "farmer@test.com",
      password: "password123",
      phone: "+91 9876543210",
      location: "Ahmedabad, Gujarat",
      farmSize: "medium",
      cropTypes: ["Rice", "Wheat", "Cotton"]
    },
    {
      id: "demo2",
      name: "Priya Sharma",
      email: "priya@test.com",
      password: "demo123",
      phone: "+91 8765432109",
      location: "Jaipur, Rajasthan",
      farmSize: "small",
      cropTypes: ["Vegetables", "Spices"]
    },
    {
      id: "demo3",
      name: "Arjun Singh",
      email: "arjun@test.com",
      password: "test123",
      phone: "+91 7654321098",
      location: "Ludhiana, Punjab",
      farmSize: "large",
      cropTypes: ["Wheat", "Rice", "Sugarcane"]
    }
  ];

  // Check if demo users already exist
  const existingUsers = JSON.parse(localStorage.getItem('bharatYieldUsers') || '[]');
  
  if (existingUsers.length === 0) {
    localStorage.setItem('bharatYieldUsers', JSON.stringify(demoUsers));
    console.log('Demo users created successfully');
  }
};

// Initialize demo users when the module is imported
createDemoUsers();
