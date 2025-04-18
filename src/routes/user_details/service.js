export class UserDetailsService {
  constructor(userDetailModel) {
    this.model = userDetailModel;
  }
  async createUserDetails(userId, data) {
    const { first_name, last_name, phone_number, address, city } = data;

    return await this.model.create({
      user: userId,
      first_name: first_name,
      last_name: last_name,
      phone_number: phone_number,
      address: address,
      city: city,
    });
  }
}
