export class UserService {
  constructor(UserModel, UserDetailModel) {
    this.model = UserModel;
    this.modelDetails = UserDetailModel;
  }

  async getAll() {
    return await this.modelDetails.find().populate({
      path: "user",
      select: "email password",
    });
  }
  async getById(id) {
    return await this.modelDetails.findOne({ user: id }).populate({
      path: "user",
      select: "email password",
    });
  }


  async updateById(id, data) {
    await this.model.findByIdAndUpdate(
      id,
      {
        email: data?.email,
      },
      { new: true }
    );

    return await this.modelDetails.findOneAndUpdate(
      { user: id },
      {
        $set: {
          first_name: data.first_name,
          last_name: data.last_name,
          phone_number: data.phone_number,
          address: data.address,
          city: data.city,
        },
      },
      { new: true, runValidators: true }
    );
  }
  async deleteById(id) {
    return await this.model.findByIdAndDelete(id);
  }
}
