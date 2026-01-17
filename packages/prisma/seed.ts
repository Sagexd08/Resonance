import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Create test organization
    const org = await prisma.organization.upsert({
        where: { id: 'org-demo-001' },
        update: {},
        create: {
            id: 'org-demo-001',
            name: 'Demo Company',
            settings: {
                theme: 'dark',
                notificationsEnabled: true,
            },
        },
    });
    console.log('✅ Created organization:', org.name);

    // Create test users
    const passwordHash = await hash('password123', 12);

    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@demo.com' },
        update: {},
        create: {
            id: 'user-admin-001',
            name: 'Admin User',
            email: 'admin@demo.com',
            passwordHash,
            role: 'ADMIN',
            orgId: org.id,
        },
    });
    console.log('✅ Created admin user:', adminUser.email);

    const managerUser = await prisma.user.upsert({
        where: { email: 'manager@demo.com' },
        update: {},
        create: {
            id: 'user-manager-001',
            name: 'Manager User',
            email: 'manager@demo.com',
            passwordHash,
            role: 'MANAGER',
            orgId: org.id,
        },
    });
    console.log('✅ Created manager user:', managerUser.email);

    const employeeUser = await prisma.user.upsert({
        where: { email: 'employee@demo.com' },
        update: {},
        create: {
            id: 'user-employee-001',
            name: 'Employee User',
            email: 'employee@demo.com',
            passwordHash,
            role: 'EMPLOYEE',
            orgId: org.id,
        },
    });
    console.log('✅ Created employee user:', employeeUser.email);

    // Create sample emotional entries
    const today = new Date();
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        await prisma.emotionalEntry.create({
            data: {
                userId: employeeUser.id,
                moodScore: Math.floor(Math.random() * 5) + 1,
                energyScore: Math.floor(Math.random() * 100),
                stressScore: Math.floor(Math.random() * 100),
                note: i === 0 ? 'Feeling productive today!' : null,
                timestamp: date,
            },
        });
    }
    console.log('✅ Created 7 sample emotional entries');

    // Create sample team metrics
    await prisma.teamMetrics.upsert({
        where: { id: 'metrics-demo-001' },
        update: {},
        create: {
            id: 'metrics-demo-001',
            orgId: org.id,
            avgMood: 3.8,
            burnoutIndex: 25.5,
            engagementIndex: 72.3,
            period: '2026-01',
        },
    });
    console.log('✅ Created team metrics');

    console.log('🎉 Seeding complete!');
    console.log('\n📝 Test credentials:');
    console.log('   Admin:    admin@demo.com / password123');
    console.log('   Manager:  manager@demo.com / password123');
    console.log('   Employee: employee@demo.com / password123');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
