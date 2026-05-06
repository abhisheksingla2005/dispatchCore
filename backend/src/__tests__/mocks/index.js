/**
 * Mock Utilities for Testing
 *
 * Common mocks and test helpers:
 * - Firebase Auth mocking
 * - Database model mocking
 * - Resend email client mocking
 * - HTTP request/response mocking
 */

/**
 * Mock Firebase Admin SDK
 */
const mockFirebaseAuth = () => {
  const users = new Map();

  return {
    createUser: jest.fn(async (props) => {
      const uid = `uid_${Math.random().toString(36).substr(2, 9)}`;
      users.set(uid, { uid, ...props });
      return { uid, ...props };
    }),
    getUserByEmail: jest.fn(async (email) => {
      for (const [uid, user] of users) {
        if (user.email === email) {return user;}
      }
      throw new Error('User not found');
    }),
    verifyIdToken: jest.fn(async (token) => {
      return { uid: 'test_uid', email: 'test@example.com' };
    }),
    deleteUser: jest.fn(async (uid) => {
      users.delete(uid);
    }),
    updateUser: jest.fn(async (uid, props) => {
      const user = users.get(uid);
      users.set(uid, { ...user, ...props });
      return users.get(uid);
    })
  };
};

/**
 * Mock Sequelize Model
 */
const mockSequelizeModel = (name, initialData = []) => {
  const data = [...initialData];

  return {
    findByPk: jest.fn(async (id) => {
      return data.find(item => item.id === id) || null;
    }),
    findOne: jest.fn(async (options) => {
      const where = options?.where || {};
      return data.find(item => {
        for (const key in where) {
          if (item[key] !== where[key]) {return false;}
        }
        return true;
      }) || null;
    }),
    findAll: jest.fn(async (options) => {
      let results = [...data];
      if (options?.where) {
        results = results.filter(item => {
          for (const key in options.where) {
            if (item[key] !== options.where[key]) {return false;}
          }
          return true;
        });
      }
      return results;
    }),
    create: jest.fn(async (values) => {
      const item = { id: data.length + 1, ...values };
      data.push(item);
      return item;
    }),
    update: jest.fn(async (values, options) => {
      const where = options?.where || {};
      let updated = 0;
      data.forEach(item => {
        let matches = true;
        for (const key in where) {
          if (item[key] !== where[key]) {
            matches = false;
            break;
          }
        }
        if (matches) {
          Object.assign(item, values);
          updated++;
        }
      });
      return [updated, data.filter(item => {
        for (const key in where) {
          if (item[key] !== where[key]) {return false;}
        }
        return true;
      })];
    }),
    destroy: jest.fn(async (options) => {
      const where = options?.where || {};
      const initialLength = data.length;
      for (let i = data.length - 1; i >= 0; i--) {
        let matches = true;
        for (const key in where) {
          if (data[i][key] !== where[key]) {
            matches = false;
            break;
          }
        }
        if (matches) {data.splice(i, 1);}
      }
      return initialLength - data.length;
    }),
    bulkCreate: jest.fn(async (values) => {
      return values.map(v => ({ id: data.length + 1, ...v }));
    }),
    count: jest.fn(async (options) => {
      let count = data.length;
      if (options?.where) {
        count = data.filter(item => {
          for (const key in options.where) {
            if (item[key] !== options.where[key]) {return false;}
          }
          return true;
        }).length;
      }
      return count;
    }),
    // Reset state
    __reset: () => data.length = 0,
    __setData: (newData) => {
      data.length = 0;
      data.push(...newData);
    }
  };
};

/**
 * Mock Resend Email Client
 */
const mockResendClient = () => ({
  emails: {
    send: jest.fn(async (options) => {
      return {
        id: `email_${Math.random().toString(36).substr(2, 9)}`,
        from: options.from,
        to: options.to,
        created_at: new Date().toISOString()
      };
    })
  }
});

/**
 * Mock Express Response Object
 */
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.set = jest.fn().mockReturnValue(res);
  res.end = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  res.redirect = jest.fn().mockReturnValue(res);
  return res;
};

/**
 * Mock Express Request Object
 */
const mockRequest = (overrides = {}) => {
  const req = {
    params: {},
    query: {},
    body: {},
    headers: {},
    user: null,
    ...overrides
  };
  req.get = jest.fn((header) => req.headers[header.toLowerCase()]);
  return req;
};

/**
 * Test Data Generators
 */
const generators = {
  user: () => ({
    id: Math.random().toString(36).substr(2, 9),
    email: `test${Math.random()}@example.com`,
    name: 'Test User',
    accountType: 'company',
    createdAt: new Date(),
    updatedAt: new Date()
  }),
  driver: () => ({
    id: Math.random().toString(36).substr(2, 9),
    email: `driver${Math.random()}@example.com`,
    name: 'Test Driver',
    accountType: 'driver',
    createdAt: new Date(),
    updatedAt: new Date()
  }),
  order: () => ({
    id: Math.random().toString(36).substr(2, 9),
    status: 'pending',
    pickupAddress: '123 Main St',
    deliveryAddress: '456 Oak Ave',
    createdAt: new Date(),
    updatedAt: new Date()
  }),
  bid: () => ({
    id: Math.random().toString(36).substr(2, 9),
    orderId: Math.random().toString(36).substr(2, 9),
    driverId: Math.random().toString(36).substr(2, 9),
    amount: 50.00,
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date()
  })
};

module.exports = {
  mockFirebaseAuth,
  mockSequelizeModel,
  mockResendClient,
  mockResponse,
  mockRequest,
  generators
};
