import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create a test admin user
  const adminPassword = await hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('Admin user created:', admin.email);

  // Create a test restaurant owner
  const ownerPassword = await hash('owner123', 12);
  const owner = await prisma.user.upsert({
    where: { email: 'owner@example.com' },
    update: {},
    create: {
      email: 'owner@example.com',
      name: 'Restaurant Owner',
      password: ownerPassword,
      role: 'RESTAURANT_OWNER',
    },
  });
  console.log('Restaurant owner created:', owner.email);

  // Create a test customer
  const customerPassword = await hash('customer123', 12);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      name: 'Test Customer',
      password: customerPassword,
      role: 'CUSTOMER',
    },
  });
  console.log('Test customer created:', customer.email);

  // Create restaurants
  const deliciousBites = await prisma.restaurant.upsert({
    where: { id: 'test-restaurant-1' },
    update: {},
    create: {
      id: 'test-restaurant-1',
      name: 'Delicious Bites',
      description: 'A restaurant with a variety of delicious dishes.',
      address: '123 Food St, Foodville',
      phone: '555-123-4567',
      email: 'contact@deliciousbites.com',
      owner: {
        connect: { id: owner.id },
      },
    },
  });
  console.log('Restaurant created:', deliciousBites.name);

  const italianDelight = await prisma.restaurant.upsert({
    where: { id: 'italian-delight' },
    update: {},
    create: {
      id: 'italian-delight',
      name: 'Italian Delight',
      description: 'Authentic Italian cuisine',
      address: '123 Main St',
      phone: '555-555-1234',
      email: 'contact@italiandelight.com',
      owner: {
        connect: { id: owner.id },
      },
    },
  });
  console.log('Restaurant created:', italianDelight.name);

  const spicyIndian = await prisma.restaurant.upsert({
    where: { id: 'spicy-indian' },
    update: {},
    create: {
      id: 'spicy-indian',
      name: 'Spicy Indian',
      description: 'Best Indian food in town',
      address: '456 Curry Ave',
      phone: '555-555-5678',
      email: 'contact@spicyindian.com',
      owner: {
        connect: { id: owner.id },
      },
    },
  });
  console.log('Restaurant created:', spicyIndian.name);

  const dragonWok = await prisma.restaurant.upsert({
    where: { id: 'dragon-wok' },
    update: {},
    create: {
      id: 'dragon-wok',
      name: 'Dragon Wok',
      description: 'Authentic Chinese cuisine',
      address: '789 Dragon St',
      phone: '555-555-9012',
      email: 'contact@dragonwok.com',
      owner: {
        connect: { id: owner.id },
      },
    },
  });
  console.log('Restaurant created:', dragonWok.name);

  const mexicanFiesta = await prisma.restaurant.upsert({
    where: { id: 'mexican-fiesta' },
    update: {},
    create: {
      id: 'mexican-fiesta',
      name: 'Mexican Fiesta',
      description: 'Authentic Mexican tacos, burritos, and more',
      address: '567 Taco Way',
      phone: '555-555-3456',
      email: 'contact@mexicanfiesta.com',
      owner: {
        connect: { id: owner.id },
      },
    },
  });
  console.log('Restaurant created:', mexicanFiesta.name);

  // Create menu items for Delicious Bites
  const deliciousBitesMenuItems = await Promise.all([
    prisma.menuItem.upsert({
      where: { id: 'test-item-1' },
      update: {
        category: 'pizza',
      },
      create: {
        id: 'test-item-1',
        name: 'Margherita Pizza',
        description: 'Classic pizza with tomato sauce and mozzarella.',
        price: 12.99,
        category: 'pizza',
        restaurant: {
          connect: { id: deliciousBites.id },
        },
      },
    }),
    prisma.menuItem.upsert({
      where: { id: 'test-item-2' },
      update: {
        category: 'salad',
      },
      create: {
        id: 'test-item-2',
        name: 'Caesar Salad',
        description: 'Fresh romaine lettuce with Caesar dressing.',
        price: 8.99,
        category: 'salad',
        restaurant: {
          connect: { id: deliciousBites.id },
        },
      },
    }),
    prisma.menuItem.upsert({
      where: { id: 'test-item-3' },
      update: {
        category: 'pasta',
      },
      create: {
        id: 'test-item-3',
        name: 'Spaghetti Carbonara',
        description: 'Spaghetti with a creamy sauce, eggs, and bacon.',
        price: 14.99,
        category: 'pasta',
        restaurant: {
          connect: { id: deliciousBites.id },
        },
      },
    }),
    prisma.menuItem.upsert({
      where: { id: 'test-item-4' },
      update: {},
      create: {
        id: 'test-item-4',
        name: 'Chicken Parmesan',
        description: 'Breaded chicken topped with marinara and melted cheese.',
        price: 16.99,
        category: 'main',
        restaurant: {
          connect: { id: deliciousBites.id },
        },
      },
    }),
    prisma.menuItem.upsert({
      where: { id: 'test-item-5' },
      update: {},
      create: {
        id: 'test-item-5',
        name: 'Chocolate Cake',
        description: 'Rich chocolate cake with fudge frosting.',
        price: 7.99,
        category: 'dessert',
        restaurant: {
          connect: { id: deliciousBites.id },
        },
      },
    }),
  ]);
  console.log(`${deliciousBitesMenuItems.length} menu items created for Delicious Bites`);

  // Create menu items for Italian Delight
  const italianDelightMenuItems = await Promise.all([
    prisma.menuItem.upsert({
      where: { id: 'italian-item-1' },
      update: {},
      create: {
        id: 'italian-item-1',
        name: 'Margherita Pizza',
        description: 'Classic pizza with tomato sauce, fresh mozzarella, and basil.',
        price: 12.99,
        category: 'pizza',
        restaurant: {
          connect: { id: italianDelight.id },
        },
      },
    }),
    prisma.menuItem.upsert({
      where: { id: 'italian-item-2' },
      update: {},
      create: {
        id: 'italian-item-2',
        name: 'Pepperoni Pizza',
        description: 'Traditional pizza topped with pepperoni slices and cheese.',
        price: 14.99,
        category: 'pizza',
        restaurant: {
          connect: { id: italianDelight.id },
        },
      },
    }),
    prisma.menuItem.upsert({
      where: { id: 'italian-item-3' },
      update: {},
      create: {
        id: 'italian-item-3',
        name: 'Fettuccine Alfredo',
        description: 'Creamy fettuccine pasta with parmesan cheese.',
        price: 13.99,
        category: 'pasta',
        restaurant: {
          connect: { id: italianDelight.id },
        },
      },
    }),
    prisma.menuItem.upsert({
      where: { id: 'italian-item-4' },
      update: {},
      create: {
        id: 'italian-item-4',
        name: 'Spaghetti Bolognese',
        description: 'Spaghetti with rich meat sauce and parmesan.',
        price: 13.99,
        category: 'pasta',
        restaurant: {
          connect: { id: italianDelight.id },
        },
      },
    }),
    prisma.menuItem.upsert({
      where: { id: 'italian-item-5' },
      update: {},
      create: {
        id: 'italian-item-5',
        name: 'Tiramisu',
        description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone.',
        price: 7.99,
        category: 'dessert',
        restaurant: {
          connect: { id: italianDelight.id },
        },
      },
    }),
    prisma.menuItem.upsert({
      where: { id: 'italian-item-6' },
      update: {},
      create: {
        id: 'italian-item-6',
        name: 'Italian Soda',
        description: 'Refreshing flavored soda with cream.',
        price: 3.99,
        category: 'drink',
        restaurant: {
          connect: { id: italianDelight.id },
        },
      },
    }),
  ]);
  console.log(`${italianDelightMenuItems.length} menu items created for Italian Delight`);

  // Create menu items for Spicy Indian
  const spicyIndianMenuItems = await Promise.all([
    prisma.menuItem.upsert({
      where: { id: 'indian-item-1' },
      update: {},
      create: {
        id: 'indian-item-1',
        name: 'Butter Chicken',
        description: 'Tender chicken in a creamy tomato sauce.',
        price: 16.99,
        category: 'curry',
        restaurant: {
          connect: { id: spicyIndian.id },
        },
      },
    }),
    prisma.menuItem.upsert({
      where: { id: 'indian-item-2' },
      update: {},
      create: {
        id: 'indian-item-2',
        name: 'Vegetable Biryani',
        description: 'Fragrant rice dish with mixed vegetables and spices.',
        price: 14.99,
        category: 'rice',
        restaurant: {
          connect: { id: spicyIndian.id },
        },
      },
    }),
    prisma.menuItem.upsert({
      where: { id: 'indian-item-3' },
      update: {},
      create: {
        id: 'indian-item-3',
        name: 'Chicken Tikka Masala',
        description: 'Grilled chicken pieces in a spiced curry sauce.',
        price: 15.99,
        category: 'curry',
        restaurant: {
          connect: { id: spicyIndian.id },
        },
      },
    }),
    prisma.menuItem.upsert({
      where: { id: 'indian-item-4' },
      update: {},
      create: {
        id: 'indian-item-4',
        name: 'Garlic Naan',
        description: 'Traditional Indian bread topped with garlic and butter.',
        price: 3.99,
        category: 'bread',
        restaurant: {
          connect: { id: spicyIndian.id },
        },
      },
    }),
    prisma.menuItem.upsert({
      where: { id: 'indian-item-5' },
      update: {},
      create: {
        id: 'indian-item-5',
        name: 'Mango Lassi',
        description: 'Refreshing yogurt drink with mango.',
        price: 4.99,
        category: 'drink',
        restaurant: {
          connect: { id: spicyIndian.id },
        },
      },
    }),
  ]);
  console.log(`${spicyIndianMenuItems.length} menu items created for Spicy Indian`);

  // Create menu items for Dragon Wok
  const dragonWokMenuItems = await Promise.all([
    prisma.menuItem.upsert({
      where: { id: 'chinese-item-1' },
      update: {},
      create: {
        id: 'chinese-item-1',
        name: 'Dim Sum Platter',
        description: 'Assorted steamed dumplings and buns.',
        price: 18.99,
        category: 'appetizer',
        restaurant: {
          connect: { id: dragonWok.id },
        },
      },
    }),
    prisma.menuItem.upsert({
      where: { id: 'chinese-item-2' },
      update: {},
      create: {
        id: 'chinese-item-2',
        name: 'Kung Pao Chicken',
        description: 'Spicy stir-fried chicken with peanuts and vegetables.',
        price: 15.99,
        category: 'main',
        restaurant: {
          connect: { id: dragonWok.id },
        },
      },
    }),
    prisma.menuItem.upsert({
      where: { id: 'chinese-item-3' },
      update: {},
      create: {
        id: 'chinese-item-3',
        name: 'Beef with Broccoli',
        description: 'Tender beef and broccoli in a savory sauce.',
        price: 16.99,
        category: 'main',
        restaurant: {
          connect: { id: dragonWok.id },
        },
      },
    }),
    prisma.menuItem.upsert({
      where: { id: 'chinese-item-4' },
      update: {},
      create: {
        id: 'chinese-item-4',
        name: 'Vegetable Lo Mein',
        description: 'Stir-fried noodles with mixed vegetables.',
        price: 12.99,
        category: 'noodles',
        restaurant: {
          connect: { id: dragonWok.id },
        },
      },
    }),
    prisma.menuItem.upsert({
      where: { id: 'chinese-item-5' },
      update: {},
      create: {
        id: 'chinese-item-5',
        name: 'Sweet and Sour Pork',
        description: 'Crispy pork with pineapple in sweet and sour sauce.',
        price: 14.99,
        category: 'main',
        restaurant: {
          connect: { id: dragonWok.id },
        },
      },
    }),
    prisma.menuItem.upsert({
      where: { id: 'chinese-item-6' },
      update: {},
      create: {
        id: 'chinese-item-6',
        name: 'Jasmine Tea',
        description: 'Traditional Chinese jasmine tea.',
        price: 2.99,
        category: 'drink',
        restaurant: {
          connect: { id: dragonWok.id },
        },
      },
    }),
  ]);
  console.log(`${dragonWokMenuItems.length} menu items created for Dragon Wok`);

  // Create menu items for Mexican Fiesta
  const mexicanFiestaMenuItems = await Promise.all([
    prisma.menuItem.upsert({
      where: { id: 'mexican-item-1' },
      update: {},
      create: {
        id: 'mexican-item-1',
        name: 'Street Tacos',
        description: 'Authentic Mexican street tacos with your choice of meat, onions, and cilantro.',
        price: 12.99,
        category: 'taco',
        restaurant: {
          connect: { id: mexicanFiesta.id },
        },
      },
    }),
    prisma.menuItem.upsert({
      where: { id: 'mexican-item-2' },
      update: {},
      create: {
        id: 'mexican-item-2',
        name: 'Beef Burrito',
        description: 'Large flour tortilla filled with seasoned beef, rice, beans, and cheese.',
        price: 14.99,
        category: 'burrito',
        restaurant: {
          connect: { id: mexicanFiesta.id },
        },
      },
    }),
    prisma.menuItem.upsert({
      where: { id: 'mexican-item-3' },
      update: {},
      create: {
        id: 'mexican-item-3',
        name: 'Chicken Quesadilla',
        description: 'Grilled flour tortilla filled with chicken and cheese, served with salsa and sour cream.',
        price: 13.99,
        category: 'quesadilla',
        restaurant: {
          connect: { id: mexicanFiesta.id },
        },
      },
    }),
    prisma.menuItem.upsert({
      where: { id: 'mexican-item-4' },
      update: {},
      create: {
        id: 'mexican-item-4',
        name: 'Guacamole and Chips',
        description: 'Fresh guacamole made with avocados, lime, and spices, served with tortilla chips.',
        price: 8.99,
        category: 'appetizer',
        restaurant: {
          connect: { id: mexicanFiesta.id },
        },
      },
    }),
    prisma.menuItem.upsert({
      where: { id: 'mexican-item-5' },
      update: {},
      create: {
        id: 'mexican-item-5',
        name: 'Churros',
        description: 'Fried dough pastry with cinnamon sugar, served with chocolate dipping sauce.',
        price: 6.99,
        category: 'dessert',
        restaurant: {
          connect: { id: mexicanFiesta.id },
        },
      },
    }),
    prisma.menuItem.upsert({
      where: { id: 'mexican-item-6' },
      update: {},
      create: {
        id: 'mexican-item-6',
        name: 'Horchata',
        description: 'Sweet rice milk beverage with cinnamon.',
        price: 3.99,
        category: 'drink',
        restaurant: {
          connect: { id: mexicanFiesta.id },
        },
      },
    }),
  ]);
  console.log(`${mexicanFiestaMenuItems.length} menu items created for Mexican Fiesta`);

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 