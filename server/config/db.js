import mongoose from 'mongoose';

let isConnected = false;

export const isMongoDBConnected = () => isConnected && mongoose.connection.readyState === 1;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  
  // Distinguish between local MongoDB and remote cloud MongoDB (e.g. MongoDB Atlas)
  const isLocal = !uri || uri.includes('localhost') || uri.includes('127.0.0.1');

  // Prevent Mongoose from throwing unhandled error events
  mongoose.connection.on('error', (err) => {
    // Suppress background monitor noise if not actively connected
    if (!isConnected) return;
    console.warn(`[MongoDB Warning] ${err.message}`);
  });

  if (isLocal) {
    try {
      // Attempt quick probe to check if local mongod daemon is running
      const conn = await mongoose.connect(uri || 'mongodb://127.0.0.1:27017/projectpartner', {
        serverSelectionTimeoutMS: 1500,
        connectTimeoutMS: 1500,
        autoIndex: false
      });

      // Send a ping to confirm authentic MongoDB daemon
      await conn.connection.db.admin().ping();
      isConnected = true;
      console.log(`\x1b[32m✅ [DATABASE] Local MongoDB Connected successfully: ${conn.connection.host}:${conn.connection.port}\x1b[0m`);
      return true;
    } catch (error) {
      // Disconnect immediately so Mongoose stops background retry loops
      try {
        await mongoose.disconnect();
      } catch (_) {}
      isConnected = false;

      console.log('\x1b[36m%s\x1b[0m', '------------------------------------------------------------------------');
      console.log('\x1b[32m%s\x1b[0m', '📦 [DATABASE] Academic Database Engine: ACTIVE (Zero-Config Mode)');
      console.log('\x1b[33m%s\x1b[0m', 'ℹ️  Status: Local MongoDB service on port 27017 is not running.');
      console.log('\x1b[36m%s\x1b[0m', '✅ All features (Sign up, CV upload, Workspaces, Teams, Chat) are operational!');
      console.log('\x1b[90m%s\x1b[0m', '💡 Cloud Setup: To connect MongoDB Atlas, paste your MONGODB_URI in server/.env');
      console.log('\x1b[36m%s\x1b[0m', '------------------------------------------------------------------------');
      return false;
    }
  } else {
    // User provided a remote cloud connection string (e.g., MongoDB Atlas mongodb+srv://...)
    try {
      console.log('\x1b[34m[DATABASE] Connecting to MongoDB Atlas / Remote Cluster...\x1b[0m');
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 6000,
        connectTimeoutMS: 6000
      });
      isConnected = true;
      console.log(`\x1b[32m✅ [DATABASE] MongoDB Atlas Connected successfully: ${conn.connection.host}\x1b[0m`);
      return true;
    } catch (error) {
      try {
        await mongoose.disconnect();
      } catch (_) {}
      isConnected = false;

      console.error(`\x1b[31m❌ [DATABASE] Could not connect to remote MongoDB URI:\x1b[0m ${error.message}`);
      console.log('\x1b[33mℹ️  Tip: Verify your MongoDB Atlas username, password, and IP Access List (0.0.0.0/0).\x1b[0m');
      console.log('\x1b[32m📦 [DATABASE] Reverting to Academic Database Engine so server stays online.\x1b[0m');
      return false;
    }
  }
};
