const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@wanderlust.com';
  const password = 'password123';

  // Check if admin already exists
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    console.log(`Admin user with email ${email} already exists.`);
    return;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create admin user
  const admin = await prisma.adminUser.create({
    data: {
      name: 'Super Admin',
      email: email,
      password: hashedPassword,
      role: 'superadmin',
      status: 'active',
      twoFactorEnabled: false
    },
  });

  console.log('✅ Admin user created successfully!');
  console.log('-----------------------------------');
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
  console.log('-----------------------------------');
  console.log('Please login and change your password immediately.');
}

main()
  .catch((e) => {
    console.error('Error creating admin user:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
