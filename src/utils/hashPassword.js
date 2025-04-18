import bcrypt from 'bcryptjs';  

export class Hash {
    async hashPassword(password) {
        return await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));
    }
}
