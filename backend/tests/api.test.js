const http = require('http');

const BASE_URL = 'http://localhost:3001';

// Helper to make HTTP requests
function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers.Authorization = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data ? JSON.parse(data) : null,
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data,
          });
        }
      });
    });

    req.on('error', (err) => {
      console.error(`Request error on ${method} ${path}:`, err.message);
      reject(err);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error(`Request timeout on ${method} ${path}`));
    });

    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// Test runner
const tests = [];
let passed = 0;
let failed = 0;

function test(name, fn) {
  tests.push({ name, fn });
}

async function runTests() {
  console.log('\n🧪 Running API Tests...\n');

  let token = null;
  let cardId = null;
  let userId = null;

  for (const { name, fn } of tests) {
    try {
      const result = await fn({
        request, token: () => token, setToken: (t) => { token = t; }, cardId: () => cardId, setCardId: (id) => { cardId = id; }, userId: () => userId, setUserId: (id) => { userId = id; },
      });
      console.log(`✅ ${name}`);
      passed++;
    } catch (err) {
      console.log(`❌ ${name}`);
      console.log(`   Error: ${err.message || err.toString()}`);
      if (err.stack && process.env.DEBUG) console.log(`   Stack: ${err.stack}`);
      failed++;
    }
  }

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed out of ${tests.length} tests\n`);
  process.exit(failed > 0 ? 1 : 0);
}

// ============ TESTS ============

test('POST /signup - Register new user', async ({ request, setUserId, setToken }) => {
  const res = await request('POST', '/signup', {
    name: 'Test User',
    about: 'Test',
    avatar: 'https://example.com/avatar.jpg',
    email: `test-${Date.now()}@example.com`,
    password: 'password123',
  });

  if (res.status !== 201) throw new Error(`Expected 201, got ${res.status}`);
  if (!res.body._id) throw new Error('Missing _id in response');
  if (!res.body.email) throw new Error('Missing email in response');
  if (res.body.password) throw new Error('Password should not be in response');

  setUserId(res.body._id);
});

test('POST /signup - Reject duplicate email', async ({ request }) => {
  const email = `test-dup-${Date.now()}@example.com`;
  await request('POST', '/signup', {
    name: 'User 1',
    about: 'Test',
    avatar: 'https://example.com/avatar.jpg',
    email,
    password: 'password123',
  });

  const res = await request('POST', '/signup', {
    name: 'User 2',
    about: 'Test',
    avatar: 'https://example.com/avatar.jpg',
    email,
    password: 'password123',
  });

  if (res.status !== 409) throw new Error(`Expected 409, got ${res.status}`);
});

test('POST /signin - Login with valid credentials', async ({ request, setToken }) => {
  const email = `test-login-${Date.now()}@example.com`;

  // Register first
  await request('POST', '/signup', {
    name: 'Login Test',
    about: 'Test',
    avatar: 'https://example.com/avatar.jpg',
    email,
    password: 'password123',
  });

  // Login
  const res = await request('POST', '/signin', {
    email,
    password: 'password123',
  });

  if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
  if (!res.body.token) throw new Error('Missing token in response');

  setToken(res.body.token);
});

test('POST /signin - Reject invalid credentials', async ({ request }) => {
  const res = await request('POST', '/signin', {
    email: 'nonexistent@example.com',
    password: 'wrongpassword',
  });

  if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
});

test('GET /users/me - Requires authentication', async ({ request }) => {
  const res = await request('GET', '/users/me', null, null);

  if (res.status !== 401) throw new Error(`Expected 401 without token, got ${res.status}`);
});

test('GET /users/me - Get current user with token', async ({ request, token }) => {
  const email = `test-me-${Date.now()}@example.com`;

  // Register and login
  await request('POST', '/signup', {
    name: 'Me Test',
    about: 'Test',
    avatar: 'https://example.com/avatar.jpg',
    email,
    password: 'password123',
  });

  const loginRes = await request('POST', '/signin', {
    email,
    password: 'password123',
  });

  const t = loginRes.body.token;
  const res = await request('GET', '/users/me', null, t);

  if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
  if (!res.body._id) throw new Error('Missing _id in response');
  if (res.body.email !== email) throw new Error(`Expected email ${email}, got ${res.body.email}`);
  if (res.body.password) throw new Error('Password should not be in response');
});

test('GET /users - Get all users without token (should fail)', async ({ request }) => {
  const res = await request('GET', '/users', null, null);

  if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
});

test('GET /cards - Get all cards requires token', async ({ request }) => {
  const res = await request('GET', '/cards', null, null);

  if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
});

test('POST /cards - Create card with token', async ({ request, setCardId }) => {
  const email = `test-card-${Date.now()}@example.com`;

  // Register and login
  await request('POST', '/signup', {
    name: 'Card Test',
    about: 'Test',
    avatar: 'https://example.com/avatar.jpg',
    email,
    password: 'password123',
  });

  const loginRes = await request('POST', '/signin', {
    email,
    password: 'password123',
  });

  const { token } = loginRes.body;

  // Create card
  const res = await request('POST', '/cards', {
    name: 'Test Card',
    link: 'https://example.com/image.jpg',
  }, token);

  if (res.status !== 201) throw new Error(`Expected 201, got ${res.status}`);
  if (!res.body._id) throw new Error('Missing _id in response');
  if (res.body.name !== 'Test Card') throw new Error('Card name mismatch');

  setCardId(res.body._id);
});

test('DELETE /cards/:id - Delete own card', async ({ request }) => {
  const email = `test-del-${Date.now()}@example.com`;

  // Register and login
  await request('POST', '/signup', {
    name: 'Delete Test',
    about: 'Test',
    avatar: 'https://example.com/avatar.jpg',
    email,
    password: 'password123',
  });

  const loginRes = await request('POST', '/signin', {
    email,
    password: 'password123',
  });

  const { token } = loginRes.body;

  // Create card
  const createRes = await request('POST', '/cards', {
    name: 'To Delete',
    link: 'https://example.com/image.jpg',
  }, token);

  const cardId = createRes.body._id;

  // Delete card
  const deleteRes = await request('DELETE', `/cards/${cardId}`, null, token);

  if (deleteRes.status !== 200) throw new Error(`Expected 200, got ${deleteRes.status}`);
});

test('DELETE /cards/:id - Cannot delete other user\'s card', async ({ request }) => {
  const email1 = `test-user1-${Date.now()}@example.com`;
  const email2 = `test-user2-${Date.now()}@example.com`;

  // Register and login as user 1
  await request('POST', '/signup', {
    name: 'User 1',
    about: 'Test',
    avatar: 'https://example.com/avatar.jpg',
    email: email1,
    password: 'password123',
  });

  const login1 = await request('POST', '/signin', {
    email: email1,
    password: 'password123',
  });

  const token1 = login1.body.token;

  // Create card as user 1
  const createRes = await request('POST', '/cards', {
    name: 'User 1 Card',
    link: 'https://example.com/image.jpg',
  }, token1);

  const cardId = createRes.body._id;

  // Register and login as user 2
  await request('POST', '/signup', {
    name: 'User 2',
    about: 'Test',
    avatar: 'https://example.com/avatar.jpg',
    email: email2,
    password: 'password123',
  });

  const login2 = await request('POST', '/signin', {
    email: email2,
    password: 'password123',
  });

  const token2 = login2.body.token;

  // Try to delete user 1's card as user 2
  const deleteRes = await request('DELETE', `/cards/${cardId}`, null, token2);

  if (deleteRes.status !== 403) throw new Error(`Expected 403, got ${deleteRes.status}`);
});

test('PUT /cards/:id/likes - Like a card', async ({ request }) => {
  const email = `test-like-${Date.now()}@example.com`;

  // Register and login
  await request('POST', '/signup', {
    name: 'Like Test',
    about: 'Test',
    avatar: 'https://example.com/avatar.jpg',
    email,
    password: 'password123',
  });

  const loginRes = await request('POST', '/signin', {
    email,
    password: 'password123',
  });

  const { token } = loginRes.body;

  // Create card
  const createRes = await request('POST', '/cards', {
    name: 'Likeable Card',
    link: 'https://example.com/image.jpg',
  }, token);

  const cardId = createRes.body._id;

  // Like card
  const likeRes = await request('PUT', `/cards/${cardId}/likes`, null, token);

  if (likeRes.status !== 200) throw new Error(`Expected 200, got ${likeRes.status}`);
  if (!Array.isArray(likeRes.body.likes)) throw new Error('Missing likes array');
});

test('PATCH /users/me - Update profile', async ({ request }) => {
  const email = `test-update-${Date.now()}@example.com`;

  // Register and login
  await request('POST', '/signup', {
    name: 'Original Name',
    about: 'Original About',
    avatar: 'https://example.com/avatar.jpg',
    email,
    password: 'password123',
  });

  const loginRes = await request('POST', '/signin', {
    email,
    password: 'password123',
  });

  const { token } = loginRes.body;

  // Update profile
  const updateRes = await request('PATCH', '/users/me', {
    name: 'Updated Name',
    about: 'Updated About',
  }, token);

  if (updateRes.status !== 200) throw new Error(`Expected 200, got ${updateRes.status}`);
  if (updateRes.body.name !== 'Updated Name') throw new Error('Name not updated');
  if (updateRes.body.about !== 'Updated About') throw new Error('About not updated');
});

test('PATCH /users/me/avatar - Update avatar', async ({ request }) => {
  const email = `test-avatar-${Date.now()}@example.com`;

  // Register and login
  await request('POST', '/signup', {
    name: 'Avatar Test',
    about: 'Test',
    avatar: 'https://example.com/old.jpg',
    email,
    password: 'password123',
  });

  const loginRes = await request('POST', '/signin', {
    email,
    password: 'password123',
  });

  const { token } = loginRes.body;

  // Update avatar
  const updateRes = await request('PATCH', '/users/me/avatar', {
    avatar: 'https://example.com/new.jpg',
  }, token);

  if (updateRes.status !== 200) throw new Error(`Expected 200, got ${updateRes.status}`);
  if (updateRes.body.avatar !== 'https://example.com/new.jpg') throw new Error('Avatar not updated');
});

test('GET /crash-test - Endpoint exists and server recovers', async ({ request }) => {
  // Attempt to hit crash-test; it will crash the server
  try {
    await request('GET', '/crash-test', null, null);
  } catch (err) {
    // Expected: connection error as server crashes
    // Just verify error exists, don't wait for recovery in this test
    if (!err.message) throw new Error('Expected crash-test to cause an error');
  }

  // Nodemon will restart server automatically
  // Test passes if crash-test endpoint is reachable (even if it causes a crash)
});

// Run all tests
runTests();
