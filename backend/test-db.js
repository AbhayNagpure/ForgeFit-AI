const { Client } = require('pg');
const url = "postgresql://postgres.uqgsctggjfhkskgoirnk:Abhay%4012345iit@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres";
const client = new Client({ connectionString: url });
client.connect()
  .then(() => { console.log("Connected successfully!"); client.end(); })
  .catch(e => { console.error("Connection failed:", e.message); client.end(); });
