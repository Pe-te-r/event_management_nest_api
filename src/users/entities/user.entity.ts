// import db from 'src/Database/index'; // Assuming your Database class is exported from database.ts
// import { Users } from '../users.service';

// interface ReturnType extends Users {
//   role: 'admin' | 'user';
// }
// export class User {
//   constructor() {}
//   async insertUser(user: Users): Promise<ReturnType> {
//     try {
//       const query = `
//         INSERT INTO users
//         (id, first_name, last_name, email, phone, role)
//         VALUES ($1, $2, $3, $4, $5, $6)
//         RETURNING *`;

//       const params = [
//         user.id,
//         user.firstName,
//         user.lastName,
//         user.email,
//         user.phone,
//         'user',
//       ];

//       const result = await db.executeQuery(query, params);
//       console.table(result.rows);
//       return result.rows;
//     } catch (error) {
//       console.error('Failed to insert user:', error);
//       throw error;
//     }
//   }
// }

// const user = new User();
// export default user;
