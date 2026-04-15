require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Contract = require('./models/Contract');
const Milestone = require('./models/Milestone');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/trustchain');
    
    // Clear existing data
    await User.deleteMany({});
    await Contract.deleteMany({});
    await Milestone.deleteMany({});

    // Create Users with Skills
    const alice = new User({ 
      name: 'Alice Chen', email: 'alice@tc.com', password: 'demo', role: 'client', wallet: '0x8b2F...4c03' 
    });
    const bob = new User({ 
      name: 'Bob Kumar', email: 'bob@tc.com', password: 'demo', role: 'freelancer', wallet: '0x3f4A...9a91',
      skills: ['React', 'Node.js', 'Solidity', 'Web3.js']
    });
    const sara = new User({ 
      name: 'Sara Patel', email: 'sara@tc.com', password: 'demo', role: 'freelancer', wallet: '0x9c3D...2d12',
      skills: ['UI/UX', 'SEO', 'Copywriting']
    });
    await alice.save();
    await bob.save();
    await sara.save();

    // 1. Active Contract
    const c1 = new Contract({
      title: 'Full-stack Web Application',
      description: 'Building a premium dashboard with AI features',
      clientId: alice._id, freelancerId: bob._id, amount: 1.5, status: 'active'
    });
    await c1.save();
    await Milestone.insertMany([
      { contractId: c1._id, name: 'UI Design', amount: 0.4, status: 'approved' },
      { contractId: c1._id, name: 'Backend API', amount: 0.6, status: 'active' }
    ]);

    // 2. Locked Contract
    const c2 = new Contract({
      title: 'Smart Contract Security Audit',
      description: 'Reviewing DeFi protocols for vulnerabilities',
      clientId: alice._id, freelancerId: sara._id, amount: 0.8, status: 'locked'
    });
    await c2.save();

    // 3. Disputed Contract
    const c3 = new Contract({
      title: 'Logo & Brand Identity Kit',
      description: 'Creation of visual assets for new fintech platform',
      clientId: alice._id, freelancerId: bob._id, amount: 0.4, status: 'disputed'
    });
    await c3.save();

    // 4. Completed Contract
    const c4 = new Contract({
      title: 'SEO Content Package (5 Articles)',
      description: 'Optimization and writing for high-traffic keywords',
      clientId: alice._id, freelancerId: sara._id, amount: 0.5, status: 'complete'
    });
    await c4.save();

    console.log('Seed data created successfully with Skills!');
    process.exit();
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seedData();
